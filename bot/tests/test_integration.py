"""Integration tests for bot + backend communication."""

import pytest
from backend_client import BackendClient


@pytest.fixture
def real_client() -> BackendClient:
    """Return a real backend client pointing to local dev server."""
    return BackendClient(mock_mode=False, base_url="http://localhost:3000/api")


@pytest.mark.asyncio
async def test_health_check_integration(real_client: BackendClient) -> None:
    """Test that backend health endpoint is reachable."""
    result = await real_client.health_check()
    assert result["status"] == "healthy"
    assert "services" in result


@pytest.mark.asyncio
async def test_create_campaign_integration(real_client: BackendClient) -> None:
    """Test campaign creation via real backend."""
    campaign = await real_client.create_campaign(
        name="Integration Test Campaign",
        guild_id="123456",
    )
    assert campaign.name == "Integration Test Campaign"
    assert campaign.status == "active"
    assert campaign.id.startswith("camp_")


@pytest.mark.asyncio
async def test_session_lifecycle_integration(real_client: BackendClient) -> None:
    """Test full session lifecycle: create -> message -> end."""
    # Create campaign
    campaign = await real_client.create_campaign(
        name="Lifecycle Test",
        guild_id="123456",
    )

    # Start session
    session = await real_client.start_session(campaign_id=campaign.id)
    assert session["status"] == "active"
    sid = session["session_id"]

    # Send messages
    for text in ["Hello DM", "I search the room", "I attack the goblin"]:
        resp = await real_client.send_message(
            session_id=sid,
            player_id="user_1",
            character_name="Thorin",
            text=text,
        )
        assert resp.dm_text
        assert "Thorin" in resp.dm_text

    # End session
    summary = await real_client.end_session(sid)
    assert summary.session_id == sid
    assert summary.message_count >= 3
    assert summary.duration_minutes >= 0
