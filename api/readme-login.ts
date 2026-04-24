import { createClerkClient } from '@clerk/backend';
import jwt from 'jsonwebtoken';

export const config = { runtime: 'nodejs' };

const README_URL = 'https://lushair.readme.io';

export default async function handler(req: Request): Promise<Response> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const readmeSecret = process.env.README_SECRET;

  if (!secretKey || !readmeSecret) {
    return new Response('Server misconfigured: missing CLERK_SECRET_KEY or README_SECRET', {
      status: 500,
    });
  }

  const clerkClient = createClerkClient({ secretKey });

  const origin = new URL(req.url).origin;
  const requestState = await clerkClient.authenticateRequest(req, {
    authorizedParties: [
      origin,
      'http://localhost:5173',
      'https://lushair.ai',
      'https://www.lushair.ai',
    ],
  });

  if (!requestState.isSignedIn) {
    const signInUrl = new URL('/', origin);
    signInUrl.searchParams.set('sign_in_and_redirect', '/api/readme-login');
    return Response.redirect(signInUrl.toString(), 302);
  }

  const { userId } = requestState.toAuth();
  const user = await clerkClient.users.getUser(userId);

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.username ||
    user.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'User';

  const payload: Record<string, unknown> = {
    name: fullName,
    email: user.primaryEmailAddress?.emailAddress,
    id: user.id,
  };

  const token = jwt.sign(payload, readmeSecret, { expiresIn: '10m' });

  const target = new URL(README_URL);
  target.searchParams.set('auth_token', token);

  return Response.redirect(target.toString(), 302);
}
