import NotFound from './pages/NotFound.vue';
import "./styles.css";

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import Dashboard from "./pages/Dashboard.vue";
import Builder from "./pages/Builder.vue";
import Entities from "./pages/Entities.vue";
import Layouts from "./pages/Layouts.vue";
import SpecManager from "./pages/SpecManager.vue";
import Terminal from "./pages/Terminal.vue";
import Settings from "./pages/Settings.vue";
import Research from "./pages/Research.vue";
import Reader from "./pages/Reader.vue";
import CodeSearch from "./pages/CodeSearch.vue";
import Stories from "./pages/Stories.vue";
import Journal from "./pages/Journal.vue";
import Experiments from "./pages/Experiments.vue";
import Runs from "./pages/Runs.vue";
import Policies from "./pages/Policies.vue";
import Datasets from "./pages/Datasets.vue";
import Gates from "./pages/Gates.vue";
import Attestations from "./pages/Attestations.vue";
import Credentials from "./pages/Credentials.vue";
import Filters from "./pages/Filters.vue";
import Compliance from "./pages/Compliance.vue";
import PorterConsole from "./pages/PorterConsole.vue";
import UiKit from "./pages/UiKit.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },

  { path: "/dashboard", component: Dashboard },
  { path: "/builder", component: Builder },
  { path: "/entities", component: Entities },
  { path: "/layouts", component: Layouts },
  { path: "/specs", component: SpecManager },
  { path: "/terminal", component: Terminal },
  { path: "/settings", component: Settings },

  { path: "/research", component: Research },
  { path: "/reader", component: Reader },
  { path: "/code", component: CodeSearch },
  { path: "/stories", component: Stories },
  { path: "/journal", component: Journal },
  { path: "/experiments", component: Experiments },
  { path: "/runs", component: Runs },

  { path: "/policies", component: Policies },
  { path: "/datasets", component: Datasets },
  { path: "/gates", component: Gates },
  { path: "/attestations", component: Attestations },
  { path: "/credentials", component: Credentials },
  { path: "/filters", component: Filters },
  { path: "/compliance", component: Compliance },

  { path: "/console", component: PorterConsole },
  { path: "/uikit", component: UiKit },

  // keep this LAST so it doesn't swallow valid routes
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const base = (import.meta as any).env?.VITE_ROUTER_BASE || "/";

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

createApp(App).use(router).mount("#app");
