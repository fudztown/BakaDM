# Discord Bot Architecture

> **Service 1 — Python Discord Bot**

## Overview

The Discord Bot is the primary interface between players and the AI DM system. Built with `discord.py`, it handles voice channel management, real-time speech-to-text capture, text-to-speech playback, and slash commands for game control.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Python 3.11+ |
| Discord Library | discord.py (with voice support) |
| STT | ElevenLabs Scribe v2 / Cartesia Ink |
| TTS | ElevenLabs Streaming API |
| Task Queue | asyncio (built-in) |
| Hosting | Hostinger VPS / Intel NUC |

## Core Responsibilities

### 1. Voice Channel Management

The bot joins and leaves voice channels **on demand** — it does not persist in channels.

```
/summon-dm  → Bot joins the user's current voice channel
/dismiss-dm → Bot leaves the voice channel gracefully
```

**Join Flow:**
1. Player issues `/summon-dm` in a text channel
2. Bot verifies the player is in a voice channel
3. Bot connects to the voice channel
4. STT pipeline activates — begins listening
5. Greeting message played via TTS: "The DM has arrived..."

**Leave Flow:**
1. Player issues `/dismiss-dm` or session ends
2. Bot plays farewell TTS
3. STT pipeline deactivates
4. Bot disconnects from voice channel
5. Session state saved to Supabase

### 2. Speech-to-Text Pipeline

```
Discord Audio Stream → Opus Decode → VAD (Voice Activity Detection)
    → STT Engine (Scribe v2 / Cartesia Ink) → Transcribed Text
    → Speaker Identification → Backend API
```

- **VAD**: Detects when a player is speaking vs. silence
- **Speaker ID**: Maps Discord user IDs to character names
- **Buffering**: Collects speech segments before sending to STT
- **Streaming**: Supports real-time streaming transcription

### 3. Text-to-Speech Playback

```
DM Response Text → TTS Engine (ElevenLabs) → Audio Stream
    → Opus Encode → Discord Voice Channel Playback
```

- **Character Voices**: Different ElevenLabs voice IDs per NPC
- **Streaming**: Audio streams as it generates (low latency)
- **Queue**: Multiple TTS segments queued for sequential playback
- **Interruption**: Players can interrupt TTS with new speech

### 4. Slash Commands

| Command | Description |
|---------|-------------|
| `/summon-dm` | Bot joins voice channel, starts session |
| `/dismiss-dm` | Bot leaves voice channel, saves session |
| `/campaign create <name>` | Create a new campaign |
| `/campaign list` | List player's campaigns |
| `/campaign load <id>` | Load and resume a campaign |
| `/roll <dice>` | Roll dice (e.g., `/roll 2d6+3`) |
| `/status` | Show current session status |
| `/help` | Show available commands |

## Message Flow

```python
# Simplified event loop
async def on_voice_received(user_id, audio_data):
    # 1. Transcribe speech
    text = await stt_engine.transcribe(audio_data)
    
    # 2. Map to character
    character = await get_character(user_id, campaign_id)
    
    # 3. Send to backend API
    response = await backend.process_player_input(
        campaign_id=campaign_id,
        character_name=character.name,
        text=text,
        session_id=session_id
    )
    
    # 4. Play DM response via TTS
    audio_stream = await tts_engine.synthesize(
        text=response.dm_text,
        voice_id=response.voice_id
    )
    await voice_client.play(audio_stream)
    
    # 5. Push UI updates to Activity
    await activity_ws.send_update(response.ui_updates)
```

## Error Handling

| Scenario | Handling |
|----------|---------|
| Bot disconnected from voice | Auto-reconnect with exponential backoff |
| STT failure | Fall back to text input via slash commands |
| TTS failure | Send text response to text channel |
| Backend timeout | Queue request, retry with backoff |
| Rate limited | Throttle requests, notify players |

## Configuration

```yaml
# bot-config.yaml
discord:
  token: ${DISCORD_BOT_TOKEN}
  application_id: ${DISCORD_APP_ID}
  guild_ids: []  # Empty = global commands

voice:
  stt_engine: "elevenlabs_scribe_v2"  # or "cartesia_ink"
  tts_engine: "elevenlabs"
  vad_threshold: 0.5
  silence_timeout_ms: 1500
  max_speech_duration_ms: 30000

backend:
  api_url: ${BACKEND_API_URL}
  api_key: ${BACKEND_API_KEY}
  timeout_ms: 10000

dm:
  default_voice_id: "dm_narrator"
  greeting: "The Dungeon Master has arrived. What would you like to do?"
  farewell: "The DM departs. Your progress has been saved."
```

## Scaling Considerations

- **Phase 0-1**: Single bot instance on Hostinger VPS
- **Phase 2**: Bot sharding for multiple guilds (discord.py AutoShardedClient)
- **Phase 3**: Distributed bot instances with Redis-backed session coordination
