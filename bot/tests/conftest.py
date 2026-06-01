"""Shared pytest fixtures and configuration for BakaDM bot tests."""

import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock

from backend_client import BackendClient, DMResponse, SessionSummary, Campaign
from session_manager import SessionManager, SessionState
from config import BotConfig


# ---------------------------------------------------------------------------
# Event loop policy for async tests
# ---------------------------------------------------------------------------
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ---------------------------------------------------------------------------
# Backend client fixtures
# ---------------------------------------------------------------------------
@pytest.fixture
def backend_client() -> BackendClient:
    """Return a mock-mode backend client."""
    return BackendClient(mock_mode=True)


@pytest.fixture
def backend_client_real() -> BackendClient:
    """Return a real backend client (for integration tests)."""
    return BackendClient(mock_mode=False, base_url="http://localhost:3000/api")


# ---------------------------------------------------------------------------
# Session manager fixtures
# ---------------------------------------------------------------------------
@pytest.fixture
def session_manager() -> SessionManager:
    """Return a fresh session manager."""
    return SessionManager()


@pytest.fixture
async def active_session(session_manager: SessionManager) -> SessionState:
    """Create and return an active session."""
    from uuid import UUID
    session = await session_manager.create_session(
        guild_id=123456,
        campaign_id=UUID("11111111-1111-1111-1111-111111111111"),
    )
    return session


# ---------------------------------------------------------------------------
# Bot config fixture
# ---------------------------------------------------------------------------
@pytest.fixture
def bot_config() -> BotConfig:
    """Return a test bot configuration."""
    return BotConfig(
        discord_token="test_token",
        application_id="123456789",
        backend_api_url="http://localhost:3000/api",
        backend_api_key="test_key",
        log_level="DEBUG",
        guild_ids=[123456],
    )


# ---------------------------------------------------------------------------
# Discord mocks
# ---------------------------------------------------------------------------
@pytest.fixture
def mock_discord_message() -> MagicMock:
    """Return a mocked discord.Message."""
    message = MagicMock()
    message.author.id = 987654321
    message.author.display_name = "TestPlayer"
    message.guild.id = 123456
    message.content = "@BakaDM I search the room"
    message.reply = AsyncMock()
    return message


@pytest.fixture
def mock_discord_context() -> MagicMock:
    """Return a mocked discord.Context."""
    ctx = MagicMock()
    ctx.guild.id = 123456
    ctx.channel.id = 111222333
    ctx.author.id = 987654321
    ctx.author.display_name = "TestPlayer"
    ctx.author.voice = None
    ctx.send = AsyncMock()
    ctx.defer = AsyncMock()
    return ctx


# ---------------------------------------------------------------------------
# Test data fixtures
# ---------------------------------------------------------------------------
@pytest.fixture
def sample_campaign() -> Campaign:
    """Return a sample campaign."""
    return Campaign(
        id="camp_test_001",
        name="Test Campaign",
        status="active",
        created_at="2026-06-01T10:00:00Z",
    )


@pytest.fixture
def sample_dm_response() -> DMResponse:
    """Return a sample DM response."""
    return DMResponse(
        dm_text="Greetings, Thorin. What would you like to do?",
        voice_id="dm_narrator",
        tool_results=[],
        ui_updates=[{"type": "narrative", "text": "Thorin acts..."}],
        usage={"input_tokens": 1000, "output_tokens": 50, "model": "claw-dm-stub"},
    )


@pytest.fixture
def sample_session_summary() -> SessionSummary:
    """Return a sample session summary."""
    return SessionSummary(
        session_id="sess_test_001",
        duration_minutes=42,
        message_count=5,
        summary="A brief adventure.",
        usage_total={"input_tokens": 5000, "output_tokens": 250, "voice_minutes": 0.0, "tts_characters": 0},
    )
