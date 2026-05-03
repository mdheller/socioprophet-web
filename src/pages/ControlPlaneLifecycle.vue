<template>
  <section class="cp-page" aria-labelledby="cp-title">
    <header class="cp-hero">
      <div>
        <p class="cp-kicker">SourceOS Control Plane · Lifecycle MVP</p>
        <h1 id="cp-title">ReleaseSet and BootReleaseSet assignment</h1>
        <p class="cp-lede">
          Read-only control-plane view for the SourceOS boot/recovery lifecycle: profile
          selection, ReleaseSet creation, BootReleaseSet assignment, enrollment token issuance,
          lifecycle state, evidence, compliance, and rollback posture.
        </p>
      </div>
      <div class="cp-scorecard" aria-label="Control plane demo readiness">
        <span class="cp-score">47%</span>
        <span class="cp-score-label">demo readiness</span>
      </div>
    </header>

    <section class="cp-grid cp-grid--metrics" aria-label="Lifecycle lane completion">
      <article v-for="metric in metrics" :key="metric.name" class="cp-card cp-metric">
        <div class="cp-metric-head">
          <span>{{ metric.name }}</span>
          <strong>{{ metric.value }}%</strong>
        </div>
        <div class="cp-bar" aria-hidden="true">
          <span :style="{ width: `${metric.value}%` }" />
        </div>
        <p>{{ metric.note }}</p>
      </article>
    </section>

    <section class="cp-grid cp-grid--two">
      <article class="cp-card">
        <div class="cp-section-head">
          <div>
            <h2>Selected profile</h2>
            <p>Control-plane input bundle for an M2 recovery proof target.</p>
          </div>
          <span class="cp-pill cp-pill--active">read-only</span>
        </div>
        <dl class="cp-kv">
          <div v-for="item in selectedProfile" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </article>

      <article class="cp-card">
        <div class="cp-section-head">
          <div>
            <h2>Assignment posture</h2>
            <p>Device/token bindings required before a boot plan may be issued.</p>
          </div>
          <span class="cp-pill cp-pill--warn">gated</span>
        </div>
        <ul class="cp-check-list">
          <li v-for="check in assignmentChecks" :key="check.name" :class="`cp-check cp-check--${check.status}`">
            <span class="cp-dot" aria-hidden="true" />
            <div>
              <strong>{{ check.name }}</strong>
              <p>{{ check.detail }}</p>
            </div>
          </li>
        </ul>
      </article>
    </section>

    <section class="cp-card">
      <div class="cp-section-head">
        <div>
          <h2>Lifecycle state machine</h2>
          <p>Every transition should emit a LifecycleStateRecord or a refusal record.</p>
        </div>
        <span class="cp-pill">{{ lifecycle.length }} states</span>
      </div>
      <ol class="cp-timeline">
        <li v-for="state in lifecycle" :key="state.name" :class="`cp-state cp-state--${state.status}`">
          <div class="cp-state-index">{{ state.index }}</div>
          <div class="cp-state-body">
            <div class="cp-state-head">
              <strong>{{ state.name }}</strong>
              <span :class="`cp-status cp-status--${state.status}`">{{ state.status }}</span>
            </div>
            <p>{{ state.detail }}</p>
            <code>{{ state.evidence }}</code>
          </div>
        </li>
      </ol>
    </section>

    <section class="cp-grid cp-grid--two">
      <article class="cp-card">
        <h2>ReleaseSet</h2>
        <p class="cp-desc">
          Signed SourceOS lifecycle release binding system target, user-space closure,
          agent-space closure, policy, BOM, rollback, and evidence requirements.
        </p>
        <div class="cp-table-wrap">
          <table class="cp-table">
            <tbody>
              <tr v-for="row in releaseSetRows" :key="row.field">
                <th>{{ row.field }}</th>
                <td>{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="cp-card">
        <h2>BootReleaseSet</h2>
        <p class="cp-desc">
          Bootable recovery object that binds ReleaseSet to signed manifest, artifacts,
          platform adapters, authorization, offline fallback, signing, and proof requirements.
        </p>
        <div class="cp-table-wrap">
          <table class="cp-table">
            <tbody>
              <tr v-for="row in bootReleaseSetRows" :key="row.field">
                <th>{{ row.field }}</th>
                <td>{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <section class="cp-card">
      <div class="cp-section-head">
        <div>
          <h2>Evidence gates</h2>
          <p>Control-plane acceptance requires every proof lane to be present or refused.</p>
        </div>
        <span class="cp-pill cp-pill--active">evidence-forward</span>
      </div>
      <div class="cp-table-wrap">
        <table class="cp-table cp-table--wide">
          <thead>
            <tr>
              <th>Gate</th>
              <th>Required evidence</th>
              <th>Current state</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="gate in evidenceGates" :key="gate.gate">
              <td>{{ gate.gate }}</td>
              <td>{{ gate.evidence }}</td>
              <td><span :class="`cp-status cp-status--${gate.status}`">{{ gate.status }}</span></td>
              <td>{{ gate.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="cp-grid cp-grid--two">
      <article class="cp-card">
        <h2>Blocked until reviewed implementation</h2>
        <ul class="cp-list">
          <li v-for="item in blocked" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article class="cp-card">
        <h2>Next implementation moves</h2>
        <ul class="cp-list">
          <li v-for="item in nextMoves" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>

    <section class="cp-card cp-callout">
      <h2>Control-plane rule</h2>
      <p>
        This page is a product/control-plane view over lifecycle contracts. It does not issue
        enrollment tokens, mutate host boot entries, reboot devices, write disks, or contact real
        hardware. Those actions remain gated behind NLBoot platform adapters, policy approval,
        explicit acknowledgements, and evidence output.
      </p>
    </section>
  </section>
</template>

<script setup lang="ts">
type Metric = { name: string; value: number; note: string };
type KV = { label: string; value: string };
type Row = { field: string; value: string };
type Check = { name: string; detail: string; status: 'complete' | 'active' | 'blocked' | 'pending' };
type State = { index: string; name: string; status: 'complete' | 'active' | 'blocked' | 'pending'; detail: string; evidence: string };
type Gate = { gate: string; evidence: string; status: 'complete' | 'active' | 'blocked' | 'pending'; owner: string };

const metrics: Metric[] = [
  { name: 'ReleaseSet contract', value: 100, note: 'Schema, example, and validator merged in NLBoot.' },
  { name: 'BootReleaseSet contract', value: 100, note: 'M2 recovery example and lifecycle proof requirements merged.' },
  { name: 'NLBoot dry-run proof', value: 100, note: 'Python and Rust usable-MVP fixture lanes are green.' },
  { name: 'M2 real mutation', value: 0, note: 'Still intentionally blocked until reviewed platform adapter.' },
  { name: 'Control-plane workflow', value: 35, note: 'Static product view exists; backend assignment API not wired.' },
  { name: 'End-to-end demo', value: 47, note: 'Architecture and proof lanes exist; live assignment loop remains.' },
];

const selectedProfile: KV[] = [
  { label: 'Device class', value: 'Apple Silicon M2 laptop' },
  { label: 'Target mode', value: 'SourceOS Recovery / Installer' },
  { label: 'ReleaseSet', value: 'urn:srcos:release-set:m2-demo-2026-04-26' },
  { label: 'BootReleaseSet', value: 'urn:srcos:boot-release-set:m2-demo-recovery-2026-04-26' },
  { label: 'Policy bundle', value: 'urn:srcos:policy-bundle:m2-demo-standard' },
  { label: 'Adapter', value: 'apple-silicon-m2 · dry-run-only' },
];

const assignmentChecks: Check[] = [
  { name: 'One-time enrollment token', detail: 'Required before BootPlan assignment.', status: 'active' },
  { name: 'Device claim', detail: 'Device must bind to assignment before recovery action.', status: 'active' },
  { name: 'Signed manifest', detail: 'RSA-PSS/SHA-256 verification is already proven by NLBoot.', status: 'complete' },
  { name: 'Last-known-good fallback', detail: 'Required; unsigned fallback is forbidden.', status: 'complete' },
  { name: 'Real Apple boot mutation', detail: 'Blocked until platform-specific implementation is reviewed.', status: 'blocked' },
];

const lifecycle: State[] = [
  { index: '01', name: 'DraftProfile', status: 'complete', detail: 'Target device, experience, agent profile, and boot mode selected.', evidence: 'profile selection record' },
  { index: '02', name: 'ResolvedBOM', status: 'complete', detail: 'BOM/SBOM and closure refs resolved for system/user/agent planes.', evidence: 'ReleaseSet.bom' },
  { index: '03', name: 'Built', status: 'complete', detail: 'ReleaseSet target and artifacts are build-addressable.', evidence: 'build receipt / artifact refs' },
  { index: '04', name: 'Signed', status: 'complete', detail: 'ReleaseSet and manifest signing refs present.', evidence: 'LifecycleStateRecord(sign)' },
  { index: '05', name: 'Assigned', status: 'active', detail: 'Control plane must bind BootReleaseSet to device/user/workspace.', evidence: 'assignment record + enrollment token' },
  { index: '06', name: 'Planned', status: 'complete', detail: 'NLBoot BootPlan emitted only after manifest and token validation.', evidence: 'BootPlan' },
  { index: '07', name: 'Fetched', status: 'complete', detail: 'Artifacts fetched/cache-written with SHA-256 verification.', evidence: 'ArtifactCacheRecord' },
  { index: '08', name: 'Loaded', status: 'complete', detail: 'Linux kexec load-only dry-run proof is green.', evidence: 'pre-exec-proof.json' },
  { index: '09', name: 'Executed', status: 'blocked', detail: 'Real execution/reboot requires explicit host-mutation and reboot acknowledgements.', evidence: 'exec-proof.json / refusal record' },
  { index: '10', name: 'Attested', status: 'pending', detail: 'Post-action fingerprint not yet wired to website control plane.', evidence: 'post-action fingerprint' },
  { index: '11', name: 'Compliant', status: 'pending', detail: 'Compliance decision view not yet backed by live evidence ingestion.', evidence: 'compliance state record' },
  { index: '12', name: 'RollbackAvailable', status: 'active', detail: 'Rollback posture is specified through last-known-good cache.', evidence: 'rollback record' },
];

const releaseSetRows: Row[] = [
  { field: 'releaseSetId', value: 'urn:srcos:release-set:m2-demo-2026-04-26' },
  { field: 'systemPlane', value: 'ostree-silverblue' },
  { field: 'updateModel', value: 'ostree-rebase' },
  { field: 'userSpace', value: 'macos-like-gnome profile + Nix closure' },
  { field: 'agentSpace', value: 'default-devtools profile · container isolation' },
  { field: 'policy', value: 'approval required · guardrail refs present' },
  { field: 'rollback', value: 'last-known-good required · rollback allowed' },
];

const bootReleaseSetRows: Row[] = [
  { field: 'bootReleaseSetId', value: 'urn:srcos:boot-release-set:m2-demo-recovery-2026-04-26' },
  { field: 'bootMode', value: 'recovery' },
  { field: 'channels', value: 'recovery · rollback · rescue' },
  { field: 'artifacts', value: 'kernel · initrd · rootfs · artifact map' },
  { field: 'authorization', value: 'one-time token + device claim required' },
  { field: 'platformAdapters', value: 'apple-silicon-m2 dry-run · linux-kexec load-only' },
  { field: 'offlineFallback', value: 'unsigned fallback denied · last-known-good required' },
];

const evidenceGates: Gate[] = [
  { gate: 'Release signing', evidence: 'LifecycleStateRecord(sign)', status: 'complete', owner: 'NLBoot / control plane' },
  { gate: 'Manifest verification', evidence: 'BootPlan', status: 'complete', owner: 'nlboot-client' },
  { gate: 'Artifact verification', evidence: 'ArtifactCacheRecord', status: 'complete', owner: 'nlboot-client' },
  { gate: 'Adapter dry-run', evidence: 'AdapterPlanRecord + BootEntryRecord', status: 'complete', owner: 'nlboot-client' },
  { gate: 'Device assignment', evidence: 'assignment record', status: 'active', owner: 'website control plane' },
  { gate: 'Real boot mutation', evidence: 'host mutation proof + reboot ack', status: 'blocked', owner: 'platform adapter' },
  { gate: 'Post-action compliance', evidence: 'fingerprint + compliance decision', status: 'pending', owner: 'control plane + policy fabric' },
];

const blocked = [
  'Real Apple Silicon boot-entry changes.',
  'Installer disk writes.',
  'Rollback execution.',
  'Persistent enrollment-secret storage.',
  'Host repair actions.',
  'Website-backed token issuance and device assignment.',
];

const nextMoves = [
  'Create control-plane fixture data package from NLBoot examples.',
  'Add device assignment and enrollment token mock APIs.',
  'Render lifecycle records from fixture JSON instead of static arrays.',
  'Add compliance/rollback dashboard backed by AgentPlane/NLBoot evidence refs.',
  'Wire website action buttons as disabled policy-gated affordances.',
];
</script>

<style scoped>
.cp-page { display: flex; flex-direction: column; gap: 1rem; color: var(--text, #f4f4f4); }
.cp-hero, .cp-card { border: 1px solid rgba(255,255,255,.14); border-radius: 18px; background: rgba(20,24,31,.82); box-shadow: 0 18px 48px rgba(0,0,0,.22); }
.cp-hero { display: flex; justify-content: space-between; gap: 2rem; padding: 1.5rem; }
.cp-kicker { margin: 0 0 .4rem; color: var(--accent, #78a9ff); font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1, h2, p { margin-top: 0; }
h1 { margin-bottom: .7rem; font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1; }
h2 { margin-bottom: .65rem; font-size: 1.15rem; }
.cp-lede, .cp-desc, .cp-card p, .cp-check p, .cp-state p, .cp-callout p { color: rgba(255,255,255,.70); line-height: 1.55; }
.cp-lede { max-width: 780px; margin-bottom: 0; }
.cp-scorecard { min-width: 180px; align-self: stretch; display: grid; place-content: center; border-radius: 16px; background: linear-gradient(145deg, rgba(120,169,255,.22), rgba(36,161,72,.18)); text-align: center; }
.cp-score { display: block; font-size: 3.2rem; font-weight: 800; }
.cp-score-label { color: rgba(255,255,255,.72); font-size: .82rem; text-transform: uppercase; letter-spacing: .08em; }
.cp-grid { display: grid; gap: 1rem; }
.cp-grid--metrics { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.cp-grid--two { grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); }
.cp-card { padding: 1rem; }
.cp-metric-head, .cp-section-head, .cp-state-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.cp-metric strong { font-size: 1.35rem; }
.cp-bar { height: .55rem; margin: .75rem 0; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.12); }
.cp-bar span { display: block; height: 100%; border-radius: inherit; background: var(--accent, #78a9ff); }
.cp-pill, .cp-status { display: inline-flex; align-items: center; border-radius: 999px; padding: .18rem .55rem; font-size: .72rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
.cp-pill { background: rgba(120,169,255,.15); color: var(--accent, #78a9ff); }
.cp-pill--active, .cp-status--complete { background: rgba(36,161,72,.18); color: #42be65; }
.cp-pill--warn, .cp-status--active { background: rgba(241,194,27,.18); color: #f1c21b; }
.cp-status--blocked { background: rgba(250,77,86,.18); color: #fa4d56; }
.cp-status--pending { background: rgba(255,255,255,.12); color: rgba(255,255,255,.72); }
.cp-kv { display: grid; gap: .65rem; margin: 0; }
.cp-kv div { display: grid; gap: .2rem; padding-bottom: .55rem; border-bottom: 1px solid rgba(255,255,255,.09); }
.cp-kv dt { color: rgba(255,255,255,.58); font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; }
.cp-kv dd { margin: 0; font-weight: 650; }
.cp-check-list, .cp-list { padding-left: 0; list-style: none; }
.cp-check { display: flex; gap: .75rem; margin-bottom: .8rem; }
.cp-check p { margin: .2rem 0 0; }
.cp-dot { flex: 0 0 .75rem; width: .75rem; height: .75rem; margin-top: .35rem; border-radius: 50%; background: rgba(255,255,255,.4); }
.cp-check--complete .cp-dot { background: #42be65; }
.cp-check--active .cp-dot { background: #f1c21b; }
.cp-check--blocked .cp-dot { background: #fa4d56; }
.cp-timeline { display: grid; gap: .75rem; padding-left: 0; list-style: none; }
.cp-state { display: grid; grid-template-columns: 3.2rem 1fr; gap: .8rem; }
.cp-state-index { display: grid; place-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid rgba(255,255,255,.18); color: rgba(255,255,255,.74); font-weight: 800; }
.cp-state-body { padding: .85rem; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; background: rgba(255,255,255,.04); }
.cp-state-body p { margin: .4rem 0; }
.cp-state code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .78rem; color: rgba(255,255,255,.72); }
.cp-table-wrap { overflow-x: auto; }
.cp-table { width: 100%; border-collapse: collapse; }
.cp-table th, .cp-table td { padding: .65rem .5rem; border-bottom: 1px solid rgba(255,255,255,.1); text-align: left; vertical-align: top; }
.cp-table th { color: rgba(255,255,255,.6); font-size: .76rem; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.cp-table--wide th { white-space: normal; }
.cp-list li { margin-bottom: .55rem; color: rgba(255,255,255,.72); }
.cp-callout p { margin-bottom: 0; }
@media (max-width: 760px) { .cp-hero { flex-direction: column; } .cp-scorecard { min-height: 140px; } .cp-state { grid-template-columns: 1fr; } }
</style>
