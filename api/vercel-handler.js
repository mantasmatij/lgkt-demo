// Shim for Vercel: single entry so Vercel sees one function file.
// We resolve the compiled handler lazily at request time to avoid bundlers tracing a missing path.
const path = require('path');
const fs = require('fs');

function resolveCompiledHandler() {
  const candidates = [
    // When executed with CWD at repo root
    path.join(process.cwd(), 'dist', 'api', 'src', 'vercel-handler.js'),
    // When resolved relative to this file in the api/ folder
    path.join(__dirname, '..', 'dist', 'api', 'src', 'vercel-handler.js'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

module.exports = async (req, res) => {
  const target = resolveCompiledHandler();
  if (!target) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('API not built yet. Expected `dist/api/src/vercel-handler.js`.');
    return;
  }
  const mod = require(target);
  const handler = mod && mod.default ? mod.default : mod;
  return handler(req, res);
};
