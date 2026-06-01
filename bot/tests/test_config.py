"""Tests for bot configuration management."""

import os
from unittest.mock import patch

import pytest

from config import BotConfig


class TestBotConfig:
    """Test suite for BotConfig."""

    def test_from_env_loads_all_values(self) -> None:
        """Test that from_env loads all required configuration values."""
        env = {
            "DISCORD_BOT_TOKEN": "test_token_123",
            "DISCORD_APPLICATION_ID": "123456789",
            "BACKEND_API_URL": "http://test.api.com/api",
            "BACKEND_API_KEY": "test_api_key",
            "LOG_LEVEL": "DEBUG",
            "DISCORD_GUILD_IDS": "123,456,789",
        }
        with patch.dict(os.environ, env, clear=True):
            config = BotConfig.from_env()

        assert config.discord_token == "test_token_123"
        assert config.application_id == "123456789"
        assert config.backend_api_url == "http://test.api.com/api"
        assert config.backend_api_key == "test_api_key"
        assert config.log_level == "DEBUG"
        assert config.guild_ids == [123, 456, 789]

    def test_from_env_uses_defaults(self) -> None:
        """Test that from_env uses sensible defaults for optional values."""
        env = {
            "DISCORD_BOT_TOKEN": "test_token",
            "DISCORD_APPLICATION_ID": "123",
        }
        with patch.dict(os.environ, env, clear=True):
            config = BotConfig.from_env()

        assert config.backend_api_url == "http://localhost:3000/api"
        assert config.backend_api_key == ""
        assert config.log_level == "INFO"
        assert config.guild_ids is None

    def test_from_env_empty_guild_ids(self) -> None:
        """Test that empty DISCORD_GUILD_IDS results in None."""
        env = {
            "DISCORD_BOT_TOKEN": "test_token",
            "DISCORD_APPLICATION_ID": "123",
            "DISCORD_GUILD_IDS": "",
        }
        with patch.dict(os.environ, env, clear=True):
            config = BotConfig.from_env()

        assert config.guild_ids is None

    def test_from_env_single_guild_id(self) -> None:
        """Test that a single guild ID is parsed correctly."""
        env = {
            "DISCORD_BOT_TOKEN": "test_token",
            "DISCORD_APPLICATION_ID": "123",
            "DISCORD_GUILD_IDS": "999",
        }
        with patch.dict(os.environ, env, clear=True):
            config = BotConfig.from_env()

        assert config.guild_ids == [999]

    def test_validate_passes_with_required_values(self) -> None:
        """Test that validate passes when required values are present."""
        config = BotConfig(
            discord_token="valid_token",
            application_id="123",
            backend_api_url="http://localhost:3000/api",
            backend_api_key="",
        )
        # Should not raise
        config.validate()

    def test_validate_missing_discord_token(self) -> None:
        """Test that validate raises when DISCORD_BOT_TOKEN is missing."""
        config = BotConfig(
            discord_token="",
            application_id="123",
            backend_api_url="http://localhost:3000/api",
            backend_api_key="",
        )
        with pytest.raises(ValueError, match="DISCORD_BOT_TOKEN is required"):
            config.validate()

    def test_validate_missing_application_id(self) -> None:
        """Test that validate raises when DISCORD_APPLICATION_ID is missing."""
        config = BotConfig(
            discord_token="valid_token",
            application_id="",
            backend_api_url="http://localhost:3000/api",
            backend_api_key="",
        )
        with pytest.raises(ValueError, match="DISCORD_APPLICATION_ID is required"):
            config.validate()

    def test_config_is_immutable(self) -> None:
        """Test that BotConfig dataclass is frozen (immutable)."""
        config = BotConfig(
            discord_token="token",
            application_id="123",
            backend_api_url="http://localhost:3000/api",
            backend_api_key="",
        )
        with pytest.raises(AttributeError):
            config.discord_token = "new_token"
