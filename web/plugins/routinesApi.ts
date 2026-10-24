import { mkdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

// Dev-server endpoint that owns every disk write the web app makes. Writes are limited to
// the one directory passed in; the id is validated so the path cannot escape it.
//
//   PUT /api/routines/:id   body: routine JSON   -> writes <dir>/<id>.json (tmp + rename)
export default function routinesApi(dir: string): Plugin {
  return {
    name: 'routines-api',
    configureServer(server) {
      server.middlewares.use('/api/routines', (req, res, next) => {
        if (req.method !== 'PUT') return next();
        handlePut(dir, req, res).catch(err => {
          console.error('[routines-api]', err);
          send(res, 500, String(err));
        });
      });
    },
  };
}

const ID = /^[A-Za-z0-9_-]+$/;

async function handlePut(dir: string, req: IncomingMessage, res: ServerResponse) {
  const id = (req.url ?? '').replace(/^\//, '').split('?')[0];
  if (!ID.test(id)) return send(res, 400, `invalid routine id "${id}"`);

  const body = await readBody(req);
  try {
    JSON.parse(body);
  } catch {
    return send(res, 400, 'body is not valid JSON');
  }

  await mkdir(dir, { recursive: true });
  const target = join(dir, `${id}.json`);
  const tmp = join(dir, `.${id}.json.tmp`);
  await writeFile(tmp, body.endsWith('\n') ? body : body + '\n', 'utf8');
  await rename(tmp, target);
  send(res, 200, JSON.stringify({ path: target }), 'application/json');
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (c: string) => (body += c));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: string, type = 'text/plain') {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.end(body);
}
