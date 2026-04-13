import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';

const Home = lazy(() => import('./pages/Home'));
const TryFreeAnalysis = lazy(() => import('./pages/TryFreeAnalysis'));
const WhiteLabelHardware = lazy(() => import('./pages/WhiteLabelHardware'));
const ApiServices = lazy(() => import('./pages/ApiServices'));
const SaasPlatform = lazy(() => import('./pages/SaasPlatform'));
const Implementation = lazy(() => import('./pages/Implementation'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Shop = lazy(() => import('./pages/Shop'));
const Checkout = lazy(() => import('./pages/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProductLushairOne = lazy(() => import('./pages/ProductLushairOne'));
const ProductLushairPro = lazy(() => import('./pages/ProductLushairPro'));
const ProductLushairStudio = lazy(() => import('./pages/ProductLushairStudio'));
const AppIntro = lazy(() => import('./pages/AppIntro'));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'app', Component: AppIntro },
      { path: 'try-free', Component: TryFreeAnalysis },
      { path: 'shop', Component: Shop },
      { path: 'checkout', Component: Checkout },
      { path: 'hardware', Component: WhiteLabelHardware },
      { path: 'api', Component: ApiServices },
      { path: 'saas', Component: SaasPlatform },
      { path: 'implementation', Component: Implementation },
      { path: 'dashboard', Component: Dashboard },
      { path: 'products/one', Component: ProductLushairOne },
      { path: 'products/pro', Component: ProductLushairPro },
      { path: 'products/studio', Component: ProductLushairStudio },
      { path: '*', Component: NotFound },
    ],
  },
]);
