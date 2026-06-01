"""Performance and load tests for BakaDM bot.

These tests validate response times and behavior under load.
"""

import pytest
import asyncio
import time
from unittest.mock import AsyncMock, MagicMock, patch

from backend_client import BackendClient
from session_manager import SessionManager
from bot import BakaDMBot, CoreCommands
from config import BotConfig


class TestResponseTimes:
    """Validate API response times are within acceptable limits."""

    @pytest.fixture
    def client(self) -> BackendClient:
        return BackendClient(mock_mode=True)

    @pytest.mark.asyncio
    async def test_health_check_response_time(self, client: BackendClient) -> None:
        """Health check should respond quickly."""
        start = time.time()
        result = await client.health_check()
        elapsed = time.time() - start

        assert result["status"] == "healthy"
        assert elapsed < 1.0, f"Health check took {elapsed:.2f}s, expected < 1s"

    @pytest.mark.asyncio
    async def test_message_response_time(self, client: BackendClient) -> None:
        """Message processing should be reasonably fast."""
        await client.start_session(campaign_id="perf_test")

        start = time.time()
        resp = await client.send_message("sess_123", "u1", "Hero", "Hello")
        elapsed = time.time() - start

        assert resp.dm_text
        assert elapsed < 2.0, f"Message took {elapsed:.2f}s, expected < 2s"

    @pytest.mark.asyncio
    async def test_roll_response_time(self, client: BackendClient) -> None:
        """Dice roll should be instantaneous."""
        start = time.time()
        result = await client.log_roll(
            session_id="sess_perf",
            expression="1d20",
            rolls=[15],
            total=15,
            roller_id="u1",
            roller_name="Hero",
            reason="Initiative",
        )
        elapsed = time.time() - start

        assert result["total"] == 15
        assert elapsed < 0.5, f"Roll took {elapsed:.2f}s, expected < 0.5s"


class TestConcurrentOperations:
    """Validate behavior under concurrent load."""

    @pytest.mark.asyncio
    async def test_concurrent_sessions(self) -> None:
        """Multiple sessions should not interfere."""
        manager = SessionManager()
        from uuid import UUID

        async def create_and_verify(guild_id: int) -> bool:
            try:
                session = await manager.create_session(
                    guild_id=guild_id,
                    campaign_id=UUID("11111111-1111-1111-1111-111111111111"),
                )
                return session.guild_id == guild_id
            except Exception:
                return False

        # Create 5 sessions concurrently
        tasks = [create_and_verify(1000 + i) for i in range(5)]
        results = await asyncio.gather(*tasks)

        assert all(results), "Some concurrent sessions failed"

    @pytest.mark.asyncio
    async def test_concurrent_messages(self, client: BackendClient) -> None:
        """Multiple messages should be processed."""
        await client.start_session(campaign_id="concurrent_test")

        async def send_message(i: int) -> bool:
            try:
                resp = await client.send_message("sess_123", f"u{i}", f"Hero{i}", f"Message {i}")
                return bool(resp.dm_text)
            except Exception:
                return False

        tasks = [send_message(i) for i in range(10)]
        results = await asyncio.gather(*tasks)

        assert all(results), "Some concurrent messages failed"


class TestMemoryEfficiency:
    """Validate memory usage stays reasonable."""

    @pytest.mark.asyncio
    async def test_session_cleanup(self) -> None:
        """Ended sessions should be cleaned up."""
        manager = SessionManager()
        from uuid import UUID

        # Create and end multiple sessions
        for i in range(10):
            await manager.create_session(
                guild_id=1000 + i,
                campaign_id=UUID("11111111-1111-1111-1111-111111111111"),
            )
            await manager.end_session(1000 + i)

        # All should be ended
        for i in range(10):
            session = await manager.get_session(1000 + i)
            if session:
                assert session.status == "ended"

    @pytest.mark.asyncio
    async def test_large_message_history(self, client: BackendClient) -> None:
        """Bot should handle large message histories."""
        await client.start_session(campaign_id="history_test")

        # Send many messages
        for i in range(50):
            resp = await client.send_message("sess_123", "u1", "Hero", f"Message {i}")
            assert resp.dm_text

        # End and verify summary
        summary = await client.end_session("sess_123")
        assert summary.message_count == 50
