import {
  Navigate,
  createRootRoute,
  createRoute,
  createRouter,
  createHashHistory,
} from '@tanstack/react-router';
import App from './App';
import GiftSimulation from './features/gifts/GiftSimulation';
import AiNav from './components/AiNav';
import { AIDemo } from './features/ai';
import TranslateHome from './translate-ai/home/Home';

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <Navigate to="/" />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AiNav,
});

const classifRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classif-ai',
  component: AIDemo,
});

const translateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/translate-ai',
  component: TranslateHome,
});

const giftsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gift-simulation',
  component: GiftSimulation,
});

const routeTree = rootRoute.addChildren([indexRoute, classifRoute, translateRoute, giftsRoute]);

export const router = createRouter({
  routeTree,
  history: import.meta.env.PROD ? createHashHistory() : undefined,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
