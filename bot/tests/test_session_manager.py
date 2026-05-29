"""Tests for session_manager.py."""

import asyncio
import pytest
from uuid import UUID

from session_manager import SessionManager


@pytest.fixture
def manager() -> SessionManager:
    return SessionManager()


@pytest.mark.asyncio
async def test_create_session(manager: SessionManager) -> None:
    session = await manager.create_session(
        guild_id=123,
        campaign_id=UUID("11111111-1111-1111-1111-111111111111"),
    )
    assert session.guild_id == 123
    assert session.status == "active"


@pytest.mark.asyncio
async def test_duplicate_session_raises(manager: SessionManager) -> None:
    campaign_id = UUID("11111111-1111-1111-1111-111111111111")
    await manager.create_session(guild_id=123, campaign_id=campaign_id)
    with pytest.raises(ValueError):
        await manager.create_session(guild_id=123, campaign_id=campaign_id)


@pytest.mark.asyncio
async def test_get_session(manager: SessionManager) -> None:
    campaign_id = UUID("11111111-1111-1111-1111-111111111111")
    created = await manager.create_session(guild_id=123, campaign_id=campaign_id)
    fetched = await manager.get_session(123)
    assert fetched is not None
    assert fetched.id == created.id


@pytest.mark.asyncio
async def test_end_session(manager: SessionManager) -> None:
    campaign_id = UUID("11111111-1111-1111-1111-111111111111")
    await manager.create_session(guild_id=123, campaign_id=campaign_id)
    ended = await manager.end_session(123)
    assert ended is not None
    assert ended.status == "ended"
    assert ended.ended_at is not None


@pytest.mark.asyncio
async def test_add_player(manager: SessionManager) -> None:
    campaign_id = UUID("11111111-1111-1111-1111-111111111111")
    await manager.create_session(guild_id=123, campaign_id=campaign_id)
    await manager.add_player(guild_id=123, user_id=456, character_name="Thorin")
    session = await manager.get_session(123)
    assert session is not None
    assert session.players[456]["character_name"] == "Thorin"
