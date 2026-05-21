import { proxyOrLocalSuccess, type StandaloneApiRoute } from '../../../lib/platform-api';

export const prerender = false;

export const POST: StandaloneApiRoute = async ({ request }) => {
  return proxyOrLocalSuccess(request, '/api/talley/contact', {
    id: 'local-talley-contact',
    message: 'Local Talley contact submission accepted.',
  });
};
