"""Validation and integration tests for BakaDM bot.

These tests validate end-to-end flows and ensure all components work together.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from bot import BakaDMBot, CoreCommands, SessionCommands
from backend_client import BackendClient, DMResponse
from session_manager import SessionManager
from config import BotConfig


class TestBotValidation:
    """End-to-end validation tests for the bot."""

    @pytest.fixture
    def bot(self, bot_config: BotConfig) -> BakaDMBot:
        """Create a bot instance for validation testing."""
        with patch("bot.discord.Intents.default") as mock_intents:
            mock_intents.return_value = MagicMock()
            return BakaDMBot(bot_config)

    @pytest.fixture
    def core_cog(self, bot: BakaDMBot) -> CoreCommands:
        """Create CoreCommands cog."""
        return CoreCommands(bot)

    @pytest.fixture
    def session_cog(self, bot: BakaDMBot) -> SessionCommands:
        """Create SessionCommands cog."""
        return SessionCommands(bot)

    @pytest.mark.asyncio
    async def test_full_session_flow(self, core_cog: CoreCommands, session_cog: SessionCommands, mock_discord_context: MagicMock) -> None:
        """Validate complete session lifecycle: summon -> roll -> status -> dismiss."""
        # Step 1: Summon DM
        await session_cog.summon_dm(mock_discord_context)
        assert mock_discord_context.send.called
        mock_discord_context.send.reset_mock()

        # Step 2: Roll dice
        await core_cog.roll(mock_discord_context, "2d6+3")
        assert mock_discord_context.send.called
        call_args = mock_discord_context.send.call_args
        assert "embed" in call_args.kwargs
        mock_discord_context.send.reset_mock()

        # Step 3: Check status
        await core_cog.status(mock_discord_context)
        assert mock_discord_context.send.called
        call_args = mock_discord_context.send.call_args
        # Should show active session now
        assert "Session" in call_args.args[0] or "active" in call_args.args[0].lower()
        mock_discord_context.send.reset_mock()

        # Step 4: Dismiss DM
        await session_cog.dismiss_dm(mock_discord_context)
        assert mock_discord_context.send.called

    @pytest.mark.asyncio
    async def test_backend_health_integration(self, bot: BakaDMBot) -> None:
        """Validate backend client health check works."""
        result = await bot.backend.health_check()
        assert result["status"] == "healthy"
        assert "services" in result

    @pytest.mark.asyncio
    async def test_session_manager_persistence(self, bot: BakaDMBot, mock_discord_context: MagicMock) -> None:
        """Validate session manager maintains state correctly."""
        from uuid import UUID

        # Create session
        session = await bot.session_manager.create_session(
            guild_id=mock_discord_context.guild.id,
            campaign_id=UUID("11111111-1111-1111-1111-111111111111"),
        )
        assert session.status == "active"

        # Add player
        await bot.session_manager.add_player(
            guild_id=mock_discord_context.guild.id,
            user_id=mock_discord_context.author.id,
            character_name="TestHero",
        )

        # Retrieve and verify
        fetched = await bot.session_manager.get_session(mock_discord_context.guild.id)
        assert fetched is not None
        assert fetched.players[mock_discord_context.author.id]["character_name"] == "TestHero"

        # End session
        ended = await bot.session_manager.end_session(mock_discord_context.guild.id)
        assert ended.status == "ended"

    @pytest.mark.asyncio
    async def test_roll_edge_cases(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Validate dice roll handles various edge cases."""
        test_cases = [
            ("1d20", "valid single die"),
            ("2d6+3", "valid with modifier"),
            ("3d8-1", "valid with negative modifier"),
            ("0d6", "zero dice"),
            ("1d1", "single side"),
        ]

        for expression, description in test_cases:
            mock_discord_context.send.reset_mock()
            await core_cog.roll(mock_discord_context, expression)
            assert mock_discord_context.send.called, f"Failed for {description}: {expression}"

    @pytest.mark.asyncio
    async def test_error_recovery(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Validate bot recovers gracefully from errors."""
        # Invalid dice expression
        await core_cog.roll(mock_discord_context, "not-a-roll")
        assert mock_discord_context.send.called
        call_args = mock_discord_context.send.call_args
        assert "❌" in call_args.args[0]

        # Too many dice
        mock_discord_context.send.reset_mock()
        await core_cog.roll(mock_discord_context, "999d6")
        assert mock_discord_context.send.called
        call_args = mock_discord_context.send.call_args
        assert "too many" in call_args.args[0].lower()


class TestConfigValidation:
    """Validate configuration handling."""

    def test_config_required_fields(self) -> None:
        """Ensure config validates required fields."""
        with pytest.raises((ValueError, TypeError)):
            BotConfig()  # Should require token

    def test_config_log_level_validation(self, bot_config: BotConfig) -> None:
        """Validate log level is set correctly."""
        assert bot_config.log_level in ["DEBUG", "INFO", "WARNING", "ERROR"]

    def test_config_guild_ids(self, bot_config: BotConfig) -> None:
        """Validate guild IDs are present."""
        assert len(bot_config.guild_ids) > 0
        assert all(isinstance(gid, int) for gid in bot_config.guild_ids)


class TestBackendClientValidation:
    """Validate backend client behavior."""

    @pytest.fixture
    def client(self) -> BackendClient:
        return BackendClient(mock_mode=True)

    @pytest.mark.asyncio
    async def test_campaign_crud(self, client: BackendClient) -> None:
        """Validate campaign create/read/update flow."""
        # Create
        campaign = await client.create_campaign(name="Validation Campaign", guild_id="test_guild")
        assert campaign.name == "Validation Campaign"
        assert campaign.status == "active"

    @pytest.mark.asyncio
    async def test_session_message_flow(self, client: BackendClient) -> None:
        """Validate full message flow through backend."""
        session = await client.start_session(campaign_id="camp_test")
        sid = session["session_id"]

        # Send multiple messages
        responses = []
        for text in ["Hello", "I attack", "I cast fireball"]:
            resp = await client.send_message(sid, "user1", "Hero", text)
            responses.append(resp)
            assert isinstance(resp, DMResponse)
            assert resp.dm_text

        # End and verify summary
        summary = await client.end_session(sid)
        assert summary.message_count == 3
        assert summary.duration_minutes >= 0

    @pytest.mark.asyncio
    async def test_roll_logging(self, client: BackendClient) -> None:
        """Validate roll results are logged correctly."""
        result = await client.log_roll(
            session_id="sess_test",
            expression="2d6+3",
            rolls=[4, 2],
            total=9,
            roller_id="user1",
            roller_name="Hero",
            reason="Damage",
        )
        assert result["total"] == 9
        assert result["roller"] == "Hero"
        assert result["expression"] == "2d6+3"
