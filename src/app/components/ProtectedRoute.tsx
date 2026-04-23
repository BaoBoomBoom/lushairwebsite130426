import { SignedIn, SignedOut, RedirectToSignIn, ClerkLoading, ClerkLoaded } from '@clerk/clerk-react';
import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <>
      <ClerkLoading>
        <div className="pt-16 min-h-screen flex items-center justify-center text-gray-500">
          Loading…
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}
