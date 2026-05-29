# Voice Pipeline Architecture

> **STT → Claw → TTS**

## Overview

The voice pipeline enables players to speak naturally to the AI DM and hear responses in character voices. It consists of three stages:

1. **STT (Speech-to-Text)** — Player voice → transcribed text
2. **Processing** — Text → Abacus Claw → DM response
3. **TTS (Text-to-Speech)** — DM response → character voice audio

## Pipeline Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Discord Voice Channel                  │
│                                                          │
│  Player speaks  ──────►  Bot receives Opus audio stream  │
│                                                          │
│  Bot plays audio  ◄──── TTS audio stream                 │
└────────┬─────────────────────────────────┬──────────────┘
         │                                 ▲
         ▼                                 │
┌─────────────────┐               ┌─────────────────┐
│  STT Engine      │               │  TTS Engine      │
│                  │               │                  │
│  Opus → PCM      │               │  Text → Audio    │
│  VAD detection   │               │  Voice selection │
│  Transcription   │               │  Streaming       │
└────────┬────────┘               └────────▲────────┘
         │ text                            │ text
         ▼                                 │
┌──────────────────────────────────────────┐
│           Backend API + Claw              │
│  Context build → Agent call → Response   │
└──────────────────────────────────────────┘
```

## STT Options

### Option A: ElevenLabs Scribe v2 (Primary)

- **Latency**: ~200-500ms
- **Accuracy**: High for English, good for accented speech
- **Features**: Speaker diarization, word-level timestamps
- **Cost**: Per-minute pricing
- **Integration**: REST API with streaming support

### Option B: Cartesia Ink (Alternative)

- **Latency**: ~150-300ms (lower latency)
- **Accuracy**: Comparable to Scribe v2
- **Features**: Optimized for real-time streaming
- **Cost**: Per-minute pricing
- **Integration**: WebSocket streaming

### Option C: OpenAI Whisper (Fallback)

- **Latency**: ~500-1000ms
- **Accuracy**: Excellent for English
- **Features**: Language detection, translation
- **Cost**: $0.006/minute
- **Integration**: REST API (batch mode)

## TTS Configuration

### ElevenLabs Voices

| Voice ID | Character | Use Case |
|----------|-----------|----------|
| `dm_narrator` | Default DM | General narration |
| `dm_dramatic` | Dramatic DM | Combat, tension |
| `npc_tavern_keeper` | NPC template | Friendly NPCs |
| `npc_villain` | NPC template | Antagonists |
| `npc_elderly` | NPC template | Wise NPCs, sages |

### Voice Selection Logic

```python
def select_voice(response_context):
    if response_context.is_npc_dialogue:
        return get_npc_voice(response_context.npc_name)
    elif response_context.is_combat:
        return "dm_dramatic"
    else:
        return "dm_narrator"
```

### Streaming TTS

```python
async def stream_tts_to_discord(text, voice_id, voice_client):
    """Stream TTS audio to Discord voice channel."""
    async with elevenlabs.stream(text=text, voice_id=voice_id) as stream:
        audio_source = DiscordPCMAudio(stream)
        voice_client.play(audio_source)
        
        # Wait for playback to complete
        while voice_client.is_playing():
            await asyncio.sleep(0.1)
```

## Latency Budget

| Stage | Target | Max |
|-------|--------|-----|
| Audio capture + VAD | 100ms | 300ms |
| STT transcription | 300ms | 800ms |
| Backend processing | 50ms | 200ms |
| Claw response (first token) | 500ms | 2000ms |
| TTS first audio chunk | 200ms | 500ms |
| **Total (first audio)** | **~1.2s** | **~3.8s** |

## Interruption Handling

Players can interrupt the DM while it's speaking:

1. VAD detects player speech during TTS playback
2. TTS playback is stopped immediately
3. Player's speech is transcribed
4. New request sent to Claw with context that the DM was interrupted
5. New response generated and played

## Cost Per Voice Minute

| Component | Cost/min |
|-----------|----------|
| STT (Scribe v2) | ~$0.01 |
| Claw (agent call) | ~$0.02-0.05 (varies by tokens) |
| TTS (ElevenLabs) | ~$0.01-0.03 |
| **Total** | **~$0.04-0.09/min** |

## See Also

- [Discord Bot Architecture](./discord-bot.md)
- [Cost Analysis](../cost-analysis/usage-metering.md)
