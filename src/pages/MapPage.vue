<template>
  <section class="map-shell bx--grid">
    <aside class="map-rail" aria-label="Map workspace rail">
      <div class="rail-brand">SP</div>
      <button class="rail-item active" type="button" title="Map">⌖</button>
      <button class="rail-item" type="button" title="Layers">▥</button>
      <button class="rail-item" type="button" title="Evidence">◇</button>
      <button class="rail-item" type="button" title="Governance">✓</button>
      <div class="rail-spacer" />
      <button class="rail-item" type="button" title="Settings">⚙</button>
    </aside>

    <div class="map-workspace">
      <header class="map-topbar">
        <div>
          <p class="eyebrow">SocioProphet Maps</p>
          <h1>OpenStreetMap × GAIA world model</h1>
        </div>
        <div class="command-input" role="search">
          <span class="command-prefix">⌘</span>
          <input v-model="query" type="search" placeholder="Search H3, OSM id, layer, evidence, route graph…" />
        </div>
        <div class="status-stack">
          <span class="tag tag-green">fixture-backed</span>
          <span class="tag tag-blue">advisory routing</span>
        </div>
      </header>

      <div v-if="loading" class="state-card">Loading GAIA map state…</div>
      <div v-else-if="error" class="state-card error">{{ error }}</div>

      <div v-else class="map-grid">
        <aside class="panel left-panel">
          <section class="panel-section">
            <div class="section-title">Layers</div>
            <button
              v-for="layer in layers"
              :key="layer.layer_id"
              :class="['layer-card', { selected: selectedLayerId === layer.layer_id }]"
              type="button"
              @click="selectedLayerId = layer.layer_id"
            >
              <div class="layer-title">{{ layer.title }}</div>
              <div class="layer-meta">{{ layer.layer_type }} · {{ layer.tiles?.format || 'metadata' }}</div>
              <div class="layer-attribution">{{ layer.attribution?.attribution_text }}</div>
            </button>
          </section>

          <section class="panel-section">
            <div class="section-title">Spatial lookup</div>
            <label class="input-label">H3 cell</label>
            <input v-model="h3Cell" class="field" type="text" />
            <button class="primary" type="button" @click="refreshH3">Inspect H3</button>
          </section>

          <section class="panel-section">
            <div class="section-title">Runtime posture</div>
            <div class="runtime-row" v-for="runtime in runtimes" :key="runtime.name">
              <span>{{ runtime.name }}</span>
              <strong>{{ runtime.lattice_admission || runtime.status }}</strong>
            </div>
          </section>
        </aside>

        <main class="map-stage">
          <div ref="mapContainer" class="map-canvas" aria-label="GAIA map canvas"></div>
          <div class="map-overlay top-left">
            <strong>{{ selectedLayer?.title || 'GAIA OSM Demo Road Layer' }}</strong>
            <span>{{ selectedFeature?.gaia_ref?.entity_type || 'GAIA feature' }}</span>
          </div>
          <div class="map-overlay bottom-left">
            <span>OSM {{ selectedFeature?.osm_ref?.osm_type }}/{{ selectedFeature?.osm_ref?.osm_id }}</span>
            <span>{{ selectedFeature?.routing?.safety_status || routeSafetyStatus }}</span>
          </div>
        </main>

        <aside class="panel right-panel">
          <section class="panel-section">
            <div class="section-title">Feature inspector</div>
            <h2>{{ selectedFeature?.gaia_ref?.entity_id || 'No feature selected' }}</h2>
            <div class="detail-grid">
              <span>Source</span><strong>{{ selectedFeature?.source || '—' }}</strong>
              <span>OSM ref</span><strong>{{ selectedFeature?.osm_ref?.osm_type }}/{{ selectedFeature?.osm_ref?.osm_id }}</strong>
              <span>GAIA type</span><strong>{{ selectedFeature?.gaia_ref?.entity_type || '—' }}</strong>
              <span>Safety</span><strong>{{ selectedFeature?.routing?.safety_status || routeSafetyStatus }}</strong>
            </div>
            <div class="tag-row">
              <span v-for="cell in featureH3Cells" :key="cell" class="tag">{{ cell }}</span>
            </div>
          </section>

          <section class="panel-section">
            <div class="section-title">Evidence</div>
            <h2>{{ sherlockResult?.title || 'Sherlock evidence' }}</h2>
            <p>{{ sherlockResult?.snippet || 'No evidence loaded.' }}</p>
            <ul class="evidence-list">
              <li v-for="ref in evidenceRefs" :key="ref">{{ ref }}</li>
            </ul>
          </section>

          <section class="panel-section">
            <div class="section-title">Governance</div>
            <div class="detail-grid">
              <span>Attribution</span><strong>{{ governance?.attribution_required ? 'required' : 'not required' }}</strong>
              <span>Lanes</span><strong>{{ governance?.validation_lanes?.length || 0 }}</strong>
              <span>Receipt</span><strong>{{ selectedReceipt?.integrity?.digest ? 'digest' : 'unsigned' }}</strong>
            </div>
            <ul class="evidence-list">
              <li v-for="lane in governance?.validation_lanes || []" :key="lane.id">{{ lane.id }} · {{ lane.state || 'unknown' }}</li>
            </ul>
          </section>
        </aside>
      </div>

      <footer class="agent-drawer">
        <button class="drawer-tab" type="button" @click="drawerOpen = !drawerOpen">
          Prophet Shell
          <span>{{ drawerOpen ? 'close' : 'open' }}</span>
        </button>
        <div v-if="drawerOpen" class="drawer-body">
          <div class="drawer-command">/map inspect osm way 424242 · /map explain safety · /map open evidence</div>
          <div class="drawer-note">Agent shell placeholder. CloudFog shell integration should mount here, not inside the map canvas.</div>
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { fetchFeaturesByH3, fetchGaiaMapSnapshot } from '../api/gaiaMap';
import type { GaiaMapSnapshot, H3FeatureLayerSearch, MapLayer, ResponseReceipt } from '../types/gaiaMap';

const loading = ref(true);
const error = ref<string | null>(null);
const snapshot = ref<GaiaMapSnapshot | null>(null);
const h3Result = ref<H3FeatureLayerSearch | null>(null);
const selectedLayerId = ref<string | null>(null);
const h3Cell = ref('8928308280fffff');
const query = ref('');
const drawerOpen = ref(true);
const mapContainer = ref<HTMLElement | null>(null);
let map: maplibregl.Map | null = null;
let marker: maplibregl.Marker | null = null;

const layers = computed(() => snapshot.value?.layers.layers || []);
const selectedLayer = computed<MapLayer | undefined>(() => layers.value.find((layer) => layer.layer_id === selectedLayerId.value) || layers.value[0]);
const selectedFeature = computed(() => snapshot.value?.feature || h3Result.value?.features?.[0] || null);
const governance = computed(() => snapshot.value?.governance || null);
const sherlockResult = computed(() => snapshot.value?.search || null);
const runtimes = computed(() => snapshot.value?.routes.route_graphs || []);
const routeSafetyStatus = computed(() => snapshot.value?.routes.default_safety_status || 'advisory');
const selectedReceipt = computed<ResponseReceipt | undefined>(() => selectedFeature.value?.response_receipt || selectedLayer.value?.response_receipt);
const featureH3Cells = computed(() => selectedFeature.value?.spatial?.h3_cells || []);
const evidenceRefs = computed(() => sherlockResult.value?.evidence_refs || selectedFeature.value?.provenance?.source_refs || []);

function featureCenter(): [number, number] {
  const bbox = selectedFeature.value?.spatial?.bbox;
  if (Array.isArray(bbox) && bbox.length >= 4) {
    return [(Number(bbox[0]) + Number(bbox[2])) / 2, (Number(bbox[1]) + Number(bbox[3])) / 2];
  }
  return [-74.006, 40.7128];
}

function initializeMap() {
  if (!mapContainer.value || map) return;
  const center = featureCenter();
  map = new maplibregl.Map({
    container: mapContainer.value,
    center,
    zoom: 13,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{ id: 'osm-base', type: 'raster', source: 'osm' }],
    },
  });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  marker = new maplibregl.Marker({ color: '#0f62fe' })
    .setLngLat(center)
    .setPopup(new maplibregl.Popup({ offset: 16 }).setText(`OSM ${selectedFeature.value?.osm_ref?.osm_type || 'way'} ${selectedFeature.value?.osm_ref?.osm_id || '424242'}`))
    .addTo(map);
}

function updateMapMarker() {
  if (!map || !marker) return;
  const center = featureCenter();
  marker.setLngLat(center);
  map.easeTo({ center, zoom: 13, duration: 600 });
}

async function refreshH3() {
  h3Result.value = await fetchFeaturesByH3(h3Cell.value);
  updateMapMarker();
}

onMounted(async () => {
  try {
    snapshot.value = await fetchGaiaMapSnapshot();
    h3Result.value = snapshot.value.h3;
    selectedLayerId.value = snapshot.value.layers.layers[0]?.layer_id || null;
    await nextTick();
    initializeMap();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  marker?.remove();
  map?.remove();
  marker = null;
  map = null;
});
</script>

<style scoped>
.map-shell {
  min-height: calc(100vh - 64px);
  margin: -16px;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  background: #0f1117;
  color: #f4f4f4;
}
.map-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-right: 1px solid #262b36;
  background: #090b10;
}
.rail-brand {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.35rem;
  display: grid;
  place-items: center;
  background: #0f62fe;
  font-weight: 700;
}
.rail-item {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #393f4a;
  border-radius: 0.25rem;
  background: #161b22;
  color: #f4f4f4;
}
.rail-item.active { border-color: #0f62fe; color: #78a9ff; }
.rail-spacer { flex: 1; }
.map-workspace { min-width: 0; display: flex; flex-direction: column; }
.map-topbar {
  min-height: 5.5rem;
  display: grid;
  grid-template-columns: minmax(18rem, 1fr) minmax(22rem, 44rem) auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #262b36;
  background: #161b22;
}
.eyebrow { margin: 0 0 0.25rem; color: #78a9ff; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
h1 { margin: 0; font-size: 1.35rem; }
.command-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #393f4a;
  background: #0f1117;
  padding: 0.65rem 0.85rem;
}
.command-input input { flex: 1; border: 0; outline: none; background: transparent; color: #f4f4f4; }
.command-prefix { color: #78a9ff; }
.status-stack { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end; }
.map-grid {
  min-height: calc(100vh - 12rem);
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 360px;
  gap: 1px;
  background: #262b36;
}
.panel { background: #161b22; overflow: auto; }
.panel-section { padding: 1rem; border-bottom: 1px solid #262b36; }
.section-title { margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #c6c6c6; }
.layer-card { display: block; width: 100%; margin-bottom: 0.5rem; padding: 0.8rem; text-align: left; border: 1px solid #393f4a; border-radius: 0; background: #0f1117; color: #f4f4f4; }
.layer-card.selected { border-color: #0f62fe; box-shadow: inset 3px 0 0 #0f62fe; }
.layer-title { font-weight: 700; }
.layer-meta, .layer-attribution, .input-label { margin-top: 0.25rem; color: #c6c6c6; font-size: 0.8rem; }
.field { width: 100%; margin: 0.35rem 0 0.65rem; border: 1px solid #393f4a; background: #0f1117; color: #f4f4f4; }
.primary { width: 100%; background: #0f62fe; border-color: #0f62fe; }
.runtime-row, .detail-grid { display: grid; grid-template-columns: 1fr auto; gap: 0.5rem 0.75rem; color: #c6c6c6; }
.runtime-row strong, .detail-grid strong { color: #f4f4f4; text-align: right; }
.map-stage { position: relative; min-height: 100%; background: #0f1117; }
.map-canvas { position: absolute; inset: 0; min-height: 36rem; }
.map-overlay { position: absolute; z-index: 2; display: grid; gap: 0.2rem; padding: 0.75rem; border: 1px solid #393f4a; background: rgba(15, 17, 23, 0.88); backdrop-filter: blur(8px); }
.map-overlay.top-left { top: 1rem; left: 1rem; }
.map-overlay.bottom-left { bottom: 1rem; left: 1rem; }
.right-panel h2 { margin: 0 0 0.5rem; font-size: 1rem; }
.right-panel p { color: #c6c6c6; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
.tag { display: inline-flex; align-items: center; min-height: 1.5rem; padding: 0.15rem 0.5rem; border: 1px solid #393f4a; background: #262b36; color: #f4f4f4; font-size: 0.75rem; }
.tag-green { border-color: #24a148; color: #42be65; }
.tag-blue { border-color: #0f62fe; color: #78a9ff; }
.evidence-list { margin: 0.75rem 0 0; padding-left: 1rem; color: #c6c6c6; font-size: 0.85rem; }
.agent-drawer { border-top: 1px solid #262b36; background: #090b10; }
.drawer-tab { width: 100%; display: flex; justify-content: space-between; border: 0; border-radius: 0; background: #161b22; color: #f4f4f4; padding: 0.65rem 1rem; }
.drawer-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 0.75rem 1rem; color: #c6c6c6; }
.drawer-command { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #78a9ff; }
.state-card { margin: 1rem; padding: 1rem; background: #161b22; border: 1px solid #393f4a; }
.state-card.error { border-color: #fa4d56; color: #ffb3b8; }
@media (max-width: 1100px) {
  .map-topbar { grid-template-columns: 1fr; }
  .map-grid { grid-template-columns: 1fr; }
  .map-stage { min-height: 36rem; }
  .map-canvas { position: relative; height: 36rem; }
}
</style>
