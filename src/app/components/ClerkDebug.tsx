import { useState } from 'react';
import { useUser, useAuth, useSession } from '@clerk/clerk-react';

export default function ClerkDebug() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const { userId, sessionId, orgId, orgRole } = useAuth();
  const { session } = useSession();

  if (!isLoaded) return null;

  const snapshot = {
    userId,
    sessionId,
    orgId,
    orgRole,
    user: user
      ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          username: user.username,
          imageUrl: user.imageUrl,
          hasImage: user.hasImage,
          primaryEmail: user.primaryEmailAddress?.emailAddress,
          emailVerified: user.primaryEmailAddress?.verification?.status,
          allEmails: user.emailAddresses.map((e) => e.emailAddress),
          primaryPhone: user.primaryPhoneNumber?.phoneNumber,
          externalAccounts: user.externalAccounts.map((a) => ({
            provider: a.provider,
            email: a.emailAddress,
            firstName: a.firstName,
            lastName: a.lastName,
          })),
          publicMetadata: user.publicMetadata,
          unsafeMetadata: user.unsafeMetadata,
          createdAt: user.createdAt,
          lastSignInAt: user.lastSignInAt,
          twoFactorEnabled: user.twoFactorEnabled,
          passwordEnabled: user.passwordEnabled,
        }
      : null,
    session: session
      ? {
          id: session.id,
          status: session.status,
          lastActiveAt: session.lastActiveAt,
          expireAt: session.expireAt,
        }
      : null,
  };

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900"
      >
        <span>🔍 Clerk user debug (dev only)</span>
        <span className="text-gray-500">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(snapshot, null, 2)}
          </pre>
          <button
            onClick={async () => {
              const t = await session?.getToken();
              setToken(t ?? '(null)');
            }}
            className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Fetch session JWT
          </button>
          {token && (
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto break-all whitespace-pre-wrap">
              {token}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
