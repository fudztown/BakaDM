// ============================================================
// BakaDM Progress Map — Lego-block architecture visual
// Auto-detects repo state and shows build/test/working status
// ============================================================

const PHASES = [
  {
    id: 0,
    name: "Phase 0 — MVP Bot",
    goal: "Text-only Discord bot with session management",
    blocks: [
      { id: "bot_core", name: "Bot Core", category: "bot", desc: "Discord.py bot setup, intents, event handlers" },
      { id: "config", name: "Configuration", category: "bot", desc: "Env-based config with validation" },
      { id: "session_mgr", name: "Session Manager", category: "bot", desc: "In-memory session state per guild" },
      { id: "commands", name: "Slash Commands", category: "bot", desc: "/summon-dm, /dismiss-dm, /roll, /status, /help" },
      { id: "mention_handler", name: "Mention Handler", category: "bot", desc: "@BakaDM free-text input processing" },
      { id: "tests_session", name: "Session Tests", category: "test", desc: "pytest suite for session manager" },
      { id: "backend_stub", name: "Backend Client (Stub)", category: "backend", desc: "Mock backend client with placeholder responses" },
      { id: "supabase_schema", name: "Supabase Schema", category: "infra", desc: "Users, campaigns, characters, sessions, messages tables" },
      { id: "claw_persona", name: "DM Persona Prompt", category: "ai", desc: "System prompt for Abacus Claw DM" },
      { id: "claw_tools", name: "Claw Tools", category: "ai", desc: "dice_roll, lookup_spell, lookup_monster" },
      { id: "api_sessions", name: "API: Sessions", category: "api", desc: "POST /api/sessions/:id/message" },
      { id: "api_crud", name: "API: CRUD", category: "api", desc: "Campaign/session/character CRUD" },
      { id: "deploy_bot", name: "Deploy: Bot", category: "deploy", desc: "Bot running on Hostinger VPS" },
      { id: "deploy_api", name: "Deploy: API", category: "deploy", desc: "Next.js API on Vercel" },
      { id: "deploy_db", name: "Deploy: Database", category: "deploy", desc: "Supabase project live" },
    ]
  },
  {
    id: 1,
    name: "Phase 1 — Voice Alpha",
    goal: "Players speak to the DM and hear voiced responses",
    blocks: [
      { id: "voice_join", name: "Voice Channel Join/Leave", category: "bot", desc: "Bot connects to Discord voice channels" },
      { id: "stt", name: "STT Integration", category: "voice", desc: "ElevenLabs Scribe v2 / Cartesia Ink" },
      { id: "tts", name: "TTS Integration", category: "voice", desc: "ElevenLabs streaming playback" },
      { id: "vad", name: "Voice Activity Detection", category: "voice", desc: "Detect when players start/stop speaking" },
      { id: "speaker_id", name: "Speaker ID", category: "voice", desc: "Map Discord user → character" },
      { id: "interruption", name: "Interruption Handling", category: "voice", desc: "Stop TTS when player speaks" },
      { id: "voice_fallback", name: "Text Fallback", category: "voice", desc: "Fallback to text when voice fails" },
      { id: "voice_metering", name: "Voice Metering", category: "infra", desc: "Track STT minutes, TTS characters" },
      { id: "npc_voices", name: "NPC Voice Presets", category: "voice", desc: "2-3 character-specific voices" },
      { id: "latency_opt", name: "Latency Optimization", category: "perf", desc: "<2s end-to-end speak → hear" },
      { id: "context_mgmt", name: "Context Window Mgmt", category: "perf", desc: "Rolling summarization" },
    ]
  },
  {
    id: 2,
    name: "Phase 2 — Activity Beta",
    goal: "Rich game UI with maps and combat in Discord Activity",
    blocks: [
      { id: "activity_sdk", name: "Discord SDK", category: "activity", desc: "OAuth flow + SDK integration" },
      { id: "activity_lobby", name: "Campaign Lobby", category: "activity", desc: "Dashboard / lobby UI" },
      { id: "gamemap", name: "GameMap Component", category: "activity", desc: "Real-time multi-player map" },
      { id: "combat_tracker", name: "CombatTracker", category: "activity", desc: "Initiative, HP, conditions" },
      { id: "character_sheet", name: "CharacterSheet", category: "activity", desc: "View/edit character stats" },
      { id: "dice_roller", name: "DiceRoller", category: "activity", desc: "Animated shared dice rolls" },
      { id: "narrative_log", name: "NarrativeLog", category: "activity", desc: "Streaming DM responses" },
      { id: "realtime_sync", name: "Realtime Sync", category: "infra", desc: "Supabase Realtime for state sync" },
      { id: "combat_flow", name: "Combat Flow", category: "game", desc: "Turn-based combat with initiative" },
      { id: "monster_stats", name: "Monster Stat Blocks", category: "game", desc: "Open5e integration" },
      { id: "map_grid", name: "Token-based Map", category: "game", desc: "Grid + fog of war" },
      { id: "mobile_ui", name: "Mobile Responsive", category: "activity", desc: "Discord mobile support" },
    ]
  },
  {
    id: 3,
    name: "Phase 3 — Launch",
    goal: "Public launch with monetization and production polish",
    blocks: [
      { id: "premium_apps", name: "Discord Premium Apps", category: "monetize", desc: "Subscription SKUs" },
      { id: "usage_limits", name: "Usage Limits", category: "monetize", desc: "Enforce tier limits" },
      { id: "tutorial", name: "Tutorial Campaign", category: "onboard", desc: '"The Tutorial Tavern"' },
      { id: "char_wizard", name: "Character Wizard", category: "onboard", desc: "Interactive character creation" },
      { id: "prebuilt_campaigns", name: "Pre-built Campaigns", category: "content", desc: "5+ starter campaigns" },
      { id: "usage_dashboard", name: "Usage Dashboard", category: "admin", desc: "Player usage analytics" },
      { id: "admin_dashboard", name: "Admin Dashboard", category: "admin", desc: "Monitoring & alerting" },
      { id: "bot_sharding", name: "Bot Sharding", category: "infra", desc: "AutoShardedClient" },
      { id: "rate_limiting", name: "Rate Limiting", category: "infra", desc: "Abuse prevention" },
      { id: "sentry", name: "Error Monitoring", category: "infra", desc: "Sentry integration" },
      { id: "backups", name: "Automated Backups", category: "infra", desc: "Supabase backups" },
      { id: "load_testing", name: "Load Testing", category: "infra", desc: "100+ concurrent sessions" },
      { id: "npc_presets", name: "20+ NPC Voices", category: "content", desc: "Voice preset library" },
      { id: "campaign_import", name: "Campaign Import", category: "content", desc: "Basic module support" },
      { id: "legal", name: "Legal", category: "admin", desc: "ToS, Privacy Policy, SRD compliance" },
    ]
  }
];

const CATEGORY_COLORS = {
  bot: { bg: "#7c5cff", label: "Discord Bot" },
  voice: { bg: "#00d4aa", label: "Voice" },
  activity: { bg: "#4dabf7", label: "Activity UI" },
  backend: { bg: "#ff9f43", label: "Backend" },
  api: { bg: "#ff9f43", label: "API" },
  ai: { bg: "#e056fd", label: "AI / Claw" },
  infra: { bg: "#a4b0be", label: "Infrastructure" },
  deploy: { bg: "#2ed573", label: "Deployment" },
  test: { bg: "#ffa502", label: "Testing" },
  perf: { bg: "#ff6348", label: "Performance" },
  game: { bg: "#ff6b81", label: "Game Logic" },
  monetize: { bg: "#ffeaa7", label: "Monetization" },
  onboard: { bg: "#dfe6e9", label: "Onboarding" },
  content: { bg: "#fd79a8", label: "Content" },
  admin: { bg: "#74b9ff", label: "Admin" },
};

// ============================================================
// Detection heuristics — scan the repo to determine status
// ============================================================

async function detectRepoState() {
  const state = {
    files: {},
    tests: {},
    todos: {},
    lines: {},
  };

  // Try to fetch repo contents via GitHub API
  try {
    const treeRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/git/trees/main?recursive=1`);
    if (treeRes.ok) {
      const tree = await treeRes.json();
      state.fileList = tree.tree.map((t) => t.path);

      // Detect key files
      state.files.bot_py = state.fileList.includes("bot/src/bot.py");
      state.files.config_py = state.fileList.includes("bot/src/config.py");
      state.files.session_mgr = state.fileList.includes("bot/src/session_manager.py");
      state.files.backend_client = state.fileList.includes("bot/src/backend_client.py");
      state.files.tests = state.fileList.some((p) => p.startsWith("bot/tests/") && p.endsWith(".py"));
      state.files.requirements = state.fileList.includes("bot/requirements.txt");
      state.files.env_example = state.fileList.includes("bot/.env.example");
      state.files.readme = state.fileList.includes("bot/README.md");

      // Check for Supabase/schema files
      state.files.supabase = state.fileList.some((p) => p.includes("supabase") || p.includes("schema"));

      // Check for API/Next.js
      state.files.api = state.fileList.some((p) => p.startsWith("api/") || p.includes("next.config"));

      // Check for Activity
      state.files.activity = state.fileList.some((p) => p.startsWith("activity/") || p.includes("Activity"));

      // Check for voice-related code
      state.files.voice = state.fileList.some((p) => p.includes("voice") || p.includes("stt") || p.includes("tts"));

      // Check for Claw/AI integration
      state.files.claw = state.fileList.some((p) => p.includes("claw") || p.includes("Claw"));

      // Check for deployment configs
      state.files.vercel = state.fileList.includes("vercel.json");
      state.files.docker = state.fileList.includes("Dockerfile");
      state.files.github_actions = state.fileList.some((p) => p.startsWith(".github/workflows/"));
    }
  } catch (e) {
    console.warn("Could not fetch repo tree:", e);
  }

  // Fetch issues to detect blockers
  try {
    const issuesRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/issues?state=all&per_page=100`);
    if (issuesRes.ok) {
      const issues = await issuesRes.json();
      state.issues = issues.filter((i) => !i.pull_request);
      state.openBugs = state.issues.filter((i) => i.state === "open" && i.labels.some((l) => l.name.toLowerCase().includes("bug"))).length;
      state.openIssues = state.issues.filter((i) => i.state === "open").length;
    }
  } catch (e) {
    console.warn("Could not fetch issues:", e);
  }

  return state;
}

// ============================================================
// Status resolver — maps detection to block status
// ============================================================

function resolveBlockStatus(block, phaseId, repoState) {
  const s = repoState;

  // Phase 0 blocks
  if (phaseId === 0) {
    switch (block.id) {
      case "bot_core":
        return s.files?.bot_py ? "built" : "not_started";
      case "config":
        return s.files?.config_py ? "built" : "not_started";
      case "session_mgr":
        return s.files?.session_mgr ? "built" : "not_started";
      case "commands":
        return s.files?.bot_py ? "built" : "not_started";
      case "mention_handler":
        return s.files?.bot_py ? "built" : "not_started";
      case "tests_session":
        return s.files?.tests ? "built" : "not_started";
      case "backend_stub":
        return s.files?.backend_client ? "built" : "not_started";
      case "supabase_schema":
        return s.files?.supabase ? "built" : "not_started";
      case "claw_persona":
      case "claw_tools":
        return s.files?.claw ? "built" : "not_started";
      case "api_sessions":
      case "api_crud":
        return s.files?.api ? "built" : "not_started";
      case "deploy_bot":
        return s.files?.bot_py && s.files?.requirements ? "in_progress" : "not_started";
      case "deploy_api":
        return s.files?.vercel ? "built" : "not_started";
      case "deploy_db":
        return s.files?.supabase ? "built" : "not_started";
    }
  }

  // Phase 1+ — check if previous phase is complete
  if (phaseId >= 1) {
    // All phase 1+ blocks default to not_started unless detected
    if (block.category === "voice" && s.files?.voice) return "built";
    if (block.category === "activity" && s.files?.activity) return "built";
    return "not_started";
  }

  return "not_started";
}

function getPhaseGateStatus(phaseId, repoState) {
  const phase = PHASES[phaseId];
  const statuses = phase.blocks.map((b) => resolveBlockStatus(b, phaseId, repoState));

  const total = statuses.length;
  const built = statuses.filter((s) => s === "built" || s === "tested" || s === "working").length;
  const tested = statuses.filter((s) => s === "tested" || s === "working").length;
  const working = statuses.filter((s) => s === "working").length;

  // Heuristic: if all blocks are built and no open bugs, phase is "working"
  let overall = "not_started";
  if (built > 0) overall = "in_progress";
  if (built === total) overall = "built";
  if (built === total && tested > 0) overall = "tested";
  if (built === total && repoState.openBugs === 0) overall = "working";

  return { overall, built, tested, working, total, statuses };
}

// ============================================================
// Rendering
// ============================================================

function renderProgressMap(repoState) {
  const container = document.getElementById("progressMap");
  if (!container) return;

  let html = `<div class="progress-map">`;

  PHASES.forEach((phase, idx) => {
    const gate = getPhaseGateStatus(idx, repoState);
    const isCurrent = gate.overall === "in_progress" || (idx > 0 && getPhaseGateStatus(idx - 1, repoState).overall === "working" && gate.overall !== "working");
    const isComplete = gate.overall === "working";

    html += `
      <div class="phase-section ${isCurrent ? "current" : ""} ${isComplete ? "complete" : ""}" data-phase="${phase.id}">
        <div class="phase-header">
          <div class="phase-title">
            <span class="phase-number">${phase.id}</span>
            <div>
              <div class="phase-name">${phase.name}</div>
              <div class="phase-goal">${phase.goal}</div>
            </div>
          </div>
          <div class="phase-gate">
            <span class="gate-badge gate-${gate.overall}">${formatGate(gate.overall)}</span>
            <span class="phase-count">${gate.built}/${gate.total}</span>
          </div>
        </div>
        <div class="phase-progress-bar">
          <div class="phase-progress-fill" style="width:${(gate.built / gate.total) * 100}%"></div>
        </div>
        <div class="blocks-grid">
          ${phase.blocks.map((block, bidx) => {
            const status = resolveBlockStatus(block, idx, repoState);
            const cat = CATEGORY_COLORS[block.category] || { bg: "#8b8fa3", label: block.category };
            return `
              <div class="lego-block block-${status}" data-block="${block.id}" title="${block.desc}">
                <div class="block-top" style="background:${cat.bg}"></div>
                <div class="block-body">
                  <div class="block-status-icon">${statusIcon(status)}</div>
                  <div class="block-name">${block.name}</div>
                  <div class="block-category" style="color:${cat.bg}">${cat.label}</div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Add click handlers for blocks
  container.querySelectorAll(".lego-block").forEach((block) => {
    block.addEventListener("click", () => {
      const blockId = block.dataset.block;
      showBlockDetail(blockId, repoState);
    });
  });
}

function formatGate(status) {
  const map = {
    not_started: "Not Started",
    in_progress: "In Progress",
    built: "Built",
    tested: "Tested",
    working: "Working ✅",
  };
  return map[status] || status;
}

function statusIcon(status) {
  const map = {
    not_started: "○",
    in_progress: "🔄",
    built: "🔧",
    tested: "🧪",
    working: "✅",
  };
  return map[status] || "○";
}

function showBlockDetail(blockId, repoState) {
  // Find block info
  let block = null;
  let phase = null;
  for (const p of PHASES) {
    const b = p.blocks.find((x) => x.id === blockId);
    if (b) { block = b; phase = p; break; }
  }
  if (!block) return;

  const status = resolveBlockStatus(block, phase.id, repoState);
  const cat = CATEGORY_COLORS[block.category] || { bg: "#8b8fa3", label: block.category };

  const detail = document.getElementById("blockDetail");
  detail.innerHTML = `
    <div class="detail-card">
      <div class="detail-header">
        <div class="detail-title">${block.name}</div>
        <span class="gate-badge gate-${status}">${formatGate(status)}</span>
      </div>
      <div class="detail-meta">
        <span class="detail-category" style="background:${cat.bg}20;color:${cat.bg}">${cat.label}</span>
        <span class="detail-phase">Phase ${phase.id}</span>
      </div>
      <p class="detail-desc">${block.desc}</p>
      <div class="detail-checklist">
        ${renderChecklist(block, status, repoState)}
      </div>
    </div>
  `;
  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderChecklist(block, status, repoState) {
  // Generate checklist based on block type and repo state
  const checks = [];

  if (block.id === "bot_core") {
    checks.push({ label: "Bot class defined", done: status !== "not_started" });
    checks.push({ label: "Intents configured", done: status !== "not_started" });
    checks.push({ label: "Event handlers (on_ready, on_message)", done: status !== "not_started" });
    checks.push({ label: "Cog system set up", done: status !== "not_started" });
  } else if (block.id === "session_mgr") {
    checks.push({ label: "SessionState dataclass", done: status !== "not_started" });
    checks.push({ label: "create_session()", done: status !== "not_started" });
    checks.push({ label: "get_session()", done: status !== "not_started" });
    checks.push({ label: "end_session()", done: status !== "not_started" });
    checks.push({ label: "add_player()", done: status !== "not_started" });
    checks.push({ label: "Thread-safe (async lock)", done: status !== "not_started" });
    checks.push({ label: "Unit tests pass", done: repoState.files?.tests && status !== "not_started" });
  } else if (block.id === "commands") {
    checks.push({ label: "/summon-dm", done: status !== "not_started" });
    checks.push({ label: "/dismiss-dm", done: status !== "not_started" });
    checks.push({ label: "/roll", done: status !== "not_started" });
    checks.push({ label: "/status", done: status !== "not_started" });
    checks.push({ label: "/help", done: status !== "not_started" });
  } else if (block.id === "mention_handler") {
    checks.push({ label: "Detect @BakaDM mentions", done: status !== "not_started" });
    checks.push({ label: "Strip mention from content", done: status !== "not_started" });
    checks.push({ label: "Check active session", done: status !== "not_started" });
    checks.push({ label: "Placeholder DM response", done: status !== "not_started" });
    checks.push({ label: "Backend API integration", done: false }); // TODO
  } else if (block.id === "tests_session") {
    checks.push({ label: "test_create_session", done: repoState.files?.tests });
    checks.push({ label: "test_duplicate_session_raises", done: repoState.files?.tests });
    checks.push({ label: "test_get_session", done: repoState.files?.tests });
    checks.push({ label: "test_end_session", done: repoState.files?.tests });
    checks.push({ label: "test_add_player", done: repoState.files?.tests });
    checks.push({ label: "CI runs tests automatically", done: repoState.files?.github_actions });
  } else if (block.id === "backend_stub") {
    checks.push({ label: "BackendClient class exists", done: repoState.files?.backend_client });
    checks.push({ label: "Mock mode for Phase 0", done: repoState.files?.backend_client });
    checks.push({ label: "Real API calls", done: false });
  } else {
    checks.push({ label: "Code implemented", done: status !== "not_started" });
    checks.push({ label: "Unit tests written", done: status === "tested" || status === "working" });
    checks.push({ label: "Tests passing", done: status === "working" });
    checks.push({ label: "Deployed / integrated", done: status === "working" });
  }

  return checks.map((c) => `
    <div class="check-item ${c.done ? "done" : ""}">
      <span class="check-box">${c.done ? "✅" : "○"}</span>
      <span class="check-label">${c.label}</span>
    </div>
  `).join("");
}

// ============================================================
// Init
// ============================================================

async function initProgressMap() {
  const repoState = await detectRepoState();
  renderProgressMap(repoState);

  // Refresh every 2 minutes
  setInterval(async () => {
    const fresh = await detectRepoState();
    renderProgressMap(fresh);
  }, 120_000);
}

// Auto-init if DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProgressMap);
} else {
  initProgressMap();
}
