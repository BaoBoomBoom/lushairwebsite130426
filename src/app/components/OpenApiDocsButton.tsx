import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ExternalLink } from 'lucide-react';

type Props = {
  className?: string;
  label?: string;
};

export default function OpenApiDocsButton({ className, label = 'Open API Docs' }: Props) {
  const base =
    className ??
    'inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold';

  return (
    <>
      <SignedIn>
        <a href="/api/readme-login" className={base}>
          {label}
          <ExternalLink size={16} />
        </a>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/api/readme-login">
          <button className={base}>
            {label}
            <ExternalLink size={16} />
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
