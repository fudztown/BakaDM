"""Extended tests for backend_client.py covering edge cases and error scenarios."""

import pytest
from unittest.mock import patch, AsyncMock

from backend_client import BackendClient, DMResponse, SessionSummary, Campaign


class TestBackendClientInitialization:
    """Test suite for BackendClient initialization."""

    def test_default_initialization(self) -> None:
        """Test default initialization with mock mode."""
        client = BackendClient()
        assert client.base_url == "http://localhost:3000/api"
        assert client.mock_mode is True
        assert client.api_key is None

    def test_custom_initialization(self) -> None:
        """Test initialization with custom parameters."""
        client = BackendClient(
            base_url="https://api.example.com/api",
            api_key="secret_key",
            mock_mode=False,
        )
        assert client.base_url == "https://api.example.com/api"
        assert client.mock_mode is False
        assert client.api_key == "secret_key"

    def test_base_url_trailing_slash_removed(self) -> None:
        """Test that trailing slash is removed from base_url."""
        client = BackendClient(base_url="http://localhost:3000/api/")
        assert client.base_url == "http://localhost:3000/api"


class TestBackendClientHealth:
    """Test suite for health check functionality."""

    @pytest.mark.asyncio
    async def test_health_check_mock_mode(self) -> None:
        """Test health check in mock mode."""
        client = BackendClient(mock_mode=True)
        result = await client.health_check()

        assert result["status"] == "healthy"
        assert "version" in result
        assert "services" in result
        assert result["services"]["supabase"] == "connected"

    @pytest.mark.asyncio
    async def test_health_check_real_mode_not_implemented(self) -> None:
        """Test that real mode raises NotImplementedError."""
        client = BackendClient(mock_mode=False)
        with pytest.raises(NotImplementedError):
            await client.health_check()


class TestBackendClientCampaigns:
    """Test suite for campaign operations."""

    @pytest.mark.asyncio
    async def test_create_campaign_minimal(self) -> None:
        """Test creating a campaign with minimal parameters."""
        client = BackendClient(mock_mode=True)
        campaign = await client.create_campaign(name="Test", guild_id="123")

        assert isinstance(campaign, Campaign)
        assert campaign.name == "Test"
        assert campaign.status == "active"
        assert campaign.id.startswith("camp_")

    @pytest.mark.asyncio
    async def test_create_campaign_full(self) -> None:
        """Test creating a campaign with all parameters."""
        client = BackendClient(mock_mode=True)
        campaign = await client.create_campaign(
            name="Full Test",
            guild_id="456",
            description="A test campaign",
            dm_style="narrative",
            setting="Eberron",
            level_range="5-10",
        )

        assert campaign.name == "Full Test"
        assert campaign.status == "active"

    @pytest.mark.asyncio
    async def test_create_campaign_real_mode_not_implemented(self) -> None:
        """Test that real mode campaign creation raises NotImplementedError."""
        client = BackendClient(mock_mode=False)
        with pytest.raises(NotImplementedError):
            await client.create_campaign(name="Test", guild_id="123")


class TestBackendClientSessions:
    """Test suite for session operations."""

    @pytest.mark.asyncio
    async def test_start_session(self) -> None:
        """Test starting a session."""
        client = BackendClient(mock_mode=True)
        session = await client.start_session(campaign_id="camp_123")

        assert session["status"] == "active"
        assert session["session_id"].startswith("sess_")
        assert session["campaign_id"] == "camp_123"

    @pytest.mark.asyncio
    async def test_start_session_with_voice_channel(self) -> None:
        """Test starting a session with voice channel."""
        client = BackendClient(mock_mode=True)
        session = await client.start_session(
            campaign_id="camp_123",
            voice_channel_id="vc_456",
        )

        assert session["status"] == "active"

    @pytest.mark.asyncio
    async def test_send_message_hello(self) -> None:
        """Test sending a greeting message."""
        client = BackendClient(mock_mode=True)
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="Hello there",
        )

        assert isinstance(resp, DMResponse)
        assert "Greetings" in resp.dm_text
        assert resp.voice_id == "dm_narrator"

    @pytest.mark.asyncio
    async def test_send_message_attack(self) -> None:
        """Test sending an attack message."""
        client = BackendClient(mock_mode=True)
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="I attack the goblin",
        )

        assert "initiative" in resp.dm_text.lower()

    @pytest.mark.asyncio
    async def test_send_message_search(self) -> None:
        """Test sending a search message."""
        client = BackendClient(mock_mode=True)
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="I search the room",
        )

        assert "scans" in resp.dm_text.lower()

    @pytest.mark.asyncio
    async def test_send_message_spell(self) -> None:
        """Test sending a spell message."""
        client = BackendClient(mock_mode=True)
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="I cast fireball",
        )

        assert "spell" in resp.dm_text.lower()

    @pytest.mark.asyncio
    async def test_send_message_default_response(self) -> None:
        """Test default response for unrecognized input."""
        client = BackendClient(mock_mode=True)
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="Something random",
        )

        assert "The DM ponders" in resp.dm_text
        assert "Backend integration" in resp.dm_text

    @pytest.mark.asyncio
    async def test_send_message_increments_counter(self) -> None:
        """Test that sending messages increments the message counter."""
        client = BackendClient(mock_mode=True)
        session = await client.start_session(campaign_id="camp_123")
        sid = session["session_id"]

        initial_count = client._message_counter.get(sid, 0)
        await client.send_message(sid, "u1", "Thorin", "Hello")
        assert client._message_counter[sid] == initial_count + 1

        await client.send_message(sid, "u1", "Thorin", "Hello again")
        assert client._message_counter[sid] == initial_count + 2

    @pytest.mark.asyncio
    async def test_end_session(self) -> None:
        """Test ending a session."""
        client = BackendClient(mock_mode=True)
        session = await client.start_session(campaign_id="camp_123")
        sid = session["session_id"]

        # Send some messages
        for _ in range(3):
            await client.send_message(sid, "u1", "Thorin", "Hello")

        summary = await client.end_session(sid)

        assert isinstance(summary, SessionSummary)
        assert summary.session_id == sid
        assert summary.message_count == 3
        assert summary.duration_minutes >= 0

    @pytest.mark.asyncio
    async def test_end_session_no_messages(self) -> None:
        """Test ending a session with no messages."""
        client = BackendClient(mock_mode=True)
        session = await client.start_session(campaign_id="camp_123")
        sid = session["session_id"]

        summary = await client.end_session(sid)

        assert summary.message_count == 0

    @pytest.mark.asyncio
    async def test_end_session_removes_counter(self) -> None:
        """Test that ending a session removes the message counter."""
        client = BackendClient(mock_mode=True)
        session = await client.start_session(campaign_id="camp_123")
        sid = session["session_id"]

        await client.send_message(sid, "u1", "Thorin", "Hello")
        assert sid in client._message_counter

        await client.end_session(sid)
        assert sid not in client._message_counter


class TestBackendClientDice:
    """Test suite for dice roll operations."""

    @pytest.mark.asyncio
    async def test_log_roll(self) -> None:
        """Test logging a dice roll."""
        client = BackendClient(mock_mode=True)
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
        assert result["expression"] == "2d6+3"
        assert "roll_id" in result

    @pytest.mark.asyncio
    async def test_log_roll_no_reason(self) -> None:
        """Test logging a dice roll without reason."""
        client = BackendClient(mock_mode=True)
        result = await client.log_roll(
            session_id="sess_123",
            expression="1d20",
            rolls=[15],
            total=15,
            roller_id="u1",
            roller_name="Thorin",
        )

        assert result["total"] == 15


class TestDMResponse:
    """Test suite for DMResponse dataclass."""

    def test_default_values(self) -> None:
        """Test that DMResponse has correct default values."""
        resp = DMResponse(dm_text="Hello")

        assert resp.dm_text == "Hello"
        assert resp.voice_id is None
        assert resp.tool_results == []
        assert resp.ui_updates == []
        assert resp.usage == {}

    def test_custom_values(self) -> None:
        """Test DMResponse with custom values."""
        resp = DMResponse(
            dm_text="Hello",
            voice_id="dm_narrator",
            tool_results=[{"type": "roll", "result": 15}],
            ui_updates=[{"type": "map", "data": {}}],
            usage={"tokens": 100},
        )

        assert resp.voice_id == "dm_narrator"
        assert len(resp.tool_results) == 1
        assert len(resp.ui_updates) == 1
        assert resp.usage["tokens"] == 100

    def test_immutability(self) -> None:
        """Test that DMResponse is immutable."""
        resp = DMResponse(dm_text="Hello")

        with pytest.raises(AttributeError):
            resp.dm_text = "New text"


class TestSessionSummary:
    """Test suite for SessionSummary dataclass."""

    def test_creation(self) -> None:
        """Test creating a SessionSummary."""
        summary = SessionSummary(
            session_id="sess_123",
            duration_minutes=42,
            message_count=5,
            summary="A brief adventure.",
            usage_total={},
        )

        assert summary.session_id == "sess_123"
        assert summary.duration_minutes == 42
        assert summary.message_count == 5

    def test_immutability(self) -> None:
        """Test that SessionSummary is immutable."""
        summary = SessionSummary(
            session_id="sess_123",
            duration_minutes=42,
            message_count=5,
            summary="Test",
            usage_total={},
        )

        with pytest.raises(AttributeError):
            summary.session_id = "new_id"


class TestCampaign:
    """Test suite for Campaign dataclass."""

    def test_creation(self) -> None:
        """Test creating a Campaign."""
        campaign = Campaign(
            id="camp_123",
            name="Test Campaign",
            status="active",
            created_at="2026-06-01T10:00:00Z",
        )

        assert campaign.id == "camp_123"
        assert campaign.name == "Test Campaign"
        assert campaign.status == "active"

    def test_immutability(self) -> None:
        """Test that Campaign is immutable."""
        campaign = Campaign(
            id="camp_123",
            name="Test",
            status="active",
            created_at="2026-06-01T10:00:00Z",
        )

        with pytest.raises(AttributeError):
            campaign.name = "New Name"
