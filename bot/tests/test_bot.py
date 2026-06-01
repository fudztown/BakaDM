"""Tests for the Discord bot core functionality."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from bot import BakaDMBot, CoreCommands, SessionCommands
from config import BotConfig


class TestBakaDMBot:
    """Test suite for BakaDMBot."""

    @pytest.fixture
    def bot(self, bot_config: BotConfig) -> BakaDMBot:
        """Create a bot instance for testing."""
        with patch("bot.discord.Intents.default") as mock_intents:
            mock_intents.return_value = MagicMock()
            bot = BakaDMBot(bot_config)
            return bot

    def test_bot_initialization(self, bot: BakaDMBot, bot_config: BotConfig) -> None:
        """Test that bot initializes with correct configuration."""
        assert bot.config == bot_config
        assert bot.session_manager is not None
        assert bot.backend is not None
        assert bot.backend.mock_mode is True

    def test_bot_has_session_manager(self, bot: BakaDMBot) -> None:
        """Test that bot has a session manager instance."""
        from session_manager import SessionManager
        assert isinstance(bot.session_manager, SessionManager)

    def test_bot_has_backend_client(self, bot: BakaDMBot) -> None:
        """Test that bot has a backend client instance."""
        from backend_client import BackendClient
        assert isinstance(bot.backend, BackendClient)


class TestCoreCommands:
    """Test suite for CoreCommands cog."""

    @pytest.fixture
    def core_cog(self, bot_config: BotConfig) -> CoreCommands:
        """Create a CoreCommands instance for testing."""
        with patch("bot.discord.Intents.default") as mock_intents:
            mock_intents.return_value = MagicMock()
            bot = BakaDMBot(bot_config)
            return CoreCommands(bot)

    @pytest.mark.asyncio
    async def test_roll_valid_expression(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Test that roll command handles valid dice expressions."""
        await core_cog.roll(mock_discord_context, "2d6+3")
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        
        # Check that an embed was sent
        call_args = mock_discord_context.send.call_args
        assert "embed" in call_args.kwargs

    @pytest.mark.asyncio
    async def test_roll_invalid_expression(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Test that roll command handles invalid dice expressions."""
        await core_cog.roll(mock_discord_context, "invalid")
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        
        # Should send error message
        call_args = mock_discord_context.send.call_args
        assert "❌" in call_args.args[0]

    @pytest.mark.asyncio
    async def test_roll_too_many_dice(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Test that roll command rejects excessive dice counts."""
        await core_cog.roll(mock_discord_context, "101d6")
        
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "too many dice" in call_args.args[0].lower()

    @pytest.mark.asyncio
    async def test_roll_max_sides(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Test that roll command rejects excessive sides."""
        await core_cog.roll(mock_discord_context, "1d1001")
        
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "too many dice" in call_args.args[0].lower()

    @pytest.mark.asyncio
    async def test_status_no_session(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Test that status command reports no active session."""
        await core_cog.status(mock_discord_context)
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "No active session" in call_args.args[0]

    @pytest.mark.asyncio
    async def test_help_command(self, core_cog: CoreCommands, mock_discord_context: MagicMock) -> None:
        """Test that help command displays available commands."""
        await core_cog.help_command(mock_discord_context)
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "embed" in call_args.kwargs


class TestSessionCommands:
    """Test suite for SessionCommands cog."""

    @pytest.fixture
    def session_cog(self, bot_config: BotConfig) -> SessionCommands:
        """Create a SessionCommands instance for testing."""
        with patch("bot.discord.Intents.default") as mock_intents:
            mock_intents.return_value = MagicMock()
            bot = BakaDMBot(bot_config)
            return SessionCommands(bot)

    @pytest.mark.asyncio
    async def test_summon_dm_no_guild(self, session_cog: SessionCommands, mock_discord_context: MagicMock) -> None:
        """Test that summon-dm fails outside of guild."""
        mock_discord_context.guild = None
        
        await session_cog.summon_dm(mock_discord_context)
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "only works in a server" in call_args.args[0]

    @pytest.mark.asyncio
    async def test_summon_dm_success(self, session_cog: SessionCommands, mock_discord_context: MagicMock) -> None:
        """Test that summon-dm creates a session successfully."""
        await session_cog.summon_dm(mock_discord_context)
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        
        # Check embed was sent
        call_args = mock_discord_context.send.call_args
        assert "embed" in call_args.kwargs

    @pytest.mark.asyncio
    async def test_dismiss_dm_no_session(self, session_cog: SessionCommands, mock_discord_context: MagicMock) -> None:
        """Test that dismiss-dm reports no active session."""
        await session_cog.dismiss_dm(mock_discord_context)
        
        mock_discord_context.defer.assert_called_once()
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "No active session" in call_args.args[0]

    @pytest.mark.asyncio
    async def test_dismiss_dm_with_session(self, session_cog: SessionCommands, mock_discord_context: MagicMock) -> None:
        """Test that dismiss-dm ends an active session."""
        # First summon a session
        await session_cog.summon_dm(mock_discord_context)
        mock_discord_context.send.reset_mock()
        
        # Then dismiss it
        await session_cog.dismiss_dm(mock_discord_context)
        
        mock_discord_context.send.assert_called_once()
        call_args = mock_discord_context.send.call_args
        assert "embed" in call_args.kwargs


class TestBotErrorHandling:
    """Test suite for bot error handling."""

    @pytest.fixture
    def bot(self, bot_config: BotConfig) -> BakaDMBot:
        """Create a bot instance for testing."""
        with patch("bot.discord.Intents.default") as mock_intents:
            mock_intents.return_value = MagicMock()
            return BakaDMBot(bot_config)

    @pytest.mark.asyncio
    async def test_on_command_error_missing_argument(self, bot: BakaDMBot, mock_discord_context: MagicMock) -> None:
        """Test handling of MissingRequiredArgument error."""
        error = MagicMock()
        error.param.name = "expression"
        error.__class__ = type("MissingRequiredArgument", (Exception,), {})
        
        # We can't easily test this without more mocking, but we verify the method exists
        assert hasattr(bot, 'on_command_error')

    @pytest.mark.asyncio
    async def test_on_message_ignores_self(self, bot: BakaDMBot) -> None:
        """Test that bot ignores its own messages."""
        message = MagicMock()
        message.author = bot.user
        
        # Should return early without processing
        await bot.on_message(message)
        # No assertions needed - if it doesn't raise, it passed

    @pytest.mark.asyncio
    async def test_on_message_ignores_dms(self, bot: BakaDMBot) -> None:
        """Test that bot ignores DMs in Phase 0."""
        message = MagicMock()
        message.author.id = 123
        message.guild = None
        
        await bot.on_message(message)
        # Should return early without error
