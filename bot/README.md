# BakaDM Discord Bot

Phase 0 MVP — Text-only AI Dungeon Master bot for Discord.

## Features

- `/summon-dm` — Start a new D&D session
- `/dismiss-dm` — End the current session
- `/roll <dice>` — Roll dice (e.g. `2d6+3`)
- `/status` — Show session info
- `/help` — Show available commands
- `@BakaDM <message>` — Talk to the DM during an active session

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the bot:
   ```bash
   python src/bot.py
   ```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_BOT_TOKEN` | Yes | Discord bot token |
| `DISCORD_APPLICATION_ID` | Yes | Discord application ID |
| `BACKEND_API_URL` | No | Backend API URL (default: localhost) |
| `BACKEND_API_KEY` | No | API key for bot-to-backend auth |
| `LOG_LEVEL` | No | Logging level (default: INFO) |
| `DISCORD_GUILD_IDS` | No | Comma-separated guild IDs for dev sync |

## Architecture

- `bot.py` — Main bot class with slash commands and message handling
- `config.py` — Environment-based configuration
- `session_manager.py` — In-memory session state (Phase 0)

## Phase 1+ Roadmap

- Voice channel join/leave
- STT (ElevenLabs Scribe v2) integration
- TTS (ElevenLabs) playback
- Backend API integration for Claw DM responses
- Redis-backed session coordination
