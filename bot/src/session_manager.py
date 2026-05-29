"""In-memory session state management for active D&D sessions.

Phase 0 MVP: Simple in-memory store. Phase 2+ will use Redis-backed coordination.
"""

import asyncio
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class SessionState:
    """Represents an active game session."""

    id: UUID
    campaign_id: UUID
    guild_id: int
    voice_channel_id: Optional[int] = None
    text_channel_id: Optional[int] = None
    players: dict[int, dict] = field(default_factory=dict)  # user_id -> {character_name, ...}
    status: str = "active"  # active, paused, ended
    message_count: int = 0
    started_at: datetime = field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None


class SessionManager:
    """Manages active session state across guilds."""

    def __init__(self) -> None:
        self._sessions: dict[int, SessionState] = {}  # guild_id -> SessionState
        self._lock = asyncio.Lock()

    async def create_session(
        self,
        guild_id: int,
        campaign_id: UUID,
        voice_channel_id: Optional[int] = None,
        text_channel_id: Optional[int] = None,
    ) -> SessionState:
        """Create a new session for a guild.

        Raises:
            ValueError: If guild already has an active session.
        """
        async with self._lock:
            if guild_id in self._sessions and self._sessions[guild_id].status == "active":
                raise ValueError(f"Guild {guild_id} already has an active session")

            session = SessionState(
                id=uuid4(),
                campaign_id=campaign_id,
                guild_id=guild_id,
                voice_channel_id=voice_channel_id,
                text_channel_id=text_channel_id,
            )
            self._sessions[guild_id] = session
            return session

    async def get_session(self, guild_id: int) -> Optional[SessionState]:
        """Get the active session for a guild, if any."""
        async with self._lock:
            return self._sessions.get(guild_id)

    async def end_session(self, guild_id: int) -> Optional[SessionState]:
        """End the active session for a guild and return it."""
        async with self._lock:
            session = self._sessions.get(guild_id)
            if session and session.status == "active":
                session.status = "ended"
                session.ended_at = datetime.utcnow()
            return session

    async def add_player(self, guild_id: int, user_id: int, character_name: str) -> None:
        """Add a player to an active session."""
        async with self._lock:
            session = self._sessions.get(guild_id)
            if not session or session.status != "active":
                raise ValueError("No active session in this guild")
            session.players[user_id] = {"character_name": character_name}

    async def increment_message_count(self, guild_id: int) -> None:
        """Increment message count for a session."""
        async with self._lock:
            session = self._sessions.get(guild_id)
            if session:
                session.message_count += 1

    def list_active_sessions(self) -> list[SessionState]:
        """Return all currently active sessions."""
        return [s for s in self._sessions.values() if s.status == "active"]
