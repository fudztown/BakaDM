// ============================================================
// BakaDM Dashboard — GitHub-linked project status dashboard
// ============================================================

const { repo, githubToken, environments, services, poll } = CONFIG;
const API_BASE = "https://api.github.com";

const headers = {};
if (githubToken) headers["Authorization"] = `token ${githubToken}`;

/* ===== Helpers ===== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmtDate = (iso) => new Date(iso).toLocaleString();
const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

/* ===== GitHub API ===== */
async function gh(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchIssues(state = "open", perPage = 50) {
  const issues = await gh(`/repos/${repo.owner}/${repo.repo}/issues?state=${state}&per_page=${perPage}`);
  return issues.filter((i) => !i.pull_request);
}

async function fetchWorkflowRuns(perPage = 20) {
  const data = await gh(`/repos/${repo.owner}/${repo.repo}/actions/runs?per_page=${perPage}`);
  return data.workflow_runs || [];
}

/* ===== Rendering ===== */
function renderIssueRow(issue, compact = false) {
  const labels = issue.labels.map((l) => {
    let cls = "label";
    const name = l.name.toLowerCase();
    if (name.includes("bug")) cls += " label-bug";
    else if (name.includes("enhancement") || name.includes("feature")) cls += " label-enhancement";
    else if (name.includes("help")) cls += " label-help";
    return `<span class="${cls}">${l.name}</span>`;
  }).join("");

  return `
    <div class="list-item">
      <div class="list-item-left">
        <span class="issue-number">#${issue.number}</span>
        <span class="issue-title" title="${issue.title.replace(/"/g, "&quot;")}">
          <a href="${issue.html_url}" target="_blank">${issue.title}</a>
        </span>
      </div>
      <div class="list-item-right">
        ${compact ? "" : `<div class="labels">${labels}</div>`}
        <span style="font-size:11px;color:var(--text-muted)">${timeAgo(issue.created_at)}</span>
      </div>
    </div>`;
}

function renderCIRun(run) {
  const conclusion = run.conclusion || run.status;
  let statusCls = "status-pending";
  if (conclusion === "success") statusCls = "status-success";
  else if (conclusion === "failure" || conclusion === "timed_out") statusCls = "status-failure";
  else if (conclusion === "cancelled" || conclusion === "skipped") statusCls = "status-cancelled";

  return `
    <div class="list-item">
      <div class="list-item-left">
        <span class="issue-title">
          <a href="${run.html_url}" target="_blank">${run.name}</a>
        </span>
        <span style="font-size:11px;color:var(--text-muted)">${run.head_branch || "—"}</span>
      </div>
      <div class="list-item-right">
        <span class="status-badge ${statusCls}">${conclusion}</span>
        <span style="font-size:11px;color:var(--text-muted)">${timeAgo(run.created_at)}</span>
      </div>
    </div>`;
}

/* ===== Sections ===== */
async function loadOverview(openIssues, closedIssues, runs) {
  const bugs = openIssues.filter((i) => i.labels.some((l) => l.name.toLowerCase().includes("bug")));
  $("#statOpenBugs").textContent = bugs.length;
  $("#statOpenIssues").textContent = openIssues.length;
  $("#statClosedIssues").textContent = closedIssues.length;

  const lastRun = runs[0];
  $("#statLastCI").textContent = lastRun ? (lastRun.conclusion || lastRun.status) : "None";
  $("#statLastCI").className = `stat-value ${lastRun?.conclusion === "success" ? "" : lastRun?.conclusion === "failure" ? "text-danger" : ""}`;

  $("#recentIssuesList").innerHTML = openIssues.slice(0, 5).map((i) => renderIssueRow(i, true)).join("") || "<p style='color:var(--text-muted);font-size:13px'>No open issues 🎉</p>";
  $("#recentCIList").innerHTML = runs.slice(0, 5).map((r) => renderCIRun(r)).join("") || "<p style='color:var(--text-muted);font-size:13px'>No CI runs yet</p>";
}

async function loadIssues(openIssues) {
  const container = $("#issuesList");
  const render = (filter) => {
    let list = openIssues;
    if (filter !== "all") {
      list = openIssues.filter((i) => i.labels.some((l) => l.name.toLowerCase().includes(filter)));
    }
    container.innerHTML = list.map((i) => renderIssueRow(i)).join("") || "<p style='color:var(--text-muted);font-size:13px'>No issues match this filter</p>";
  };

  render("all");

  $$("#issues .filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#issues .filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.filter);
    });
  });
}

async function loadCI(runs) {
  $("#ciList").innerHTML = runs.map((r) => renderCIRun(r)).join("") || "<p style='color:var(--text-muted);font-size:13px'>No CI runs yet</p>";
}

/* ===== Environments & Services ===== */
function renderEnvironments() {
  const grid = $("#envGrid");
  grid.innerHTML = environments.map((env) => {
    const hasUrl = !!env.url;
    const hasHealth = !!env.healthUrl;
    return `
      <div class="env-card ${hasUrl ? "" : "placeholder"}">
        <div class="env-header">
          <span class="env-name">${env.name}</span>
          <span class="env-status unknown" id="env-status-${slug(env.name)}">TBD</span>
        </div>
        <p class="env-desc">${env.desc}</p>
        <div class="env-links">
          ${hasUrl ? `<a href="${env.url}" target="_blank">Open →</a>` : '<span class="link-placeholder">URL to be defined</span>'}
        </div>
      </div>`;
  }).join("");
}

function renderServices() {
  const grid = $("#serviceGrid");
  grid.innerHTML = services.map((svc) => {
    const hasHealth = !!svc.healthUrl;
    return `
      <div class="service-card ${hasHealth ? "" : "placeholder"}">
        <div class="service-header">
          <span class="service-name">${svc.name}</span>
          <span class="service-status unknown" id="svc-status-${slug(svc.name)}">TBD</span>
        </div>
        <p class="service-desc">${svc.desc}</p>
        ${hasHealth ? `<a href="${svc.healthUrl}" target="_blank" style="font-size:12px;color:var(--accent)">Health endpoint →</a>` : '<span class="link-placeholder">Endpoint to be defined</span>'}
      </div>`;
  }).join("");
}

async function checkHealth() {
  for (const env of environments) {
    if (!env.healthUrl) continue;
    const el = $(`#env-status-${slug(env.name)}`);
    if (!el) continue;
    try {
      const res = await fetch(env.healthUrl, { mode: "no-cors", cache: "no-store" });
      // no-cors hides status, so we can only know it didn't throw immediately
      el.textContent = "UP";
      el.className = "env-status up";
    } catch {
      el.textContent = "DOWN";
      el.className = "env-status down";
    }
  }
  for (const svc of services) {
    if (!svc.healthUrl) continue;
    const el = $(`#svc-status-${slug(svc.name)}`);
    if (!el) continue;
    try {
      await fetch(svc.healthUrl, { mode: "no-cors", cache: "no-store" });
      el.textContent = "UP";
      el.className = "service-status up";
    } catch {
      el.textContent = "DOWN";
      el.className = "service-status down";
    }
  }
}

function slug(str) {
  return str.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}

/* ===== Navigation ===== */
function initNav() {
  const navItems = $$(".nav-item");
  const sections = $$(".section");
  const pageTitle = $("#pageTitle");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const id = item.dataset.section;
      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
      sections.forEach((s) => s.classList.toggle("active", s.id === id));
      pageTitle.textContent = item.textContent.trim();
      history.replaceState(null, "", `#${id}`);
    });
  });

  // Deep-link on load
  const hash = location.hash.slice(1);
  if (hash) {
    const target = $(`.nav-item[data-section="${hash}"]`);
    if (target) target.click();
  }

  // Inline "View all" links
  $$('[data-nav]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = $(`.nav-item[data-section="${link.dataset.nav}"]`);
      if (target) target.click();
    });
  });
}

/* ===== Main ===== */
let openIssues = [];
let closedIssues = [];
let workflowRuns = [];

async function refresh() {
  $("#refreshBtn").textContent = "🔄 Refreshing...";
  try {
    const [open, closed, runs] = await Promise.all([
      fetchIssues("open", 50),
      fetchIssues("closed", 1).catch(() => []),
      fetchWorkflowRuns(20).catch(() => []),
    ]);
    openIssues = open;
    closedIssues = closed;
    workflowRuns = runs;

    await loadOverview(openIssues, closedIssues, workflowRuns);
    await loadIssues(openIssues);
    await loadCI(workflowRuns);
    await checkHealth();

    $("#lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    console.error(err);
    $("#lastUpdated").textContent = `Error: ${err.message}`;
  } finally {
    $("#refreshBtn").textContent = "🔄 Refresh";
  }
}

function init() {
  initNav();
  renderEnvironments();
  renderServices();
  refresh();

  $("#refreshBtn").addEventListener("click", refresh);
  setInterval(refresh, poll.github);
  setInterval(checkHealth, poll.health);
}

init();
