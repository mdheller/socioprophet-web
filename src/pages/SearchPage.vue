<template>
  <section class="search-page" :class="{ searched }" aria-label="SocioSearch">
    <header class="search-topbar">
      <RouterLink class="search-brand" to="/search" aria-label="SocioProphet search home">
        <span class="search-mark" aria-hidden="true"></span>
        <span>SocioProphet</span>
      </RouterLink>
      <div class="search-utility">
        <button type="button">Saved</button>
        <button type="button">History</button>
        <button type="button" class="private">Private neutral</button>
      </div>
    </header>

    <section v-if="!searched" class="landing">
      <div class="landing-inner">
        <h1>Socio<span>Search</span></h1>
        <form class="search-box" role="search" @submit.prevent="runSearch">
          <SearchIcon />
          <input
            v-model="query"
            type="search"
            aria-label="Search"
            placeholder="Search or use /sourceos/sync edge:implements"
          />
          <button type="submit">Search</button>
        </form>
        <p class="landing-help">
          Try <code>/sourceos/sync</code>, <code>edge:implements</code>, or
          <code>find path policy → code</code>. The graph appears after the first result set.
        </p>
      </div>
    </section>

    <main v-else class="search-workspace">
      <section v-if="graphVisible" class="graph-preview" aria-label="Post-search graph preview">
        <div class="graph-tools">
          <div class="graph-title">
            <strong>Graph preview</strong>
            <span>short-tail surfaces · temporal substrate · hides anytime</span>
          </div>
          <div class="graph-actions">
            <button
              v-for="edge in edgeModes"
              :key="edge.id"
              type="button"
              :class="['edge-chip', { active: activeEdge === edge.id, pink: edge.id === 'risk' }]"
              @click="activeEdge = edge.id"
            >
              {{ edge.label }}
            </button>
            <button type="button" class="primary" @click="graphExpanded = !graphExpanded">
              {{ graphExpanded ? 'Compact' : 'Expand' }}
            </button>
            <button type="button" @click="graphVisible = false">Hide</button>
          </div>
        </div>

        <svg
          class="graph-canvas"
          :class="{ expanded: graphExpanded }"
          :viewBox="graphExpanded ? '0 0 1120 390' : '0 0 1120 210'"
          role="img"
          aria-label="Compact force-directed similarity graph"
        >
          <line
            v-for="link in graphLinks"
            :key="`${link.source}-${link.target}-${link.type}`"
            :x1="nodeById[link.source].x"
            :y1="scaledY(nodeById[link.source].y)"
            :x2="nodeById[link.target].x"
            :y2="scaledY(nodeById[link.target].y)"
            :class="['graph-link', linkClass(link)]"
          />
          <g
            v-for="node in graphNodes"
            :key="node.id"
            class="graph-node"
            :transform="`translate(${node.x}, ${scaledY(node.y)})`"
          >
            <circle :r="node.r" :fill="node.color" stroke="#fff" stroke-width="3" />
            <text class="node-label" :y="node.r + 14">{{ node.label }}</text>
            <g v-if="node.count" :transform="`translate(${node.r - 3}, ${-node.r + 3})`">
              <circle r="11" class="count-pin" />
              <text class="count-text">{{ node.count }}</text>
            </g>
          </g>
        </svg>
      </section>

      <form class="search-box result-search" role="search" @submit.prevent="runSearch">
        <SearchIcon />
        <input v-model="query" type="search" aria-label="Search" />
        <details class="tune-menu">
          <summary aria-label="Open search tuning"><TuneIcon /></summary>
          <aside class="tune-drawer">
            <strong>Quick tune</strong>
            <p>Second-pass control. Use it after the first result set unless the match is obvious.</p>
            <div class="mode-grid">
              <button type="button" class="active">Balanced</button>
              <button type="button">Exact</button>
              <button type="button">Long-tail</button>
              <button type="button">High-trust</button>
            </div>
            <label>Exact ↔ semantic <input type="range" value="64" /></label>
            <label>Canonical ↔ fresh <input type="range" value="58" /></label>
            <label>Trusted ↔ novel <input type="range" value="41" /></label>
            <div class="pool-row">
              <span class="on">session</span>
              <span class="on">device</span>
              <span>org</span>
              <span>workflow cohort</span>
              <span>private neutral</span>
            </div>
          </aside>
        </details>
        <button type="submit">Search</button>
      </form>

      <div class="query-chips" aria-label="Compiled query chips">
        <span v-for="chip in queryChips" :key="chip" :class="{ pink: chip.includes('contradiction') }">
          {{ chip }}
        </span>
      </div>

      <section class="refine-strip" aria-label="SlashTopic hierarchy and compiled syntax">
        <div class="refine-left">
          <strong>SlashTopics</strong>
          <span>/sourceos</span>
          <span class="active">/sourceos/sync</span>
          <span class="active">/sourceos/sync/repair</span>
        </div>
        <code>compiled: /sourceos/sync/repair policy:governed edge:implements proof&gt;.80 · k-shot: search → refine → act</code>
      </section>

      <section class="result-layout">
        <section class="results" aria-label="Search results">
          <nav class="tabs" aria-label="Result tabs">
            <button type="button" class="active">All</button>
            <button type="button">Answer</button>
            <button type="button">Repos</button>
            <button type="button">Docs</button>
            <button type="button">Issues</button>
            <button type="button">Actions</button>
          </nav>
          <p class="result-count">
            Pass 1 of 3 · about 42 results · infinite scroll · agent second pass available after selection · demographic signals not used
          </p>

          <article v-for="result in results" :key="result.title" class="result-card">
            <div class="source-row"><span class="favicon" />{{ result.source }}</div>
            <h2>{{ result.title }}</h2>
            <p>{{ result.summary }}</p>
            <div class="badges">
              <span v-for="badge in result.badges" :key="badge" :class="{ pink: badge === 'contradiction' }">
                {{ badge }}
              </span>
            </div>
          </article>

          <div class="load-more"><span />Loading more ranked objects as you scroll</div>
        </section>

        <aside class="context-rail" aria-label="Context cards">
          <section class="side-card">
            <p class="rail-label">Knowledge card</p>
            <h2>/sourceos/sync/repair</h2>
            <p>
              Directory-style SlashTopic lens for local-first repair policy, provenance,
              graph memory, conflict handling, and auditable action receipts.
            </p>
            <div class="stats">
              <div><strong>0.81</strong><span>maturity</span></div>
              <div><strong>12</strong><span>open gaps</span></div>
              <div><strong>3</strong><span>conflicts</span></div>
              <div><strong>42</strong><span>objects</span></div>
            </div>
          </section>

          <section class="side-card">
            <p class="rail-label">Sherlock + Lampstand alignment</p>
            <ul>
              <li>Sherlock owns evidence retrieval, claim support, and contradiction references.</li>
              <li>Lampstand records query pass, refinement events, action previews, and outcome quality.</li>
              <li>Agent execution begins on pass two unless result confidence is high.</li>
            </ul>
          </section>

          <section class="side-card">
            <p class="rail-label">Second-pass refinements</p>
            <button type="button">Narrow to implementation hyperedge</button>
            <button type="button">Ask agent to explain contradictions</button>
            <button type="button">Save as /sourceos/sync/repair-policy</button>
            <button type="button">Preview governed issues</button>
          </section>
        </aside>
      </section>
    </main>

    <footer v-if="searched" class="second-pass">
      <span class="agent-dot" />
      <input
        v-model="agentPrompt"
        type="text"
        aria-label="Second-pass refinement command"
      />
      <kbd>⌘K</kbd>
      <button type="button">Refine</button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

type EdgeMode = 'all' | 'implementation' | 'memory' | 'governance' | 'risk';

type GraphNode = {
  id: string;
  label: string;
  group: 'core' | 'impl' | 'memory' | 'governance' | 'risk';
  x: number;
  y: number;
  r: number;
  color: string;
  count?: number;
};

type GraphLink = {
  source: string;
  target: string;
  type: Exclude<EdgeMode, 'all'>;
  weight: number;
};

type SearchResult = {
  source: string;
  title: string;
  summary: string;
  badges: string[];
};

const searched = ref(false);
const graphVisible = ref(true);
const graphExpanded = ref(false);
const activeEdge = ref<EdgeMode>('all');
const query = ref('/sourceos/sync/repair policy:governed edge:implements');
const agentPrompt = ref('Second pass: refine selected results, explain contradictions, or broaden the SlashTopic');

const edgeModes: { id: EdgeMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'memory', label: 'Memory' },
  { id: 'governance', label: 'Governance' },
  { id: 'risk', label: 'Conflicts' },
];

const queryChips = ['/sourceos/sync', '/repair', 'edge:implements', 'ProofRank 86', '3 contradictions'];

const graphNodes: GraphNode[] = [
  { id: 'entity', label: 'Entity Analytics', group: 'core', x: 520, y: 92, r: 25, color: '#0b1220' },
  { id: 'docs', label: 'Documentation', group: 'core', x: 610, y: 128, r: 25, color: '#0b1220' },
  { id: 'ai', label: 'AI Platform', group: 'impl', x: 360, y: 85, r: 20, color: '#7c3aed' },
  { id: 'cloud', label: 'Cloud Suite', group: 'impl', x: 300, y: 125, r: 20, color: '#7c3aed' },
  { id: 'builds', label: 'Live Builds', group: 'impl', x: 360, y: 166, r: 20, color: '#7c3aed' },
  { id: 'dev', label: 'Developer', group: 'impl', x: 505, y: 164, r: 20, color: '#7c3aed' },
  { id: 'wiki', label: 'Wiki', group: 'memory', x: 345, y: 52, r: 19, color: '#64748b', count: 7 },
  { id: 'blog', label: 'Blog', group: 'memory', x: 495, y: 38, r: 19, color: '#64748b', count: 7 },
  { id: 'academy', label: 'Academy', group: 'governance', x: 650, y: 48, r: 20, color: '#2563eb' },
  { id: 'orgs', label: 'Organizations', group: 'governance', x: 805, y: 68, r: 20, color: '#2563eb', count: 7 },
  { id: 'law', label: 'Law', group: 'risk', x: 705, y: 86, r: 19, color: '#b45309' },
  { id: 'medical', label: 'Medical', group: 'risk', x: 820, y: 116, r: 19, color: '#b45309', count: 7 },
  { id: 'trust', label: 'Digital Trust', group: 'governance', x: 750, y: 150, r: 20, color: '#0f766e' },
  { id: 'investor', label: 'Investor', group: 'governance', x: 910, y: 130, r: 19, color: '#0f766e' },
];

const graphLinks: GraphLink[] = [
  { source: 'entity', target: 'docs', type: 'implementation', weight: 0.92 },
  { source: 'entity', target: 'ai', type: 'implementation', weight: 0.84 },
  { source: 'ai', target: 'cloud', type: 'implementation', weight: 0.78 },
  { source: 'cloud', target: 'builds', type: 'implementation', weight: 0.74 },
  { source: 'builds', target: 'dev', type: 'implementation', weight: 0.71 },
  { source: 'dev', target: 'docs', type: 'implementation', weight: 0.76 },
  { source: 'entity', target: 'wiki', type: 'memory', weight: 0.7 },
  { source: 'entity', target: 'blog', type: 'memory', weight: 0.61 },
  { source: 'wiki', target: 'docs', type: 'memory', weight: 0.66 },
  { source: 'blog', target: 'docs', type: 'memory', weight: 0.62 },
  { source: 'docs', target: 'academy', type: 'governance', weight: 0.7 },
  { source: 'academy', target: 'orgs', type: 'governance', weight: 0.68 },
  { source: 'orgs', target: 'trust', type: 'governance', weight: 0.72 },
  { source: 'trust', target: 'investor', type: 'governance', weight: 0.61 },
  { source: 'docs', target: 'law', type: 'risk', weight: 0.68 },
  { source: 'law', target: 'medical', type: 'risk', weight: 0.57 },
  { source: 'law', target: 'trust', type: 'risk', weight: 0.62 },
  { source: 'medical', target: 'trust', type: 'risk', weight: 0.52 },
];

const nodeById = computed(() =>
  Object.fromEntries(graphNodes.map((node) => [node.id, node])) as Record<string, GraphNode>,
);

const results: SearchResult[] = [
  {
    source: 'SourceOS-Linux/sourceos-syncd › docs/spec/state-integrity.md',
    title: 'State Integrity Daemon: repair, provenance, schema-aware sync',
    summary:
      'Defines the sync substrate as an append-only object/event layer with actor-indexed replication, schema-aware repair, and policy-governed reconciliation.',
    badges: ['ProofRank 0.94', 'updated 2d', 'why ranked'],
  },
  {
    source: 'SocioProphet platform map › memory and agent architecture',
    title: 'Agentic memory model for search, graph, and governed actions',
    summary:
      'Splits memory into working, session, episodic, semantic, procedural, graph, archival, and audit layers. Each memory card carries source, scope, confidence, and status.',
    badges: ['memory used', 'edge: implements', 'confidence 0.88'],
  },
  {
    source: 'Drive archive › local-first-sync-notes',
    title: 'Potentially stale note: last-write-wins conflict policy',
    summary:
      'This older note conflicts with the newer repair-policy direction. The system should surface this as a contradiction rather than silently mix it into answers.',
    badges: ['contradiction', 'modified 19d', 'inspect edge'],
  },
];

function runSearch() {
  searched.value = true;
  graphVisible.value = true;
}

function scaledY(y: number) {
  return graphExpanded.value ? y * 1.85 : y;
}

function linkClass(link: GraphLink) {
  if (activeEdge.value !== 'all' && activeEdge.value !== link.type) return 'weak';
  if (link.type === 'risk') return 'pink';
  if (link.weight > 0.75) return 'strong';
  return '';
}

const SearchIcon = {
  template:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

const TuneIcon = {
  template:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h7m4 0h5M4 17h12m4 0h0M13 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM16 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  color: #0f172a;
  background:
    radial-gradient(circle at 50% -6%, rgba(37, 99, 235, 0.1), transparent 34%),
    linear-gradient(180deg, #fbfcff 0%, #f6f8fb 58%, #f3f6fb 100%);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.search-page button,
.search-page input { font: inherit; }
.search-topbar {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 70;
  background: rgba(246, 248, 251, 0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(220, 227, 238, 0.84);
}
.search-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0b1220;
  text-decoration: none;
  font-weight: 780;
  letter-spacing: -0.035em;
}
.search-mark {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: conic-gradient(from 160deg, #2563eb, #0b1220, #93c5fd, #2563eb);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
  position: relative;
}
.search-mark::after {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 999px;
  background: #fff;
  opacity: 0.92;
}
.search-utility {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-utility button {
  border: 0;
  background: transparent;
  color: #667085;
  font-weight: 650;
}
.search-utility .private {
  border: 1px solid #dbe3ee;
  background: #fff;
  color: #253246;
  border-radius: 999px;
  padding: 8px 11px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}
.landing {
  min-height: calc(100vh - 58px);
  display: grid;
  place-items: center;
  padding: 36px 18px 90px;
}
.landing-inner {
  width: min(860px, calc(100vw - 32px));
  text-align: center;
}
.landing h1 {
  margin: 0 0 28px;
  color: #0b1220;
  font-size: clamp(52px, 8vw, 86px);
  line-height: 0.95;
  letter-spacing: -0.075em;
  font-weight: 820;
}
.landing h1 span { color: #2563eb; }
.landing-help {
  margin-top: 18px;
  color: #667085;
  font-size: 13px;
}
.landing-help code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  color: #253246;
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 999px;
  padding: 5px 8px;
}
.search-box {
  border: 1px solid #dbe3ee;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08);
  min-height: 62px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 11px;
  align-items: center;
  padding: 0 10px 0 20px;
  color: #98a2b3;
}
.search-box:focus-within {
  border-color: rgba(37, 99, 235, 0.42);
  box-shadow: 0 18px 48px rgba(37, 99, 235, 0.16);
}
.search-box input {
  border: 0;
  outline: 0;
  min-width: 0;
  background: transparent;
  color: #0f172a;
  font-size: 18px;
}
.search-box > button,
.second-pass button {
  border: 0;
  border-radius: 999px;
  background: #0b1220;
  color: #fff;
  padding: 11px 18px;
  font-weight: 740;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.16);
}
.search-workspace {
  width: min(1180px, calc(100vw - 32px));
  margin: 18px auto 110px;
  display: grid;
  gap: 12px;
}
.graph-preview {
  position: relative;
  border: 1px solid #dbe3ee;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}
.graph-tools {
  position: absolute;
  inset: 10px 10px auto 10px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  pointer-events: none;
}
.graph-title,
.graph-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  pointer-events: auto;
}
.graph-title strong,
.graph-title span,
.graph-actions button {
  border: 1px solid #dbe3ee;
  background: rgba(255, 255, 255, 0.92);
  color: #253246;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 12px;
  font-weight: 720;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  white-space: nowrap;
}
.graph-title span { color: #667085; }
.graph-actions button.active {
  border-color: #bfdbfe;
  background: #eaf1ff;
  color: #1746a2;
}
.graph-actions button.pink.active {
  border-color: #fbcfe8;
  background: #fff1f8;
  color: #d9468f;
}
.graph-actions .primary {
  background: #0b1220;
  color: #fff;
  border-color: #0b1220;
}
.graph-canvas {
  width: 100%;
  height: 210px;
  display: block;
  background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
}
.graph-canvas.expanded {
  height: 390px;
}
.graph-link {
  stroke: #94a3b8;
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.82;
}
.graph-link.weak {
  stroke-width: 1.3;
  opacity: 0.3;
}
.graph-link.strong {
  stroke: #2563eb;
  stroke-width: 2.7;
  opacity: 0.95;
}
.graph-link.pink {
  stroke: #d9468f;
  stroke-width: 2.2;
  stroke-dasharray: 6 7;
  opacity: 0.88;
}
.graph-node circle {
  filter: drop-shadow(0 12px 14px rgba(15, 23, 42, 0.13));
}
.node-label {
  fill: #0f172a;
  font-size: 12px;
  font-weight: 820;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  text-anchor: middle;
  pointer-events: none;
}
.count-pin {
  fill: #fff;
  stroke: #bfdbfe;
  stroke-width: 1;
}
.count-text {
  fill: #1746a2;
  font-size: 10px;
  font-weight: 900;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  text-anchor: middle;
  dominant-baseline: middle;
}
.result-search {
  width: min(860px, calc(100vw - 32px));
  margin: 0 auto;
}
.tune-menu summary {
  list-style: none;
  width: 42px;
  height: 42px;
  border: 1px solid #dbe3ee;
  border-radius: 999px;
  background: #f8fafc;
  color: #253246;
  display: inline-grid;
  place-items: center;
}
.tune-menu summary::-webkit-details-marker { display: none; }
.tune-drawer {
  position: fixed;
  top: 58px;
  right: 0;
  bottom: 0;
  width: 340px;
  z-index: 100;
  border-left: 1px solid #dbe3ee;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.16);
  padding: 20px 18px;
  text-align: left;
}
.tune-drawer strong { display: block; color: #0f172a; font-size: 16px; }
.tune-drawer p { margin: 5px 0 16px; color: #667085; font-size: 12px; line-height: 1.4; }
.mode-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
.mode-grid button {
  border: 1px solid #e8edf5;
  background: #f8fafc;
  color: #253246;
  border-radius: 14px;
  padding: 10px;
  font-size: 12px;
  font-weight: 700;
}
.mode-grid .active {
  border-color: #bfdbfe;
  background: #eaf1ff;
  color: #1746a2;
}
.tune-drawer label {
  display: grid;
  gap: 6px;
  margin: 12px 0;
  color: #253246;
  font-size: 12px;
}
.tune-drawer input[type='range'] {
  width: 100%;
  accent-color: #2563eb;
}
.pool-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}
.pool-row span {
  border: 1px solid #e8edf5;
  background: #f8fafc;
  color: #667085;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 12px;
  line-height: 1;
}
.pool-row .on {
  border-color: #bfdbfe;
  background: #eaf1ff;
  color: #1746a2;
}
.query-chips {
  width: min(860px, calc(100vw - 32px));
  margin: 10px auto 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.query-chips span,
.badges span {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  white-space: nowrap;
  line-height: 1;
  border: 1px solid #dbe3ee;
  background: rgba(255, 255, 255, 0.74);
  color: #667085;
  padding: 6px 10px;
  font-size: 13px;
}
.query-chips span:first-child,
.query-chips span:nth-child(2),
.badges span:first-child {
  border-color: #bfdbfe;
  background: #eaf1ff;
  color: #1746a2;
}
.query-chips .pink,
.badges .pink {
  border-color: #fbcfe8;
  background: #fff1f8;
  color: #d9468f;
}
.refine-strip {
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.refine-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.refine-left strong {
  color: #667085;
  font-size: 11px;
  font-weight: 820;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.refine-left span {
  border: 1px solid #e8edf5;
  background: #f8fafc;
  color: #253246;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.refine-left .active {
  border-color: #bfdbfe;
  background: #eaf1ff;
  color: #1746a2;
}
.refine-strip code {
  color: #667085;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 410px;
}
.result-layout {
  display: grid;
  grid-template-columns: minmax(0, 760px) 340px;
  gap: 34px;
  align-items: start;
}
.tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #dbe3ee;
  margin-bottom: 16px;
  overflow-x: auto;
}
.tabs button {
  border: 0;
  background: transparent;
  color: #667085;
  padding: 0 0 12px;
  font-size: 14px;
  white-space: nowrap;
  position: relative;
}
.tabs .active {
  color: #1746a2;
  font-weight: 760;
}
.tabs .active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  border-radius: 999px 999px 0 0;
  background: #2563eb;
}
.result-count {
  color: #667085;
  font-size: 13px;
  margin: 0 0 13px;
}
.result-card {
  padding: 19px 0;
  border-bottom: 1px solid #e8edf5;
}
.source-row {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #667085;
  font-size: 13px;
  margin-bottom: 6px;
}
.favicon {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: linear-gradient(145deg, #fff, #e9eef6);
  border: 1px solid #dbe3ee;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}
.result-card h2 {
  margin: 0 0 7px;
  font-size: 20px;
  font-weight: 570;
  color: #1746a2;
  line-height: 1.25;
  letter-spacing: -0.018em;
}
.result-card p {
  margin: 0;
  color: #475467;
  font-size: 14.5px;
  line-height: 1.6;
}
.badges {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.badges span {
  padding: 4px 8px;
  font-size: 12px;
}
.load-more {
  padding: 28px 0 10px;
  color: #667085;
  text-align: center;
  font-size: 13px;
}
.load-more span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #2563eb;
  box-shadow: 0 0 0 5px #eaf1ff;
  margin-right: 8px;
}
.context-rail {
  display: grid;
  gap: 16px;
  position: sticky;
  top: 78px;
}
.side-card {
  border: 1px solid #dbe3ee;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  padding: 18px;
}
.rail-label {
  margin: 0 0 10px;
  color: #667085;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-size: 11px;
  font-weight: 820;
}
.side-card h2 {
  margin: 0 0 7px;
  font-size: 21px;
  letter-spacing: -0.04em;
  color: #0f172a;
}
.side-card p,
.side-card li {
  color: #475467;
  line-height: 1.55;
  font-size: 14px;
}
.side-card ul {
  margin: 0;
  padding-left: 1.1rem;
}
.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 14px;
}
.stats div {
  border: 1px solid #e8edf5;
  background: #f8fafc;
  border-radius: 14px;
  padding: 10px;
}
.stats strong {
  display: block;
  font-size: 19px;
  letter-spacing: -0.03em;
  color: #0f172a;
}
.stats span {
  color: #667085;
  font-size: 12px;
}
.side-card button {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #e8edf5;
  background: #f8fafc;
  color: #253246;
  border-radius: 15px;
  padding: 10px 11px;
  text-align: left;
  font-size: 13px;
}
.second-pass {
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  width: min(780px, calc(100vw - 32px));
  border: 1px solid #dbe3ee;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
  border-radius: 999px;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.16);
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 8px 9px 8px 15px;
  z-index: 60;
}
.agent-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #2563eb;
  box-shadow: 0 0 0 5px #eaf1ff;
}
.second-pass input {
  border: 0;
  outline: 0;
  background: transparent;
  min-width: 0;
  color: #253246;
  font-size: 14px;
}
.second-pass kbd {
  border: 1px solid #dbe3ee;
  background: #f8fafc;
  border-radius: 7px;
  padding: 3px 7px;
  color: #667085;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
}
@media (max-width: 1000px) {
  .result-layout { grid-template-columns: 1fr; }
  .context-rail { position: static; }
  .refine-strip {
    align-items: flex-start;
    flex-direction: column;
  }
}
@media (max-width: 680px) {
  .search-topbar { padding: 0 16px; }
  .search-utility button:not(.private) { display: none; }
  .search-workspace { width: min(100vw - 18px, 1180px); }
  .graph-tools {
    position: static;
    flex-direction: column;
    padding: 8px;
  }
  .graph-title,
  .graph-actions { flex-wrap: wrap; }
  .search-box { grid-template-columns: auto 1fr auto; }
  .search-box > button { display: none; }
  .second-pass {
    border-radius: 22px;
    grid-template-columns: auto 1fr;
  }
  .second-pass button,
  .second-pass kbd { grid-column: span 1; }
}
</style>
