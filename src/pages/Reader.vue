<template>
  <main class="feed-intelligence-page">
    <section class="feed-hero">
      <div>
        <p class="eyebrow">Feed Intelligence</p>
        <h1>Reader as replayable knowledge refinery</h1>
        <p class="feed-hero-copy">
          Ticker first, feed subscription second, membrane and memory after admission. RSS, Atom,
          JSON Feed, and ActivityPub stay derived views over canonical events.
        </p>
      </div>
      <div class="feed-hero-actions" aria-label="Feed intelligence controls">
        <button type="button">Subscribe feed</button>
        <button type="button" class="secondary">⌘K search</button>
      </div>
    </section>

    <section class="ticker-card" aria-label="Ticker proof of life">
      <span class="ticker-label">Ticker</span>
      <div class="ticker-track">
        <button
          v-for="item in state.items"
          :key="item.id"
          type="button"
          :class="['ticker-item', { active: item.id === selectedItem.id }]"
          @click="selectedItemId = item.id"
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.topicScope }} · {{ item.membraneDecision }}</span>
        </button>
      </div>
    </section>

    <section class="feed-grid">
      <aside class="feed-panel source-panel" aria-label="Feed sources">
        <div class="panel-heading">
          <span>Sources</span>
          <strong>{{ state.sources.length }}</strong>
        </div>
        <button
          v-for="source in state.sources"
          :key="source.id"
          type="button"
          :class="['source-card', { active: source.id === selectedSource?.id }]"
          @click="selectedSourceId = source.id"
        >
          <span class="source-title">{{ source.title }}</span>
          <span class="source-meta">{{ source.format }} · {{ source.scope }}</span>
          <span class="source-policy">{{ formatPolicy(source.storagePolicy) }}</span>
        </button>
      </aside>

      <section class="feed-panel item-panel" aria-label="Normalized feed items">
        <div class="panel-heading">
          <span>Stream</span>
          <strong>{{ filteredItems.length }} items</strong>
        </div>
        <button
          v-for="item in filteredItems"
          :key="item.id"
          type="button"
          :class="['item-card', { active: item.id === selectedItem.id }]"
          @click="selectedItemId = item.id"
        >
          <span :class="['decision-pill', item.membraneDecision]">{{ item.membraneDecision }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.summary }}</p>
          <div class="item-meta">
            <span>{{ item.topicScope }}</span>
            <span>{{ item.provenanceHash }}</span>
          </div>
        </button>
      </section>

      <article class="feed-panel detail-panel" aria-label="Selected item detail">
        <div class="panel-heading">
          <span>Canonical item</span>
          <strong>{{ selectedItem.eventRefs.length }} events</strong>
        </div>
        <h2>{{ selectedItem.title }}</h2>
        <p>{{ selectedItem.summary }}</p>

        <dl class="detail-list">
          <div>
            <dt>Canonical URL</dt>
            <dd>{{ selectedItem.canonicalUrl }}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>{{ selectedItem.publishedAt }}</dd>
          </div>
          <div>
            <dt>Normalized</dt>
            <dd>{{ selectedItem.normalizedAt }}</dd>
          </div>
          <div>
            <dt>Storage</dt>
            <dd>{{ formatPolicy(selectedItem.storagePolicy) }}</dd>
          </div>
        </dl>

        <section class="chip-section">
          <h3>Entities</h3>
          <span v-for="entity in selectedItem.entities" :key="entity" class="chip">{{ entity }}</span>
        </section>

        <section class="chip-section">
          <h3>Claims</h3>
          <span v-for="claim in selectedItem.claims" :key="claim" class="chip strong">{{ claim }}</span>
        </section>
      </article>

      <aside class="feed-panel memex-panel" aria-label="Memex side panel">
        <div class="panel-heading">
          <span>Memex panel</span>
          <strong>right rail</strong>
        </div>

        <section class="memex-block">
          <h3>SlashTopics scope</h3>
          <p>{{ selectedItem.topicScope }}</p>
          <small>Public query and governance scope. Feed lanes and saved searches resolve here first.</small>
        </section>

        <section class="memex-block">
          <h3>New Hope membrane</h3>
          <p :class="['decision-pill', selectedItem.membraneDecision]">{{ selectedItem.membraneDecision }}</p>
          <small>Admission controls publication, memory writeback, and graph expansion.</small>
        </section>

        <section class="memex-block">
          <h3>MemoryMesh posture</h3>
          <p>{{ formatPolicy(selectedItem.storagePolicy) }}</p>
          <small>Recall and writeback remain scoped, reviewable, and storage-policy aware.</small>
        </section>

        <section class="memex-block">
          <h3>MeshRush graph</h3>
          <p>source → item → claim → entity → topic</p>
          <small>Graph traversal is prepared as evidence structure, not as ungoverned publication.</small>
        </section>
      </aside>
    </section>

    <section class="event-strip" aria-label="Canonical event chain">
      <div
        v-for="event in state.events"
        :key="event.id"
        :class="['event-step', event.status]"
      >
        <span>{{ event.type }}</span>
        <strong>{{ event.label }}</strong>
        <small>{{ event.evidenceRef }}</small>
      </div>
    </section>

    <section class="integration-grid" aria-label="Stack integration surfaces">
      <article v-for="surface in state.integrations" :key="surface.name" class="integration-card">
        <div class="integration-heading">
          <h3>{{ surface.name }}</h3>
          <span :class="['surface-status', surface.status]">{{ surface.status }}</span>
        </div>
        <p>{{ surface.role }}</p>
        <small>{{ surface.contract }}</small>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { feedIntelligenceState as state } from '../features/feed-intelligence/state';
import type { StoragePolicy } from '../features/feed-intelligence/types';

const selectedSourceId = ref(state.sources[0]?.id ?? '');
const selectedItemId = ref(state.items[0]?.id ?? '');

const selectedSource = computed(() => state.sources.find((source) => source.id === selectedSourceId.value));

const filteredItems = computed(() => {
  if (!selectedSource.value) return state.items;
  const scoped = state.items.filter((item) => item.sourceId === selectedSource.value?.id);
  return scoped.length > 0 ? scoped : state.items;
});

const selectedItem = computed(() => {
  return state.items.find((item) => item.id === selectedItemId.value) ?? state.items[0];
});

function formatPolicy(policy: StoragePolicy): string {
  return policy.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}
</script>

<style scoped>
.feed-intelligence-page {
  min-height: 100%;
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
  background: #f7f7f5;
  color: #161616;
}

.feed-hero,
.ticker-card,
.feed-panel,
.event-strip,
.integration-card {
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.feed-hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
}

.feed-hero h1 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  letter-spacing: -0.04em;
}

.feed-hero-copy {
  max-width: 58rem;
  margin: 0.5rem 0 0;
  color: #525252;
}

.feed-hero-actions {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.feed-hero-actions button {
  border: 1px solid #0f62fe;
  background: #0f62fe;
  color: #ffffff;
  padding: 0.65rem 0.9rem;
  cursor: pointer;
  white-space: nowrap;
}

.feed-hero-actions .secondary {
  background: #ffffff;
  color: #0f62fe;
}

.ticker-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: stretch;
  min-height: 4.25rem;
  overflow: hidden;
}

.ticker-label {
  display: grid;
  place-items: center;
  padding: 0 1rem;
  background: #161616;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ticker-track {
  display: flex;
  overflow-x: auto;
}

.ticker-item {
  min-width: 24rem;
  border: 0;
  border-right: 1px solid #e0e0e0;
  background: #ffffff;
  color: #161616;
  display: grid;
  gap: 0.25rem;
  padding: 0.65rem 1rem;
  text-align: left;
  cursor: pointer;
}

.ticker-item.active {
  box-shadow: inset 0 -3px 0 #0f62fe;
}

.ticker-item span {
  color: #6f6f6f;
  font-size: 0.8rem;
}

.feed-grid {
  min-height: 42rem;
  display: grid;
  grid-template-columns: 280px 340px minmax(0, 1fr) 320px;
  gap: 1rem;
}

.feed-panel {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.panel-heading {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  color: #525252;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.source-card,
.item-card {
  width: 100%;
  display: grid;
  gap: 0.45rem;
  padding: 1rem;
  border: 0;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  color: #161616;
  text-align: left;
  cursor: pointer;
}

.source-card.active,
.item-card.active {
  box-shadow: inset 4px 0 0 #0f62fe;
  background: #edf5ff;
}

.source-title,
.item-card h2 {
  margin: 0;
  font-weight: 700;
}

.source-meta,
.source-policy,
.item-meta,
.memex-block small,
.event-step small,
.integration-card small {
  color: #6f6f6f;
  font-size: 0.78rem;
}

.item-card h2 {
  font-size: 1rem;
}

.item-card p {
  margin: 0;
  color: #525252;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.detail-panel {
  padding-bottom: 1rem;
}

.detail-panel > h2,
.detail-panel > p,
.detail-list,
.chip-section {
  margin-left: 1rem;
  margin-right: 1rem;
}

.detail-panel h2 {
  font-size: 1.55rem;
  letter-spacing: -0.03em;
}

.detail-panel p {
  color: #525252;
}

.detail-list {
  display: grid;
  gap: 0.5rem;
}

.detail-list div {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f4f4f4;
}

.detail-list dt {
  color: #6f6f6f;
}

.detail-list dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.chip-section h3,
.memex-block h3 {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #525252;
}

.chip {
  display: inline-flex;
  margin: 0 0.4rem 0.4rem 0;
  padding: 0.25rem 0.5rem;
  border: 1px solid #c6c6c6;
  background: #f4f4f4;
  font-size: 0.78rem;
}

.chip.strong {
  border-color: #0f62fe;
  color: #0043ce;
  background: #edf5ff;
}

.memex-panel {
  display: grid;
  align-content: start;
}

.memex-block {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.memex-block p {
  margin: 0 0 0.35rem;
}

.decision-pill {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border: 1px solid #c6c6c6;
  background: #f4f4f4;
  color: #161616;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.decision-pill.admit { border-color: #24a148; background: #defbe6; color: #0e6027; }
.decision-pill.hold { border-color: #f1c21b; background: #fcf4d6; color: #684e00; }
.decision-pill.quarantine { border-color: #ff832b; background: #fff2e8; color: #8a3800; }
.decision-pill.reject { border-color: #fa4d56; background: #fff1f1; color: #a2191f; }

.event-strip {
  display: flex;
  overflow-x: auto;
}

.event-step {
  min-width: 18rem;
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
}

.event-step span {
  color: #525252;
  font-size: 0.75rem;
  font-weight: 700;
}

.event-step.complete { box-shadow: inset 0 3px 0 #24a148; }
.event-step.active { box-shadow: inset 0 3px 0 #0f62fe; }
.event-step.blocked { box-shadow: inset 0 3px 0 #8d8d8d; }

.integration-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;
}

.integration-card {
  padding: 1rem;
}

.integration-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.integration-heading h3 {
  margin: 0;
}

.integration-card p {
  color: #525252;
}

.surface-status {
  padding: 0.15rem 0.45rem;
  border: 1px solid #c6c6c6;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.surface-status.wired { border-color: #24a148; color: #0e6027; background: #defbe6; }
.surface-status.specified { border-color: #0f62fe; color: #0043ce; background: #edf5ff; }
.surface-status.pending { border-color: #8d8d8d; color: #525252; background: #f4f4f4; }

@media (max-width: 1320px) {
  .feed-grid,
  .integration-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .feed-hero,
  .feed-grid,
  .integration-grid,
  .ticker-card {
    grid-template-columns: 1fr;
    display: grid;
  }

  .feed-hero-actions,
  .item-meta {
    flex-direction: column;
  }
}
</style>
