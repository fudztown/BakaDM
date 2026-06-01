"""Extended tests for session_manager.py covering edge cases and error scenarios."""

import asyncio
import pytest
from uuid import UUID, uuid4

from session_manager import SessionManager, SessionState


class TestSessionManagerInitialization:
    """Test suite for SessionManager initialization."""

    def test_default_initialization(self) -> None:
        """Test that SessionManager initializes with empty state."""
        manager = SessionManager()
        assert manager._sessions == {}
        assert manager.list_active_sessions() == []


class TestSessionManagerCreate:
    """Test suite for session creation."""

    @pytest.mark.asyncio
    async def test_create_session_basic(self) -> None:
        """Test creating a basic session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        session = await manager.create_session(guild_id=123, campaign_id=campaign_id)

        assert isinstance(session, SessionState)
        assert session.guild_id == 123
        assert session.campaign_id == campaign_id
        assert session.status == "active"
        assert session.id is not None

    @pytest.mark.asyncio
    async def test_create_session_with_channels(self) -> None:
        """Test creating a session with voice and text channels."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        session = await manager.create_session(
            guild_id=123,
            campaign_id=campaign_id,
            voice_channel_id=456,
            text_channel_id=789,
        )

        assert session.voice_channel_id == 456
        assert session.text_channel_id == 789

    @pytest.mark.asyncio
    async def test_create_session_duplicate_raises(self) -> None:
        """Test that creating duplicate active sessions raises ValueError."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)

        with pytest.raises(ValueError, match="already has an active session"):
            await manager.create_session(guild_id=123, campaign_id=campaign_id)

    @pytest.mark.asyncio
    async def test_create_session_after_end(self) -> None:
        """Test that a new session can be created after ending the previous one."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.end_session(123)

        # Should not raise
        session = await manager.create_session(guild_id=123, campaign_id=campaign_id)
        assert session.status == "active"

    @pytest.mark.asyncio
    async def test_concurrent_create_session_race_condition(self) -> None:
        """Test that concurrent session creation is handled safely."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")

        async def create():
            try:
                return await manager.create_session(guild_id=123, campaign_id=campaign_id)
            except ValueError:
                return None

        results = await asyncio.gather(create(), create())
        sessions = [r for r in results if r is not None]

        # Only one session should be created
        assert len(sessions) == 1


class TestSessionManagerGet:
    """Test suite for session retrieval."""

    @pytest.mark.asyncio
    async def test_get_existing_session(self) -> None:
        """Test getting an existing session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        created = await manager.create_session(guild_id=123, campaign_id=campaign_id)
        fetched = await manager.get_session(123)

        assert fetched is not None
        assert fetched.id == created.id

    @pytest.mark.asyncio
    async def test_get_nonexistent_session(self) -> None:
        """Test getting a session that doesn't exist."""
        manager = SessionManager()
        fetched = await manager.get_session(999)
        assert fetched is None

    @pytest.mark.asyncio
    async def test_get_ended_session(self) -> None:
        """Test that ended sessions are still retrievable."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.end_session(123)

        fetched = await manager.get_session(123)
        assert fetched is not None
        assert fetched.status == "ended"


class TestSessionManagerEnd:
    """Test suite for session ending."""

    @pytest.mark.asyncio
    async def test_end_active_session(self) -> None:
        """Test ending an active session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        ended = await manager.end_session(123)

        assert ended is not None
        assert ended.status == "ended"
        assert ended.ended_at is not None

    @pytest.mark.asyncio
    async def test_end_nonexistent_session(self) -> None:
        """Test ending a session that doesn't exist."""
        manager = SessionManager()
        ended = await manager.end_session(999)
        assert ended is None

    @pytest.mark.asyncio
    async def test_end_already_ended_session(self) -> None:
        """Test ending a session that is already ended."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.end_session(123)

        # End again - should return the ended session
        ended = await manager.end_session(123)
        assert ended is not None
        assert ended.status == "ended"


class TestSessionManagerPlayers:
    """Test suite for player management."""

    @pytest.mark.asyncio
    async def test_add_player(self) -> None:
        """Test adding a player to a session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.add_player(guild_id=123, user_id=456, character_name="Thorin")

        session = await manager.get_session(123)
        assert session.players[456]["character_name"] == "Thorin"

    @pytest.mark.asyncio
    async def test_add_player_no_session(self) -> None:
        """Test adding a player when no session exists."""
        manager = SessionManager()
        with pytest.raises(ValueError, match="No active session"):
            await manager.add_player(guild_id=123, user_id=456, character_name="Thorin")

    @pytest.mark.asyncio
    async def test_add_player_to_ended_session(self) -> None:
        """Test adding a player to an ended session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.end_session(123)

        with pytest.raises(ValueError, match="No active session"):
            await manager.add_player(guild_id=123, user_id=456, character_name="Thorin")

    @pytest.mark.asyncio
    async def test_add_multiple_players(self) -> None:
        """Test adding multiple players to a session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)

        await manager.add_player(guild_id=123, user_id=456, character_name="Thorin")
        await manager.add_player(guild_id=123, user_id=789, character_name="Gandalf")

        session = await manager.get_session(123)
        assert len(session.players) == 2
        assert session.players[456]["character_name"] == "Thorin"
        assert session.players[789]["character_name"] == "Gandalf"


class TestSessionManagerMessageCount:
    """Test suite for message counting."""

    @pytest.mark.asyncio
    async def test_increment_message_count(self) -> None:
        """Test incrementing message count."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)

        await manager.increment_message_count(123)
        await manager.increment_message_count(123)
        await manager.increment_message_count(123)

        session = await manager.get_session(123)
        assert session.message_count == 3

    @pytest.mark.asyncio
    async def test_increment_message_count_no_session(self) -> None:
        """Test incrementing message count when no session exists."""
        manager = SessionManager()
        # Should not raise
        await manager.increment_message_count(123)

    @pytest.mark.asyncio
    async def test_increment_message_count_ended_session(self) -> None:
        """Test incrementing message count for ended session."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.end_session(123)

        # Should not raise, but count should not increment
        await manager.increment_message_count(123)
        session = await manager.get_session(123)
        assert session.message_count == 0


class TestSessionManagerListActive:
    """Test suite for listing active sessions."""

    @pytest.mark.asyncio
    async def test_list_active_sessions_empty(self) -> None:
        """Test listing active sessions when none exist."""
        manager = SessionManager()
        assert manager.list_active_sessions() == []

    @pytest.mark.asyncio
    async def test_list_active_sessions(self) -> None:
        """Test listing active sessions."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.create_session(guild_id=456, campaign_id=campaign_id)

        active = manager.list_active_sessions()
        assert len(active) == 2

    @pytest.mark.asyncio
    async def test_list_active_sessions_excludes_ended(self) -> None:
        """Test that ended sessions are excluded from active list."""
        manager = SessionManager()
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        await manager.create_session(guild_id=456, campaign_id=campaign_id)
        await manager.end_session(123)

        active = manager.list_active_sessions()
        assert len(active) == 1
        assert active[0].guild_id == 456


class TestSessionState:
    """Test suite for SessionState dataclass."""

    def test_default_values(self) -> None:
        """Test SessionState default values."""
        session = SessionState(
            id=uuid4(),
            campaign_id=uuid4(),
            guild_id=123,
        )

        assert session.status == "active"
        assert session.message_count == 0
        assert session.players == {}
        assert session.voice_channel_id is None
        assert session.text_channel_id is None
        assert session.ended_at is None
        assert session.started_at is not None

    def test_custom_values(self) -> None:
        """Test SessionState with custom values."""
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        session = SessionState(
            id=uuid4(),
            campaign_id=uuid4(),
            guild_id=123,
            voice_channel_id=456,
            text_channel_id=789,
            players={123: {"character_name": "Thorin"}},
            status="paused",
            message_count=5,
            started_at=now,
        )

        assert session.voice_channel_id == 456
        assert session.text_channel_id == 789
        assert session.players[123]["character_name"] == "Thorin"
        assert session.status == "paused"
        assert session.message_count == 5

    def test_session_state_is_mutable(self) -> None:
        """Test that SessionState is mutable (unlike frozen dataclasses)."""
        session = SessionState(
            id=uuid4(),
            campaign_id=uuid4(),
            guild_id=123,
        )

        session.status = "ended"
        session.message_count = 10
        assert session.status == "ended"
        assert session.message_count == 10
