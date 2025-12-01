// Committed shim so Vercel detects a single Serverless Function pre-build.
// It lazy-loads the compiled handler from the build output at runtime.
const path = require('path');
const fs = require('fs');

function resolveCompiledHandler() {
  const candidates = [
    // When executed with CWD at project root (api-standalone)
    path.join(process.cwd(), 'dist', 'api', 'src', 'vercel-handler.js'),
    // When resolved relative to this file
    path.join(__dirname, '..', 'dist', 'api', 'src', 'vercel-handler.js'),
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  return null;
}

module.exports = async (req, res) => {
  const target = resolveCompiledHandler();
  if (!target) {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '600');
      res.end();
      return;
    }
    console.error('[vercel-handler] Compiled handler missing: dist/api/src/vercel-handler.js');
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('API not built yet. Expected `dist/api/src/vercel-handler.js`.');
    return;
  }
  const mod = require(target);
  const handler = mod && mod.default ? mod.default : mod;
  return handler(req, res);
};
