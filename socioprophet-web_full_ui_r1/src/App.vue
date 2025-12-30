<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">SocioProphet</div>

      <nav class="toplinks">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/builder">Builder</RouterLink>
        <RouterLink to="/entities">Entities</RouterLink>
        <RouterLink to="/terminal">Terminal</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
      </nav>
    </header>

    <div class="body">
      <aside class="sidebar">
        <div class="section">Workspace</div>
        <RouterLink v-for="i in workspace" :key="i.to" class="item" :to="i.to">{{ i.label }}</RouterLink>

        <div class="section">Governance</div>
        <RouterLink v-for="i in governance" :key="i.to" class="item" :to="i.to">{{ i.label }}</RouterLink>

        <div class="section">Platform</div>
        <RouterLink v-for="i in platform" :key="i.to" class="item" :to="i.to">{{ i.label }}</RouterLink>
      </aside>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

type NavItem = { label: string; to: string };

const workspace: NavItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Builder", to: "/builder" },
  { label: "Entities", to: "/entities" },
  { label: "Layouts", to: "/layouts" },
  { label: "Reader", to: "/reader" },
  { label: "Code Search", to: "/code" },
];

const governance: NavItem[] = [
  { label: "Policies", to: "/policies" },
  { label: "Datasets", to: "/datasets" },
  { label: "Gates", to: "/gates" },
  { label: "Attestations", to: "/attestations" },
  { label: "Credentials", to: "/credentials" },
  { label: "Compliance", to: "/compliance" },
];

const platform: NavItem[] = [
  { label: "Terminal", to: "/terminal" },
  { label: "Console", to: "/console" },
  { label: "Specs", to: "/specs" },
  { label: "Runs", to: "/runs" },
  { label: "Experiments", to: "/experiments" },
  { label: "Settings", to: "/settings" },
];
</script>

<style scoped>
.app { min-height: 100vh; }
.topbar {
  position: sticky; top: 0; z-index: 10;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  display: flex; gap: 16px; align-items: center;
  backdrop-filter: blur(10px);
}
.brand { font-weight: 800; letter-spacing: 0.2px; }
.toplinks { display: flex; gap: 12px; flex-wrap: wrap; }
.toplinks a.router-link-active { font-weight: 800; text-decoration: underline; }

.body { display: grid; grid-template-columns: 260px 1fr; min-height: calc(100vh - 52px); }
.sidebar {
  border-right: 1px solid rgba(255,255,255,0.10);
  padding: 14px 12px;
}
.section { margin: 14px 8px 8px; font-size: 12px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.08em; }
.item { display: block; padding: 8px 10px; border-radius: 10px; text-decoration: none; }
.item.router-link-active { font-weight: 800; text-decoration: underline; }
.content { padding: 16px 18px; }
@media (max-width: 900px) {
  .body { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.10); }
}
</style>
