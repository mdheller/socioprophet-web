import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { domainSurfaces } from './config/domainRoutes';
import Attestations from './pages/Attestations.vue';
import Builder from './pages/Builder.vue';
import CodeSearch from './pages/CodeSearch.vue';
import Compliance from './pages/Compliance.vue';
import ControlPlaneLifecycle from './pages/ControlPlaneLifecycle.vue';
import Credentials from './pages/Credentials.vue';
import Dashboard from './pages/Dashboard.vue';
import Datasets from './pages/Datasets.vue';
import DomainSurfacePage from './pages/DomainSurfacePage.vue';
import Entities from './pages/Entities.vue';
import Experiments from './pages/Experiments.vue';
import Filters from './pages/Filters.vue';
import Gates from './pages/Gates.vue';
import Journal from './pages/Journal.vue';
import Layouts from './pages/Layouts.vue';
import MapPage from './pages/MapPage.vue';
import NLBootEvidence from './pages/NLBootEvidence.vue';
import Policies from './pages/Policies.vue';
import PorterConsole from './pages/PorterConsole.vue';
import ProfessionalIntelligence from './pages/ProfessionalIntelligence.vue';
import Reader from './pages/Reader.vue';
import Research from './pages/Research.vue';
import Runs from './pages/Runs.vue';
import Settings from './pages/Settings.vue';
import SpecManager from './pages/SpecManager.vue';
import Stories from './pages/Stories.vue';
import Terminal from './pages/Terminal.vue';
import UiKit from './pages/UiKit.vue';
import './styles.css';

const mockedSurfaceRoutes = domainSurfaces
  .filter((surface) => surface.route !== '/map')
  .map((surface) => ({ path: surface.route, component: DomainSurfacePage }));

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/professional-intelligence', component: ProfessionalIntelligence },
  { path: '/control-plane', component: ControlPlaneLifecycle },
  { path: '/nlboot', component: NLBootEvidence },
  { path: '/map', component: MapPage },
  ...mockedSurfaceRoutes,
  { path: '/builder', component: Builder },
  { path: '/entities', component: Entities },
  { path: '/layouts', component: Layouts },
  { path: '/specs', component: SpecManager },
  { path: '/terminal', component: Terminal },
  { path: '/settings', component: Settings },
  { path: '/research', component: Research },
  { path: '/reader', component: Reader },
  { path: '/code', component: CodeSearch },
  { path: '/stories', component: Stories },
  { path: '/journal', component: Journal },
  { path: '/experiments', component: Experiments },
  { path: '/runs', component: Runs },
  { path: '/policies', component: Policies },
  { path: '/datasets', component: Datasets },
  { path: '/gates', component: Gates },
  { path: '/attestations', component: Attestations },
  { path: '/credentials', component: Credentials },
  { path: '/filters', component: Filters },
  { path: '/compliance', component: Compliance },
  { path: '/console', component: PorterConsole },
  { path: '/uikit', component: UiKit },
];

const router = createRouter({
  history: createWebHistory((import.meta as any).env.VITE_ROUTER_BASE || '/'),
  routes,
});

createApp(App).use(router).mount('#app');
