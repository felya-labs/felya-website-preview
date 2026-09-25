import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const logoRoot = path.join(root, 'public/assets/images/brand/felya-logo');
const blackPath = path.join(logoRoot, 'felya-logo-black.svg');
const negativePath = path.join(logoRoot, 'felya-logo-white-optical.svg');
const masterPath = path.join(
  root,
  'assets-source/brand/designer/felya-logo-zwischenstand-2026-09-25_bildmarke-v2.svg'
);
const faviconPaths = new Map([
  ['public/favicon.ico', 'ebaec6db89836873a127a77af1cb87efa26084f7ffc0c83155624059e96123b1'],
  ['public/assets/favicon/favicon.ico', 'ebaec6db89836873a127a77af1cb87efa26084f7ffc0c83155624059e96123b1'],
  ['public/assets/favicon/favicon-32x32.png', 'fc565778301eb4c5e3e4238aa00ace2733884875375ccc58e2672a33fbfc589a'],
  ['public/assets/favicon/apple-touch-icon.png', '6678022e2a451ffb157b672d4edf1da12129a558b8b99dac32c07574625ebafb'],
  ['public/assets/favicon/android-chrome-512x512.png', '86616e667aa7ebbe58128efae61214d91633fa79164b6e66e1e74e9ee021cf37']
]);

const EXPECTED_MASTER_SHA256 = '4c206658287d06db901e058a83ee3de31f19b7943774adeaf6341aa974c0b203';
const EXPECTED_POSITIVE_SHA256 = '16ca968f788b4b32da3f7d16c324974a73866c4e400bd5d92ce602f39e4f0bf5';
const EXPECTED_MARK_PATH_SHA256 = 'a1ff0a90c54f06fee821b3d281d51083b88fbdde97907a8ab0859d8c94c292c2';
const EXPECTED_WORDMARK_PATH_SHA256 = 'b1b15480800b798ec9f540b7e01a2115f65f9257b29b9d3ea03ef6a7345e0568';
const EXPECTED_N025_STROKE_WIDTH = '7.672634';
const sha256 = (source) => crypto.createHash('sha256').update(source).digest('hex');

const [black, negative, master] = await Promise.all([
  fs.readFile(blackPath, 'utf8'),
  fs.readFile(negativePath, 'utf8'),
  fs.readFile(masterPath, 'utf8')
]);

if (sha256(master) !== EXPECTED_MASTER_SHA256 || sha256(black) !== EXPECTED_POSITIVE_SHA256) {
  throw new Error('POSITIVE MASTER UNCHANGED: FAIL');
}

const combinedPathData = black.match(/<path d="([^"]+)"/)?.[1];
const boundary = combinedPathData?.indexOf('Z M') ?? -1;
if (!combinedPathData || boundary < 0) throw new Error('Unable to split positive logo geometry.');
const markPathData = combinedPathData.slice(0, boundary + 1);
const wordmarkPathData = combinedPathData.slice(boundary + 2);
if (sha256(markPathData) !== EXPECTED_MARK_PATH_SHA256) {
  throw new Error('POSITIVE MASTER UNCHANGED: FAIL');
}

const negativePaths = [...negative.matchAll(/<path\b[^>]*d="([^"]+)"[^>]*>/g)];
const negativeWordmarkPathData = negativePaths.at(-1)?.[1];
const negativeWordmark = negativePaths.at(-1)?.[0] ?? '';
const visibleNegativeMark = negativePaths.at(-2)?.[0] ?? '';
const maskPath = negativePaths.at(0)?.[0] ?? '';

if (sha256(wordmarkPathData) !== EXPECTED_WORDMARK_PATH_SHA256 || negativeWordmarkPathData !== wordmarkPathData) {
  throw new Error('WORDMARK GEOMETRY MATCH: FAIL');
}
if (
  !negative.includes('mask id="felya-negative-n025"') ||
  !maskPath.includes(`stroke-width="${EXPECTED_N025_STROKE_WIDTH}"`) ||
  !visibleNegativeMark.includes('mask="url(#felya-negative-n025)"') ||
  !visibleNegativeMark.includes('fill="#FFFFFF"') ||
  !negativeWordmark.includes('fill="#FFFFFF"') ||
  !negative.includes('viewBox="0 0 1920 1080"') ||
  negative.includes('<filter') ||
  negative.includes('<image') ||
  negative.includes('<style')
) {
  throw new Error('NEGATIVE COMPENSATION N025: FAIL');
}

for (const [relativePath, expectedHash] of faviconPaths) {
  const contents = await fs.readFile(path.join(root, relativePath));
  if (sha256(contents) !== expectedHash) throw new Error(`FAVICON UNCHANGED: FAIL (${relativePath})`);
}

console.log('POSITIVE MASTER UNCHANGED: PASS');
console.log('WORDMARK GEOMETRY MATCH: PASS');
console.log('NEGATIVE COMPENSATION N025: PASS');
console.log('FAVICON UNCHANGED: PASS');
