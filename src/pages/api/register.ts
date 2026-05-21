import { proxyOrLocalSuccess, type StandaloneApiRoute } from '../../lib/platform-api';

export const prerender = false;

export const POST: StandaloneApiRoute = async ({ request }) => {
  return proxyOrLocalSuccess(request, '/api/register', {
    id: 'local-talley-registration',
    message: 'Local Talley registration accepted.',
  });
};
