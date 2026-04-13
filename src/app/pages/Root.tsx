import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import CartSidebar from '../components/CartSidebar';

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
      Loading…
    </div>
  );
}

export default function Root() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <CartSidebar />
    </div>
  );
}