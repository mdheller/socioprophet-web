<template>
  <section class="pi-page" aria-labelledby="pi-title">
    <header class="pi-hero">
      <div>
        <p class="pi-kicker">Professional Intelligence OS</p>
        <h1 id="pi-title">SocioProphet operating dashboard</h1>
        <p class="pi-lede">
          Closed-loop control surface for the Professional Intelligence OS alignment wave:
          contracts, playbooks, workrooms, policy, obligations, topology, evidence, adoption,
          and demo readiness.
        </p>
      </div>
      <div class="pi-scorecard" aria-label="Overall completion">
        <span class="pi-score">40%</span>
        <span class="pi-score-label">overall alignment</span>
      </div>
    </header>

    <section class="pi-grid pi-grid--metrics" aria-label="Workstream completion">
      <article v-for="metric in metrics" :key="metric.name" class="pi-card pi-metric">
        <div class="pi-metric-head">
          <span>{{ metric.name }}</span>
          <strong>{{ metric.value }}%</strong>
        </div>
        <div class="pi-bar" aria-hidden="true">
          <span :style="{ width: `${metric.value}%` }" />
        </div>
        <p>{{ metric.note }}</p>
      </article>
    </section>

    <section class="pi-grid pi-grid--two">
      <article class="pi-card">
        <h2>Gate status</h2>
        <ol class="pi-gates">
          <li v-for="gate in gates" :key="gate.name" :class="`pi-gate pi-gate--${gate.status}`">
            <span class="pi-gate-status">{{ gate.status }}</span>
            <div>
              <strong>{{ gate.name }}</strong>
              <p>{{ gate.summary }}</p>
            </div>
          </li>
        </ol>
      </article>

      <article class="pi-card">
        <h2>Cybernetic controls</h2>
        <div class="pi-control-list">
          <div v-for="control in controls" :key="control.name" class="pi-control">
            <strong>{{ control.name }}</strong>
            <p><b>Sense:</b> {{ control.signal }}</p>
            <p><b>Act:</b> {{ control.action }}</p>
          </div>
        </div>
      </article>
    </section>

    <section class="pi-card">
      <div class="pi-section-head">
        <div>
          <h2>Active PR wave</h2>
          <p>Reviewable work currently anchoring the alignment wave.</p>
        </div>
        <span class="pi-pill">9 tracked PRs</span>
      </div>
      <div class="pi-table-wrap">
        <table class="pi-table">
          <thead>
            <tr>
              <th>Repo</th>
              <th>PR</th>
              <th>Capability</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in prs" :key="`${item.repo}-${item.pr}`">
              <td>{{ item.repo }}</td>
              <td>{{ item.pr }}</td>
              <td>{{ item.capability }}</td>
              <td><span :class="`pi-status pi-status--${item.status}`">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="pi-grid pi-grid--two">
      <article class="pi-card">
        <h2>Completed controls</h2>
        <ul class="pi-list">
          <li v-for="item in completed" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article class="pi-card">
        <h2>Next control moves</h2>
        <ul class="pi-list">
          <li v-for="item in nextMoves" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>

    <section class="pi-card pi-callout">
      <h2>Integration rule</h2>
      <p>
        A subsystem is not integrated because it is referenced. It is integrated only when it has a
        contract or manifest entry, a runtime/workflow/validation touchpoint, a governance owner,
        evidence output or evidence reference, feedback into DelEx controls, and corrective action
        when telemetry or validation shows drift.
      </p>
    </section>
  </section>
</template>

<script setup lang="ts">
type Metric = {
  name: string;
  value: number;
  note: string;
};

type Gate = {
  name: string;
  status: 'complete' | 'active' | 'pending';
  summary: string;
};

type Control = {
  name: string;
  signal: string;
  action: string;
};

type PullRequest = {
  repo: string;
  pr: string;
  capability: string;
  status: 'merged' | 'open';
};

const metrics: Metric[] = [
  { name: 'Architecture spine', value: 40, note: 'Platform manifest and topology are established.' },
  { name: 'DelEx governance', value: 45, note: 'Delivery model and control register are live.' },
  { name: 'Platform contracts', value: 45, note: 'Core contracts and fixtures are validated.' },
  { name: 'Playbooks', value: 35, note: 'Seed playbooks now have validation.' },
  { name: 'Workrooms', value: 25, note: 'Workspace contract and fixture are merged.' },
  { name: 'Governance loops', value: 45, note: 'Policy, obligation, and topology loops are forming.' },
  { name: 'Cybernetic controls', value: 32, note: 'Sense/compare/act gates are being codified.' },
  { name: 'Demo readiness', value: 30, note: 'Still not runnable end-to-end.' },
];

const gates: Gate[] = [
  {
    name: 'Gate 1 — alignment docs and seed contracts',
    status: 'complete',
    summary: 'Platform, DelEx automation, playbooks, workspace, policy, obligations, and topology are seeded.',
  },
  {
    name: 'Gate 2 — validation fixtures',
    status: 'active',
    summary: 'Platform, DelEx automation, playbooks, workrooms, policy decisions, and obligations now validate; remaining validation work is search/query/execution.',
  },
  {
    name: 'Gate 3 — runnable demo slice',
    status: 'pending',
    summary: 'Requires Agentplane workflow bundle, context pack, search/query packet, model routing, and guardrail pack.',
  },
  {
    name: 'Gate 4 — integrated demo',
    status: 'pending',
    summary: 'Requires playbook-loaded → context-resolved → policy-checked → agent-step → workroom-updated → evidence/adoption emitted.',
  },
];

const controls: Control[] = [
  { name: 'Repo readiness', signal: 'Missing docs, schema, validation, CI, owner, or integration map.', action: 'Open or block work order until green.' },
  { name: 'Demo readiness', signal: 'Missing playbook, context, policy, evidence, workroom, or adoption event.', action: 'Block demo credit and create corrective issue.' },
  { name: 'Policy coverage', signal: 'Governed step lacks policy decision.', action: 'Block runtime/demo credit.' },
  { name: 'Evidence coverage', signal: 'Workflow step lacks evidence reference.', action: 'Fail demo acceptance.' },
  { name: 'Agent authority', signal: 'Agent lacks tool grant, scope, or revocation behavior.', action: 'Block agent execution.' },
];

const prs: PullRequest[] = [
  { repo: 'SocioProphet/prophet-platform', pr: '#263', capability: 'Platform contracts', status: 'merged' },
  { repo: 'SocioProphet/delivery-excellence', pr: '#5', capability: 'Control register', status: 'merged' },
  { repo: 'SocioProphet/delivery-excellence-automation', pr: '#4', capability: 'Automation schemas', status: 'merged' },
  { repo: 'SocioProphet/delivery-excellence-innersource', pr: '#5', capability: 'Playbooks', status: 'merged' },
  { repo: 'SocioProphet/prophet-workspace', pr: '#7', capability: 'Workrooms', status: 'merged' },
  { repo: 'SocioProphet/policy-fabric', pr: '#33', capability: 'Policy decisions', status: 'merged' },
  { repo: 'SocioProphet/contractforge', pr: '#3', capability: 'Obligation ledger', status: 'merged' },
  { repo: 'SocioProphet/sociosphere', pr: '#221', capability: 'Topology', status: 'merged' },
  { repo: 'SocioProphet/socioprophet', pr: '#300', capability: 'Dashboard definition', status: 'merged' },
];

const completed = [
  'Professional Intelligence platform manifest and seed contracts.',
  'DelEx work item, repo readiness, and demo acceptance automation schemas.',
  'Validated InnerSource playbooks.',
  'Validated Professional Workroom fixture.',
  'Professional Policy Decision schema with allow/review/deny examples.',
  'ContractForge obligation schema and examples.',
  'Sociosphere topology registration.',
];

const nextMoves = [
  'Implement Agentplane workflow bundle and evidence mapping.',
  'Add Agent Registry tool grants for workflow agents.',
  'Add Memory Mesh scoped context pack support.',
  'Add Sherlock search packet and Prophet Core Query context contract.',
  'Add Model Router and Guardrail Fabric examples.',
  'Replace static dashboard data with DelEx register and platform manifest ingestion.',
];
</script>

<style scoped>
.pi-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text, #f4f4f4);
}

.pi-hero,
.pi-card {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  background: rgba(20, 24, 31, 0.82);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
}

.pi-hero {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem;
}

.pi-kicker {
  margin: 0 0 0.4rem;
  color: var(--accent, #78a9ff);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0.7rem;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
}

h2 {
  margin-bottom: 0.85rem;
  font-size: 1.15rem;
}

.pi-lede {
  max-width: 760px;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.55;
}

.pi-scorecard {
  min-width: 180px;
  align-self: stretch;
  display: grid;
  place-content: center;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(120, 169, 255, 0.22), rgba(36, 161, 72, 0.18));
  text-align: center;
}

.pi-score {
  display: block;
  font-size: 3.2rem;
  font-weight: 800;
}

.pi-score-label {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.pi-grid {
  display: grid;
  gap: 1rem;
}

.pi-grid--metrics {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.pi-grid--two {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.pi-card {
  padding: 1rem;
}

.pi-metric-head,
.pi-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pi-metric strong {
  font-size: 1.35rem;
}

.pi-metric p,
.pi-control p,
.pi-section-head p,
.pi-callout p,
.pi-gate p {
  color: rgba(255, 255, 255, 0.68);
}

.pi-bar {
  height: 0.55rem;
  margin: 0.75rem 0;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.pi-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent, #78a9ff);
}

.pi-gates,
.pi-list {
  padding-left: 1.2rem;
}

.pi-gate {
  margin-bottom: 0.9rem;
}

.pi-gate-status,
.pi-status,
.pi-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.18rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pi-gate-status,
.pi-pill {
  margin-bottom: 0.35rem;
  background: rgba(120, 169, 255, 0.15);
  color: var(--accent, #78a9ff);
}

.pi-gate--complete .pi-gate-status,
.pi-status--merged {
  background: rgba(36, 161, 72, 0.18);
  color: #42be65;
}

.pi-gate--active .pi-gate-status,
.pi-status--open {
  background: rgba(241, 194, 27, 0.18);
  color: #f1c21b;
}

.pi-gate--pending .pi-gate-status {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
}

.pi-control {
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pi-control:last-child {
  border-bottom: 0;
}

.pi-table-wrap {
  overflow-x: auto;
}

.pi-table {
  width: 100%;
  border-collapse: collapse;
}

.pi-table th,
.pi-table td {
  padding: 0.7rem 0.55rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.pi-table th {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 760px) {
  .pi-hero {
    flex-direction: column;
  }

  .pi-scorecard {
    min-height: 150px;
  }
}
</style>
