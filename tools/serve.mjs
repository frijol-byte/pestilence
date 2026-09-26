// Local dev server for the map renderer.
//   GET  /...                         static files from the project root
//   GET  /three/...                   three.js build from node_modules
//   POST /save?file=<relative path>   writes the request body under module/pestilence/assets
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'module', 'pestilence', 'assets');
const PORT = Number(process.env.PORT) || 5178;

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css',
};

function inside(base, p) {
  const rel = path.relative(base, p);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (req.method === 'POST' && url.pathname === '/save') {
      const base = url.searchParams.has('debug') ? path.join(ROOT, 'debug') : ASSETS;
      const target = path.resolve(base, url.searchParams.get('file') ?? '');
      if (!inside(base, target)) throw Object.assign(new Error('bad path'), { status: 400 });
      const chunks = [];
      for await (const c of req) chunks.push(c);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, Buffer.concat(chunks));
      console.log(`saved ${path.relative(ROOT, target)} (${Buffer.concat(chunks).length} bytes)`);
      res.writeHead(200).end('ok');
      return;
    }
    if (url.pathname === '/') {
      res.writeHead(302, { location: `/src/render/index.html${url.search}` }).end();
      return;
    }
    let file;
    if (url.pathname.startsWith('/three/')) {
      file = path.join(ROOT, 'node_modules', 'three', url.pathname.slice('/three/'.length));
    } else {
      file = path.join(ROOT, url.pathname);
    }
    if (!inside(ROOT, file)) throw Object.assign(new Error('bad path'), { status: 400 });
    const body = await fs.readFile(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch (err) {
    res.writeHead(err.status ?? (err.code === 'ENOENT' ? 404 : 500)).end(String(err.message));
  }
}).listen(PORT, () => console.log(`map renderer at http://localhost:${PORT}/`));
