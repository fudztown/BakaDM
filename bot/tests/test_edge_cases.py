"""Edge case and boundary tests for BakaDM bot."""

import pytest
from backend_client import BackendClient
from session_manager import SessionManager


class TestBackendClientEdgeCases:
    """Edge cases for backend client."""

    @pytest.fixture
    def client(self) -> BackendClient:
        return BackendClient(mock_mode=True)

    @pytest.mark.asyncio
    async def test_empty_message(self, client: BackendClient) -> None:
        """Test sending empty message."""
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="",
        )
        assert resp.dm_text is not None

    @pytest.mark.asyncio
    async def test_very_long_message(self, client: BackendClient) -> None:
        """Test sending very long message."""
        await client.start_session(campaign_id="camp_123")
        long_text = "A" * 2000
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text=long_text,
        )
        assert resp.dm_text is not None

    @pytest.mark.asyncio
    async def test_special_characters_in_message(self, client: BackendClient) -> None:
        """Test message with special characters."""
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="Thorin",
            text="Hello! @#$%^&*() \"quotes\" <tags> 🔥",
        )
        assert resp.dm_text is not None

    @pytest.mark.asyncio
    async def test_unicode_in_character_name(self, client: BackendClient) -> None:
        """Test unicode character names."""
        await client.start_session(campaign_id="camp_123")
        resp = await client.send_message(
            session_id="sess_123",
            player_id="u1",
            character_name="🔥 Dragon 🐉",
            text="Hello",
        )
        assert "🔥 Dragon 🐉" in resp.dm_text

    @pytest.mark.asyncio
    async def test_multiple_players_same_session(self, client: BackendClient) -> None:
        """Test multiple players in same session."""
        await client.start_session(campaign_id="camp_123")
        players = [
            ("u1", "Thorin"),
            ("u2", "Gandalf"),
            ("u3", "Legolas"),
        ]
        for player_id, char_name in players:
            resp = await client.send_message(
                session_id="sess_123",
                player_id=player_id,
                character_name=char_name,
                text=f"Hello from {char_name}",
            )
            assert char_name in resp.dm_text

    @pytest.mark.asyncio
    async def test_invalid_session_id(self, client: BackendClient) -> None:
        """Test operations with invalid session ID."""
        # Should handle gracefully in mock mode
        resp = await client.send_message(
            session_id="invalid_session",
            player_id="u1",
            character_name="Thorin",
            text="Hello",
        )
        assert resp.dm_text is not None


class TestSessionManagerEdgeCases:
    """Edge cases for session manager."""

    @pytest.fixture
    def manager(self) -> SessionManager:
        return SessionManager()

    @pytest.mark.asyncio
    async def test_end_nonexistent_session(self, manager: SessionManager) -> None:
        """Test ending a session that doesn't exist."""
        result = await manager.end_session(999999)
        assert result is None

    @pytest.mark.asyncio
    async def test_get_nonexistent_session(self, manager: SessionManager) -> None:
        """Test getting a session that doesn't exist."""
        result = await manager.get_session(999999)
        assert result is None

    @pytest.mark.asyncio
    async def test_add_player_to_nonexistent_session(self, manager: SessionManager) -> None:
        """Test adding player to non-existent session."""
        # Should handle gracefully
        await manager.add_player(guild_id=999999, user_id=123, character_name="Thorin")

    @pytest.mark.asyncio
    async def test_multiple_sessions_same_guild(self, manager: SessionManager) -> None:
        """Test that only one session per guild is allowed."""
        from uuid import UUID
        campaign_id = UUID("11111111-1111-1111-1111-111111111111")
        await manager.create_session(guild_id=123, campaign_id=campaign_id)
        with pytest.raises(ValueError):
            await manager.create_session(guild_id=123, campaign_id=campaign_id)

    @pytest.mark.asyncio
    async def test_rapid_session_creation(self, manager: SessionManager) -> None:
        """Test rapid session creation and cleanup."""
        from uuid import UUID
        for i in range(10):
            campaign_id = UUID(f"11111111-1111-1111-1111-{i:012d}")
            session = await manager.create_session(guild_id=1000 + i, campaign_id=campaign_id)
            assert session.status == "active"
            await manager.end_session(1000 + i)


class TestDiceEdgeCases:
    """Edge cases for dice rolling."""

    @pytest.mark.asyncio
    async def test_zero_dice(self) -> None:
        """Test rolling zero dice."""
        client = BackendClient(mock_mode=True)
        result = await client.log_roll(
            session_id="sess_123",
            expression="0d6",
            rolls=[],
            total=0,
            roller_id="u1",
            roller_name="Thorin",
        )
        assert result["total"] == 0

    @pytest.mark.asyncio
    async def test_negative_modifier(self) -> None:
        """Test roll with negative modifier."""
        client = BackendClient(mock_mode=True)
        result = await client.log_roll(
            session_id="sess_123",
            expression="1d20-5",
            rolls=[10],
            total=5,
            roller_id="u1",
            roller_name="Thorin",
        )
        assert result["total"] == 5

    @pytest.mark.asyncio
    async def test_maximum_dice(self) -> None:
        """Test rolling maximum allowed dice."""
        client = BackendClient(mock_mode=True)
        rolls = [6] * 100
        result = await client.log_roll(
            session_id="sess_123",
            expression="100d6",
            rolls=rolls,
            total=sum(rolls),
            roller_id="u1",
            roller_name="Thorin",
        )
        assert result["total"] == 600
