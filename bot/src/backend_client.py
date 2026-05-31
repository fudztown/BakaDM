"""Async backend API client for BakaDM.

Phase 0: Stub implementation with mock responses.
Phase 1+: Replace _mock_* methods with real aiohttp calls.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

logger = logging.getLogger("bakadm.backend")


# ---------------------------------------------------------------------------
# Data models (mirror API schemas)
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class DMResponse:
    """Response from the DM for a player message."""

    dm_text: str
    voice_id: Optional[str] = None
    tool_results: list[dict] = None  # type: ignore[assignment]
    ui_updates: list[dict] = None  # type: ignore[assignment]
    usage: dict[str, Any] = None  # type: ignore[assignment]

    def __post_init__(self) -> None:
        # dataclasses with mutable defaults workaround
        object.__setattr__(self, "tool_results", self.tool_results or [])
        object.__setattr__(self, "ui_updates", self.ui_updates or [])
        object.__setattr__(self, "usage", self.usage or {})


@dataclass(frozen=True)
class SessionSummary:
    """Summary returned when a session ends."""

    session_id: str
    duration_minutes: int
    message_count: int
    summary: str
    usage_total: dict[str, Any]


@dataclass(frozen=True)
class Campaign:
    """Minimal campaign representation."""

    id: str
    name: str
    status: str
    created_at: str


# ---------------------------------------------------------------------------
# Backend client
# ---------------------------------------------------------------------------

class BackendClient:
    """Client for the BakaDM backend API.

    Phase 0 stub: all network calls are mocked.  Set *mock_mode=False*
    (and supply *api_key*) to switch to real HTTP once the backend is live.
    """

    def __init__(
        self,
        base_url: str = "http://localhost:3000/api",
        api_key: Optional[str] = None,
        mock_mode: bool = True,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.mock_mode = mock_mode
        self._session_counter = 0
        self._message_counter: dict[str, int] = {}

    # ------------------------------------------------------------------
    # Health
    # ------------------------------------------------------------------

    async def health_check(self) -> dict[str, Any]:
        """Ping the backend health endpoint."""
        if self.mock_mode:
            await asyncio.sleep(0.05)
            return {
                "status": "healthy",
                "version": "0.1.0-mock",
                "services": {
                    "supabase": "connected",
                    "qdrant": "connected",
                    "claw": "available",
                    "elevenlabs": "available",
                },
            }
        # TODO: real GET /api/health
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Campaigns
    # ------------------------------------------------------------------

    async def create_campaign(
        self,
        name: str,
        guild_id: str,
        description: str = "",
        dm_style: str = "balanced",
        setting: str = "Forgotten Realms",
        level_range: str = "1-5",
    ) -> Campaign:
        """Create a new campaign."""
        if self.mock_mode:
            await asyncio.sleep(0.05)
            campaign = Campaign(
                id=f"camp_{uuid4().hex[:8]}",
                name=name,
                status="active",
                created_at=datetime.now(timezone.utc).isoformat(),
            )
            logger.info(f"[MOCK] Created campaign {campaign.id}")
            return campaign
        # TODO: real POST /api/campaigns
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Sessions
    # ------------------------------------------------------------------

    async def start_session(
        self,
        campaign_id: str,
        voice_channel_id: Optional[str] = None,
        players: Optional[list[dict[str, str]]] = None,
    ) -> dict[str, Any]:
        """Start a new game session."""
        if self.mock_mode:
            await asyncio.sleep(0.05)
            self._session_counter += 1
            session_id = f"sess_{uuid4().hex[:8]}"
            self._message_counter[session_id] = 0
            return {
                "session_id": session_id,
                "campaign_id": campaign_id,
                "status": "active",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        # TODO: real POST /api/campaigns/:id/sessions
        raise NotImplementedError

    async def send_message(
        self,
        session_id: str,
        player_id: str,
        character_name: str,
        text: str,
        source: str = "text",
    ) -> DMResponse:
        """Send player input and receive a DM response."""
        if self.mock_mode:
            await asyncio.sleep(0.1)  # Simulate network + AI latency
            self._message_counter[session_id] = self._message_counter.get(session_id, 0) + 1

            # Simple keyword-based mock responses for Phase 0 demo feel
            lower = text.lower()
            if any(w in lower for w in ("hello", "hi", "greet")):
                dm_text = (
                    f"Greetings, {character_name}. The road ahead is long and fraught with peril. "
                    "What would you like to do?"
                )
            elif any(w in lower for w in ("attack", "fight", "hit", "strike")):
                dm_text = (
                    f"{character_name} readies their weapon. Roll for initiative! "
                    "*(Use `/roll 1d20`)*"
                )
            elif any(w in lower for w in ("search", "look", "investigate", "check")):
                dm_text = (
                    f"{character_name} scans the area carefully. "
                    "You notice something glinting in the shadows..."
                )
            elif any(w in lower for w in ("cast", "spell", "magic", "fireball")):
                dm_text = (
                    f"Arcane energy crackles around {character_name}. "
                    "What spell do you wish to cast?"
                )
            else:
                dm_text = (
                    f"*{character_name} speaks...*\n\n"
                    f"🧙‍♂️ **The DM ponders your words...**\n\n"
                    f"_You said: \"{text}\"_\n\n"
                    "*(Backend integration pending — this is a Phase 0 placeholder.)*"
                )

            return DMResponse(
                dm_text=dm_text,
                voice_id="dm_narrator",
                ui_updates=[
                    {"type": "narrative", "text": f"{character_name} acts in the scene..."}
                ],
                usage={
                    "input_tokens": 850 + len(text) * 2,
                    "output_tokens": len(dm_text),
                    "model": "claw-dm-stub",
                },
            )
        # TODO: real POST /api/sessions/:id/message
        raise NotImplementedError

    async def end_session(self, session_id: str) -> SessionSummary:
        """End a session and retrieve summary."""
        if self.mock_mode:
            await asyncio.sleep(0.05)
            msg_count = self._message_counter.pop(session_id, 0)
            return SessionSummary(
                session_id=session_id,
                duration_minutes=42,  # Mock fixed value for Phase 0
                message_count=msg_count,
                summary=(
                    "The party ventured into unknown territory, faced challenges, "
                    "and emerged with tales to tell. *(AI summary pending)*"
                ),
                usage_total={
                    "input_tokens": msg_count * 1200,
                    "output_tokens": msg_count * 180,
                    "voice_minutes": 0.0,
                    "tts_characters": 0,
                },
            )
        # TODO: real POST /api/sessions/:id/end
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Dice (optional backend sync)
    # ------------------------------------------------------------------

    async def log_roll(
        self,
        session_id: str,
        expression: str,
        rolls: list[int],
        total: int,
        roller_id: str,
        roller_name: str,
        reason: str = "",
    ) -> dict[str, Any]:
        """Log a dice roll to the backend (fire-and-forget)."""
        if self.mock_mode:
            logger.info(
                f"[MOCK] Roll logged: {expression} = {total} "
                f"(by {roller_name}, session {session_id})"
            )
            return {
                "roll_id": f"roll_{uuid4().hex[:8]}",
                "expression": expression,
                "rolls": rolls,
                "total": total,
                "roller": roller_name,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        # TODO: real POST /api/dice/roll
        raise NotImplementedError
