import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const logoRoot = path.join(root, 'public/assets/images/brand/felya-logo');
const blackPath = path.join(logoRoot, 'felya-logo-black.svg');
const whitePath = path.join(logoRoot, 'felya-logo-white.svg');

const normalizeColor = (source) => source
  .replace(/#[0-9a-f]{3,8}/gi, '#COLOR')
  .replace(/\b(?:black|white)\b/gi, 'COLOR');

const [black, white] = await Promise.all([
  fs.readFile(blackPath, 'utf8'),
  fs.readFile(whitePath, 'utf8')
]);

if (normalizeColor(black) !== normalizeColor(white)) {
  throw new Error('BLACK / WHITE GEOMETRY MATCH: FAIL');
}

const viewBox = black.match(/viewBox="([^"]+)"/)?.[1];
const pathCount = (black.match(/<path\b/g) ?? []).length;

if (!viewBox || pathCount === 0) {
  throw new Error('Brand logo SVG is missing a viewBox or path geometry.');
}

console.log(`BLACK / WHITE GEOMETRY MATCH: PASS (viewBox ${viewBox}; ${pathCount} path)`);
