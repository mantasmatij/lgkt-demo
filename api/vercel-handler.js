// Shim for Vercel: committed single entry-point so Vercel sees one function file
// At runtime this will require the compiled handler produced by the build:
// `dist/api/src/vercel-handler.js`.
// If the compiled file isn't present yet (during build), we respond with an explanatory error.
let handler;
try {
  handler = require('./dist/api/src/vercel-handler.js');
  // If the compiled module uses default export, prefer that.
  const exported = handler && handler.default ? handler.default : handler;
  module.exports = exported;
} catch (err) {
  module.exports = (req, res) => {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('API not built yet. The server-side build must produce `dist/api/src/vercel-handler.js`.');
  };
}
