"""API contract tests — validate backend API responses match expected schemas.

These tests ensure the bot and backend stay in sync.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from backend_client import BackendClient, DMResponse, SessionSummary, Campaign


class TestAPIContracts:
    """Validate API response contracts."""

    @pytest.fixture
    def client(self) -> BackendClient:
        return BackendClient(mock_mode=True)

    @pytest.mark.asyncio
    async def test_health_response_schema(self, client: BackendClient) -> None:
        """Validate health check returns expected schema."""
        result = await client.health_check()
        assert isinstance(result, dict)
        assert "status" in result
        assert "services" in result
        assert isinstance(result["services"], dict)

    @pytest.mark.asyncio
    async def test_campaign_response_schema(self, client: BackendClient) -> None:
        """Validate campaign creation returns expected schema."""
        campaign = await client.create_campaign(name="Test", guild_id="123")
        assert isinstance(campaign, Campaign)
        assert hasattr(campaign, "id")
        assert hasattr(campaign, "name")
        assert hasattr(campaign, "status")
        assert hasattr(campaign, "created_at")

    @pytest.mark.asyncio
    async def test_session_response_schema(self, client: BackendClient) -> None:
        """Validate session start returns expected schema."""
        session = await client.start_session(campaign_id="camp_123")
        assert isinstance(session, dict)
        assert "session_id" in session
        assert "status" in session
        assert "campaign_id" in session

    @pytest.mark.asyncio
    async def test_dm_response_schema(self, client: BackendClient) -> None:
        """Validate DM response has all required fields."""
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message("sess_123", "u1", "Hero", "Hello")
        assert isinstance(resp, DMResponse)
        assert hasattr(resp, "dm_text")
        assert hasattr(resp, "voice_id")
        assert hasattr(resp, "tool_results")
        assert hasattr(resp, "ui_updates")
        assert hasattr(resp, "usage")

    @pytest.mark.asyncio
    async def test_summary_response_schema(self, client: BackendClient) -> None:
        """Validate session summary has all required fields."""
        await client.start_session(campaign_id="camp_123")
        summary = await client.end_session("sess_123")
        assert isinstance(summary, SessionSummary)
        assert hasattr(summary, "session_id")
        assert hasattr(summary, "duration_minutes")
        assert hasattr(summary, "message_count")
        assert hasattr(summary, "summary")
        assert hasattr(summary, "usage_total")


class TestErrorHandling:
    """Validate error responses are handled gracefully."""

    @pytest.mark.asyncio
    async def test_invalid_session_id(self) -> None:
        """Validate handling of invalid session ID."""
        client = BackendClient(mock_mode=True)
        # Mock mode should handle gracefully
        try:
            await client.send_message("invalid_session", "u1", "Hero", "Hello")
        except Exception as e:
            # Should either work in mock mode or raise a clean error
            assert "session" in str(e).lower() or "not found" in str(e).lower()

    @pytest.mark.asyncio
    async def test_empty_message(self) -> None:
        """Validate handling of empty messages."""
        client = BackendClient(mock_mode=True)
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message("sess_123", "u1", "Hero", "")
        assert isinstance(resp, DMResponse)
        assert resp.dm_text  # Should still return a response
