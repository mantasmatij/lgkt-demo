const fs = require('fs');
const path = require('path');

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function findCacheDistApi(root) {
  const cacheDir = path.join(root, '.nx', 'cache');
  if (!exists(cacheDir)) return null;
  const entries = fs.readdirSync(cacheDir, { withFileTypes: true }).filter(d => d.isDirectory());
  let candidates = [];
  for (const dir of entries) {
    const distApi = path.join(cacheDir, dir.name, 'dist', 'api');
    if (exists(distApi)) {
      const stat = fs.statSync(distApi);
      candidates.push({ dir: distApi, mtime: stat.mtimeMs });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0].dir;
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(src, dest) {
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function main() {
  const root = process.cwd();
  const apiStandalone = path.join(root, 'api-standalone');
  const sourceDist = exists(path.join(root, 'dist', 'api'))
    ? path.join(root, 'dist', 'api')
    : findCacheDistApi(root);

  if (!sourceDist) {
    console.error('[prepare-api-standalone] No dist/api found (nor in .nx/cache).');
    process.exit(1);
  }

  console.log('[prepare-api-standalone] Using source:', sourceDist);

  rmrf(apiStandalone);
  mkdirp(path.join(apiStandalone, 'api'));

  // Copy compiled api dist
  copyDir(sourceDist, path.join(apiStandalone, 'dist', 'api'));

  // Copy workspace_modules if present under sourceDist
  const wsSrc = path.join(sourceDist, 'workspace_modules');
  if (exists(wsSrc)) {
    copyDir(wsSrc, path.join(apiStandalone, 'workspace_modules'));
  } else {
    mkdirp(path.join(apiStandalone, 'workspace_modules'));
    const tsconfigBase = path.join(root, 'tsconfig.base.json');
    if (exists(tsconfigBase)) {
      fs.copyFileSync(tsconfigBase, path.join(apiStandalone, 'workspace_modules', 'tsconfig.base.json'));
    }
  }

  // Copy package.json to help Vercel resolve dependencies
  fs.copyFileSync(path.join(root, 'api', 'package.json'), path.join(apiStandalone, 'package.json'));
  // Copy committed shim
  fs.copyFileSync(path.join(root, 'api', 'vercel-handler.js'), path.join(apiStandalone, 'api', 'vercel-handler.js'));

  console.log('api-standalone prepared.');
}

main();
