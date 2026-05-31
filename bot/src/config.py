"""Bot configuration management."""

import os
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv

# Load .env file from the same directory as this module or project root
load_dotenv()


@dataclass(frozen=True)
class BotConfig:
    """Immutable bot configuration loaded from environment."""

    discord_token: str
    application_id: str
    backend_api_url: str
    backend_api_key: str
    log_level: str = "INFO"
    guild_ids: Optional[list[int]] = None  # Empty = global commands

    @classmethod
    def from_env(cls) -> "BotConfig":
        """Load configuration from environment variables."""
        guild_ids_raw = os.getenv("DISCORD_GUILD_IDS", "")
        guild_ids = (
            [int(g.strip()) for g in guild_ids_raw.split(",") if g.strip()]
            if guild_ids_raw
            else None
        )

        return cls(
            discord_token=os.getenv("DISCORD_BOT_TOKEN", ""),
            application_id=os.getenv("DISCORD_APPLICATION_ID", ""),
            backend_api_url=os.getenv("BACKEND_API_URL", "http://localhost:3000/api"),
            backend_api_key=os.getenv("BACKEND_API_KEY", ""),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
            guild_ids=guild_ids,
        )

    def validate(self) -> None:
        """Ensure required configuration is present."""
        if not self.discord_token:
            raise ValueError("DISCORD_BOT_TOKEN is required")
        if not self.application_id:
            raise ValueError("DISCORD_APPLICATION_ID is required")
