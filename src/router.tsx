import { Navigate, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import App from './App';
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

const routeTree = rootRoute.addChildren([indexRoute, classifRoute, translateRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
