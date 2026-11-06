import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

export function normalizeStaticRscPaths(root = 'out') {
  if (!fs.existsSync(root)) throw new Error(`Static export directory not found: ${root}`);
  let normalized = 0;

  for (const source of walk(root).filter(file => file.endsWith('.txt'))) {
    const parts = path.relative(root, source).split(path.sep);
    const marker = parts.findIndex(part => part.startsWith('__next.') && !part.endsWith('.txt'));
    if (marker < 0 || marker === parts.length - 1) continue;

    const flatName = `${parts[marker]}.${parts.slice(marker + 1).join('.')}`;
    const target = path.join(root, ...parts.slice(0, marker), flatName);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (!fs.existsSync(target) || !fs.readFileSync(target).equals(fs.readFileSync(source))) {
      fs.copyFileSync(source, target);
      normalized += 1;
    }
  }

  console.log(`Normalized ${normalized} static RSC payload paths for navigation.`);
  return normalized;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/normalize-static-export.mjs')) {
  normalizeStaticRscPaths(process.argv[2] || 'out');
}
