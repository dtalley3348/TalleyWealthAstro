import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import send from 'send';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'dist', 'client');
const { handler } = await import('../dist/server/entry.mjs');

const staticAssetPattern = /\.(?:avif|css|gif|ico|jpeg|jpg|js|mp4|pdf|png|svg|webm|webp|woff2?)$/i;

function cacheControlFor(pathname) {
  if (pathname.startsWith('/_astro/') || pathname.startsWith('/fonts/talley-wealth/')) {
    return 'public, max-age=31536000, immutable';
  }

  if (pathname.startsWith('/brands/talley-wealth/') && staticAssetPattern.test(pathname)) {
    return 'public, max-age=2592000, stale-while-revalidate=86400';
  }

  return null;
}

function serveStatic(req, res, pathname, cacheControl) {
  const stream = send(req, pathname, {
    root: clientDir,
    dotfiles: pathname.startsWith('/.well-known/') ? 'allow' : 'deny',
  });

  let fileStarted = false;

  stream.on('file', () => {
    fileStarted = true;
  });

  stream.on('stream', () => {
    res.setHeader('Cache-Control', cacheControl);
  });

  stream.on('error', (error) => {
    if (!fileStarted && error.statusCode === 404) {
      handler(req, res);
      return;
    }

    const status = 'statusCode' in error ? error.statusCode : 500;
    if (status >= 500) {
      console.error(error);
    }
    res.writeHead(status);
    res.end(status >= 500 ? 'Internal server error' : '');
  });

  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    const pathname = decodeURIComponent(requestUrl.pathname);
    const cacheControl = cacheControlFor(pathname);

    if (cacheControl) {
      serveStatic(req, res, pathname, cacheControl);
      return;
    }

    handler(req, res);
  } catch {
    res.writeHead(400);
    res.end('Bad request.');
  }
});

const port = Number(process.env.PORT || 5181);
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Talley Wealth server listening on http://${host}:${port}`);
});
