"""Tests for backend_client.py."""

import pytest

from backend_client import BackendClient, DMResponse


@pytest.fixture
def client() -> BackendClient:
    return BackendClient(mock_mode=True)


@pytest.mark.asyncio
async def test_health_check(client: BackendClient) -> None:
    result = await client.health_check()
    assert result["status"] == "healthy"
    assert "services" in result


@pytest.mark.asyncio
async def test_create_campaign(client: BackendClient) -> None:
    campaign = await client.create_campaign(
        name="Test Campaign",
        guild_id="123456",
    )
    assert campaign.name == "Test Campaign"
    assert campaign.status == "active"
    assert campaign.id.startswith("camp_")


@pytest.mark.asyncio
async def test_start_session(client: BackendClient) -> None:
    session = await client.start_session(campaign_id="camp_123")
    assert session["status"] == "active"
    assert session["session_id"].startswith("sess_")


@pytest.mark.asyncio
async def test_send_message_returns_dm_response(client: BackendClient) -> None:
    await client.start_session(campaign_id="camp_123")
    resp = await client.send_message(
        session_id="sess_123",
        player_id="user_1",
        character_name="Thorin",
        text="I search the room",
    )
    assert isinstance(resp, DMResponse)
    assert resp.dm_text
    assert "Thorin" in resp.dm_text


@pytest.mark.asyncio
async def test_send_message_keyword_responses(client: BackendClient) -> None:
    await client.start_session(campaign_id="camp_123")

    hello = await client.send_message("sess_123", "u1", "A", "Hello there")
    assert "Greetings" in hello.dm_text

    attack = await client.send_message("sess_123", "u1", "A", "I attack the goblin")
    assert "initiative" in attack.dm_text.lower()

    spell = await client.send_message("sess_123", "u1", "A", "I cast fireball")
    assert "spell" in spell.dm_text.lower()


@pytest.mark.asyncio
async def test_end_session(client: BackendClient) -> None:
    session = await client.start_session(campaign_id="camp_123")
    sid = session["session_id"]

    # Send a few messages
    for _ in range(3):
        await client.send_message(sid, "u1", "Thorin", "Hello")

    summary = await client.end_session(sid)
    assert summary.session_id == sid
    assert summary.message_count == 3
    assert summary.duration_minutes >= 0


@pytest.mark.asyncio
async def test_log_roll(client: BackendClient) -> None:
    result = await client.log_roll(
        session_id="sess_123",
        expression="2d6+3",
        rolls=[4, 2],
        total=9,
        roller_id="u1",
        roller_name="Thorin",
        reason="Damage",
    )
    assert result["total"] == 9
    assert result["roller"] == "Thorin"
