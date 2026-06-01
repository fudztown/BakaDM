"""BakaDM Discord Bot — Phase 0 MVP Foundation.

Text-only D&D AI Dungeon Master bot built with discord.py.
Provides /summon-dm, /dismiss-dm, /roll, and free-text DM interaction.
"""

import asyncio
import logging
import sys
from typing import Optional

import discord
from discord.ext import commands

from config import BotConfig
from session_manager import SessionManager, SessionState
from backend_client import BackendClient

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("bakadm")

# ---------------------------------------------------------------------------
# Bot class
# ---------------------------------------------------------------------------

INTENTS = discord.Intents.default()
# Note: message_content is a privileged intent.
# Enable it at https://discord.com/developers/applications/1510656970548449532/bot
# if you want the bot to read message content (needed for @mention replies).
# For now we rely on slash commands which don't need it.
# INTENTS.message_content = True


class BakaDMBot(commands.Bot):
    """Discord bot for BakaDM — AI Dungeon Master."""

    def __init__(self, config: BotConfig) -> None:
        self.config = config
        self.session_manager = SessionManager()
        self.backend = BackendClient(
            base_url=config.backend_api_url,
            api_key=config.backend_api_key,
            mock_mode=True,  # Phase 0: stub mode
        )

        super().__init__(
            command_prefix="!",  # Fallback prefix; we use slash commands
            intents=INTENTS,
            application_id=int(config.application_id),
        )

    async def setup_hook(self) -> None:
        """Load cogs and sync commands on startup."""
        await self.add_cog(CoreCommands(self))
        await self.add_cog(SessionCommands(self))

        guilds = self.config.guild_ids
        if guilds:
            for guild_id in guilds:
                guild = discord.Object(id=guild_id)
                self.tree.copy_global_to(guild=guild)
                await self.tree.sync(guild=guild)
            logger.info(f"Synced commands to {len(guilds)} guild(s)")
        else:
            await self.tree.sync()
            logger.info("Synced commands globally (may take up to 1 hour)")

    async def on_ready(self) -> None:
        logger.info(f"Bot logged in as {self.user} (ID: {self.user.id})")
        logger.info(f"Active in {len(self.guilds)} guild(s)")

    async def on_command_error(self, ctx: commands.Context, error: commands.CommandError) -> None:
        """Handle command errors gracefully."""
        if isinstance(error, commands.CommandNotFound):
            return  # Silently ignore unknown prefix commands

        if isinstance(error, commands.MissingRequiredArgument):
            await ctx.send(f"❌ Missing required argument: `{error.param.name}`")
            return

        if isinstance(error, commands.BadArgument):
            await ctx.send(f"❌ Bad argument: {error}")
            return

        if isinstance(error, commands.CommandOnCooldown):
            await ctx.send(f"⏸️ Command on cooldown. Try again in {error.retry_after:.1f}s")
            return

        # Log unexpected errors but send a clean message to users
        logger.exception(f"Unhandled command error in {ctx.command}: {error}")
        await ctx.send("❌ Something went wrong. The error has been logged.")

    async def on_error(self, event_method: str, /, *args, **kwargs) -> None:
        """Handle non-command errors (events, listeners)."""
        logger.exception(f"Unhandled error in event: {event_method}")

    async def on_message(self, message: discord.Message) -> None:
        """Process free-text messages when bot is mentioned in a guild with an active session."""
        if message.author == self.user:
            return

        if not message.guild:
            return  # Phase 0: ignore DMs for now

        # Only respond if bot is mentioned and session is active
        if self.user.mentioned_in(message):
            session = await self.session_manager.get_session(message.guild.id)
            if session and session.status == "active":
                await self._handle_player_input(message, session)
            else:
                await message.reply(
                    "🎲 No active session! Use `/summon-dm` to start one.",
                    mention_author=False,
                )

        await self.process_commands(message)

    async def _handle_player_input(
        self, message: discord.Message, session: SessionState
    ) -> None:
        """Send player input to the backend API and reply with the DM's response."""
        content = message.content.replace(f"<@{self.user.id}>", "").strip()
        if not content:
            return

        await self.session_manager.increment_message_count(session.guild_id)

        character_name = session.players.get(message.author.id, {}).get(
            "character_name", message.author.display_name
        )
        logger.info(f"[{session.id}] {character_name}: {content}")

        try:
            dm = await self.backend.send_message(
                session_id=str(session.id),
                player_id=str(message.author.id),
                character_name=character_name,
                text=content,
                source="text",
            )
        except Exception:
            logger.exception("Backend send_message failed")
            await message.reply(
                "❌ The DM's crystal ball is cloudy right now. Please try again.",
                mention_author=False,
            )
            return

        embed = discord.Embed(
            description=dm.dm_text,
            color=discord.Color.dark_purple(),
        )
        embed.set_author(name=f"🧙‍♂️ DM")
        embed.set_footer(text=f"Speaking to {character_name}")
        await message.reply(embed=embed, mention_author=False)


# ---------------------------------------------------------------------------
# Cogs
# ---------------------------------------------------------------------------

class CoreCommands(commands.Cog):
    """Core utility commands."""

    def __init__(self, bot: BakaDMBot) -> None:
        self.bot = bot

    @commands.hybrid_command(name="roll", description="Roll dice using D&D notation")
    async def roll(self, ctx: commands.Context, expression: str) -> None:
        """Roll dice, e.g. /roll 2d6+3."""
        # Defer the interaction response to avoid timeout
        await ctx.defer()
        
        # Simple dice parser for Phase 0
        import random
        import re

        match = re.match(r"(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?", expression.lower().replace(" ", ""))
        if not match:
            await ctx.send(
                "❌ Invalid dice notation. Use format like `2d6`, `1d20+5`, `3d8-2`"
            )
            return

        num_dice = int(match.group(1))
        num_sides = int(match.group(2))
        modifier_op = match.group(3)
        modifier_val = int(match.group(4)) if match.group(4) else 0

        if num_dice > 100 or num_sides > 1000:
            await ctx.send("❌ That's too many dice! Max 100 dice, 1000 sides.")
            return

        rolls = [random.randint(1, num_sides) for _ in range(num_dice)]
        total = sum(rolls)
        if modifier_op == "+":
            total += modifier_val
        elif modifier_op == "-":
            total -= modifier_val

        roll_str = " + ".join(str(r) for r in rolls)
        modifier_str = ""
        if modifier_op and modifier_val:
            modifier_str = f" {modifier_op} {modifier_val}"

        embed = discord.Embed(
            title="🎲 Dice Roll",
            color=discord.Color.gold(),
        )
        embed.add_field(name="Expression", value=f"`{expression}`", inline=True)
        embed.add_field(name="Rolls", value=f"`{roll_str}`", inline=True)
        embed.add_field(name="Total", value=f"**{total}**", inline=False)
        embed.set_footer(text=f"Rolled by {ctx.author.display_name}")

        await ctx.send(embed=embed)

        # Optionally log roll to backend (fire-and-forget)
        if ctx.guild:
            session = await self.bot.session_manager.get_session(ctx.guild.id)
            if session:
                try:
                    await self.bot.backend.log_roll(
                        session_id=str(session.id),
                        expression=expression,
                        rolls=rolls,
                        total=total,
                        roller_id=str(ctx.author.id),
                        roller_name=ctx.author.display_name,
                    )
                except Exception:
                    logger.exception("Backend log_roll failed (non-critical)")

    @commands.hybrid_command(name="status", description="Show current session status")
    async def status(self, ctx: commands.Context) -> None:
        """Show the status of the current guild's session."""
        await ctx.defer()
        
        if not ctx.guild:
            await ctx.send("❌ This command only works in a server.")
            return

        session = await self.bot.session_manager.get_session(ctx.guild.id)
        if not session or session.status != "active":
            await ctx.send("🎲 No active session. Use `/summon-dm` to start one.")
            return

        embed = discord.Embed(
            title="📜 Session Status",
            color=discord.Color.blue(),
        )
        embed.add_field(name="Session ID", value=f"`{session.id}`", inline=False)
        embed.add_field(name="Campaign", value=f"`{session.campaign_id}`", inline=False)
        embed.add_field(name="Messages", value=session.message_count, inline=True)
        embed.add_field(
            name="Players",
            value=len(session.players) or "None yet",
            inline=True,
        )
        embed.add_field(
            name="Started",
            value=session.started_at.strftime("%Y-%m-%d %H:%M UTC"),
            inline=False,
        )

        await ctx.send(embed=embed)

    @commands.hybrid_command(name="helpme", description="Show available commands")
    async def help_command(self, ctx: commands.Context) -> None:
        """Display help information."""
        await ctx.defer()
        
        embed = discord.Embed(
            title="🧙‍♂️ BakaDM Help",
            description="Your AI Dungeon Master for Discord!",
            color=discord.Color.purple(),
        )
        embed.add_field(
            name="Session Commands",
            value=(
                "`/summon-dm` — Start a new session\n"
                "`/dismiss-dm` — End the current session\n"
                "`/status` — Show session info"
            ),
            inline=False,
        )
        embed.add_field(
            name="Game Commands",
            value=(
                "`/roll <dice>` — Roll dice (e.g. `2d6+3`)\n"
                "`@BakaDM <message>` — Talk to the DM (during active session)"
            ),
            inline=False,
        )
        embed.set_footer(text="Phase 0 MVP — Voice coming in Phase 1!")
        await ctx.send(embed=embed)


class SessionCommands(commands.Cog):
    """Session management commands."""

    def __init__(self, bot: BakaDMBot) -> None:
        self.bot = bot

    @commands.hybrid_command(name="summon-dm", description="Summon the AI DM to start a session")
    async def summon_dm(self, ctx: commands.Context) -> None:
        """Start a new D&D session in this guild."""
        await ctx.defer()
        
        if not ctx.guild:
            await ctx.send("❌ This command only works in a server.")
            return

        # Check if user is in a voice channel (Phase 0: just log it, no voice yet)
        voice_channel: Optional[discord.VoiceChannel] = None
        if isinstance(ctx.author, discord.Member) and ctx.author.voice:
            voice_channel = ctx.author.voice.channel

        # For MVP, use a placeholder campaign ID (backend will create/link real campaigns)
        from uuid import UUID

        placeholder_campaign = UUID("00000000-0000-0000-0000-000000000000")

        try:
            session = await self.bot.session_manager.create_session(
                guild_id=ctx.guild.id,
                campaign_id=placeholder_campaign,
                voice_channel_id=voice_channel.id if voice_channel else None,
                text_channel_id=ctx.channel.id,
            )
        except ValueError as exc:
            await ctx.send(f"❌ {exc}")
            return

        # Notify backend (stub for now)
        try:
            backend_session = await self.bot.backend.start_session(
                campaign_id=str(placeholder_campaign),
                voice_channel_id=str(voice_channel.id) if voice_channel else None,
            )
            logger.info(f"Backend session started: {backend_session['session_id']}")
        except Exception:
            logger.exception("Backend start_session failed (non-critical for Phase 0)")

        # Add the summoner as first player
        await self.bot.session_manager.add_player(
            guild_id=ctx.guild.id,
            user_id=ctx.author.id,
            character_name=ctx.author.display_name,
        )

        embed = discord.Embed(
            title="🧙‍♂️ The DM Has Arrived!",
            description=(
                "*The air shimmers as a figure steps from the shadows...*\n\n"
                "Welcome, adventurers! I'm your AI Dungeon Master. "
                "Mention me with `@BakaDM` to speak, or use `/roll` for dice."
            ),
            color=discord.Color.dark_purple(),
        )
        embed.add_field(name="Session", value=f"`{session.id}`", inline=True)
        if voice_channel:
            embed.add_field(name="Voice", value=voice_channel.name, inline=True)
            embed.set_footer(text="🔮 Voice integration coming in Phase 1!")
        else:
            embed.set_footer(text="💬 Text-only mode (Phase 0 MVP)")

        await ctx.send(embed=embed)
        logger.info(f"Session {session.id} started in guild {ctx.guild.id}")

    @commands.hybrid_command(name="dismiss-dm", description="Dismiss the AI DM and end the session")
    async def dismiss_dm(self, ctx: commands.Context) -> None:
        """End the current D&D session."""
        await ctx.defer()
        
        if not ctx.guild:
            await ctx.send("❌ This command only works in a server.")
            return

        session = await self.bot.session_manager.end_session(ctx.guild.id)
        if not session:
            await ctx.send("🎲 No active session to end.")
            return

        # Notify backend (stub for now)
        try:
            summary = await self.bot.backend.end_session(str(session.id))
            logger.info(f"Backend session ended: {summary.session_id}")
        except Exception:
            logger.exception("Backend end_session failed (non-critical for Phase 0)")

        embed = discord.Embed(
            title="👋 The DM Departs",
            description=(
                "*The figure fades into shadow, their voice echoing...*\n\n"
                f"\"Your tale continues another day.\"\n\n"
                f"**Session Summary:**\n"
                f"• Messages: {session.message_count}\n"
                f"• Duration: _calculating..._\n"
                f"• Players: {len(session.players)}"
            ),
            color=discord.Color.dark_grey(),
        )
        embed.set_footer(text="Your progress will be saved. See you next time!")

        await ctx.send(embed=embed)
        logger.info(f"Session {session.id} ended in guild {ctx.guild.id}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    config = BotConfig.from_env()
    config.validate()

    bot = BakaDMBot(config)
    bot.run(config.discord_token)


if __name__ == "__main__":
    main()
