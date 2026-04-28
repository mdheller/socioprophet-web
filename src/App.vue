<template>
  <div class="sp-shell">
    <header class="sp-topbar">
      <RouterLink class="sp-brand" to="/dashboard">SocioProphet</RouterLink>
      <nav class="sp-domain-nav" aria-label="Primary domains">
        <RouterLink to="/dashboard">News &amp; Events</RouterLink>
        <RouterLink to="/policies">Law &amp; Regulation</RouterLink>
        <RouterLink to="/entities">People &amp; Society</RouterLink>
        <RouterLink to="/datasets">Economy &amp; Industry</RouterLink>
        <RouterLink to="/map">Maps</RouterLink>
        <RouterLink to="/runs">Capital &amp; Markets</RouterLink>
      </nav>
      <div class="sp-profile-indicator" aria-hidden="true" />
    </header>

    <nav class="sp-tabbar" aria-label="Workspace tabs">
      <button class="sp-tab-menu" type="button" aria-label="Open navigation">☷</button>
      <RouterLink to="/dashboard">News &amp; Events</RouterLink>
      <RouterLink to="/map">Maps / OSM</RouterLink>
      <RouterLink to="/entities">Entities</RouterLink>
      <RouterLink to="/graph">Graph</RouterLink>
      <RouterLink to="/builder">Builder</RouterLink>
      <RouterLink to="/console">Console</RouterLink>
      <RouterLink to="/settings">Settings</RouterLink>
    </nav>

    <div class="sp-workspace">
      <aside class="sp-left-rail" aria-label="Workspace rail">
        <RouterLink to="/dashboard" title="Dashboard">☷</RouterLink>
        <RouterLink to="/reader" title="Reader">▤</RouterLink>
        <RouterLink to="/map" title="Maps">⌖</RouterLink>
        <RouterLink to="/entities" title="Entities">◫</RouterLink>
        <RouterLink to="/datasets" title="Datasets">◔</RouterLink>
        <RouterLink to="/experiments" title="Experiments">⌁</RouterLink>
        <RouterLink to="/runs" title="Runs">▥</RouterLink>
        <RouterLink to="/gates" title="Gates">◉</RouterLink>
        <RouterLink to="/settings" title="Settings">⚙</RouterLink>
      </aside>

      <section class="sp-stage">
        <div class="sp-breadcrumbs">
          <span v-for="(crumb, index) in breadcrumbs" :key="crumb">
            <span>{{ crumb }}</span>
            <span v-if="index < breadcrumbs.length - 1" class="sp-crumb-separator">/</span>
          </span>
        </div>
        <RouterView />
      </section>
    </div>

    <footer class="sp-agent-shell">
      <div class="sp-agent-search">
        <span>⌕</span>
        <input type="search" placeholder="Search or command…" />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  if (route.path.startsWith('/map')) return ['Maps', 'OpenStreetMap', 'GAIA world model'];
  if (route.path.startsWith('/entities')) return ['People & Society', 'Entities'];
  if (route.path.startsWith('/datasets')) return ['Economy & Industry', 'Datasets'];
  if (route.path.startsWith('/policies')) return ['Law & Regulation', 'Policies'];
  if (route.path.startsWith('/console')) return ['Platform', 'Console'];
  return ['News & Events', 'Workspace'];
});
</script>
