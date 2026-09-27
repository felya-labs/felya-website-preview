import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const sourceRoot = path.join(root, 'assets-source/brand/source/logo-v4');
const logoRoot = path.join(root, 'public/assets/images/brand/felya-logo');
const sha256 = (source) => crypto.createHash('sha256').update(source).digest('hex');

const sources = new Map([
  ['V4_Pyra_black.png', 'fe06d1ec16fd9952a47bbe2685afa817e2915860f6d51a02c699acfeaca59368'],
  ['V4_Pyra_white.png', '6a6c0e4ef33c7811af1b2380cfad350c1a11240702f53a589e605654f40b0e1e'],
  ['V4_Pyra+FELYA_black_horizontal.png', '84ac38ae9ebe73c52584d2ff4a3edde6d6823ee303ecd8c3b7f7c53e9672673d'],
  ['V4_Pyra+FELYA_white_horizontal.png', 'fb1b8fd301869502acae06c989c02020af0a7d19230db66ac2fff22cbb19f68d'],
  ['V4_Pyra+FELYA_black_vertikal.png', '8135340a95e550d52b4c74c9a06aac97bd3af1a6c5bfee83a3c2bcfafae43219'],
  ['V4_Pyra+FELYA_white_vertikal.png', 'd90090646b72a81a81f77d915e1c8f766cac630f10cf1966fb8ad649280e7efd']
]);

const pairs = [
  ['V4_Pyra_black.png', 'V4_Pyra_white.png'],
  ['V4_Pyra+FELYA_black_horizontal.png', 'V4_Pyra+FELYA_white_horizontal.png'],
  ['V4_Pyra+FELYA_black_vertikal.png', 'V4_Pyra+FELYA_white_vertikal.png']
];

for (const [fileName, expectedHash] of sources) {
  const contents = await fs.readFile(path.join(sourceRoot, fileName));
  if (sha256(contents) !== expectedHash) throw new Error(`V4 SOURCE HASH: FAIL (${fileName})`);
}

for (const [blackName, whiteName] of pairs) {
  const [black, white] = await Promise.all([
    sharp(path.join(sourceRoot, blackName)).raw().toBuffer({ resolveWithObject: true }),
    sharp(path.join(sourceRoot, whiteName)).raw().toBuffer({ resolveWithObject: true })
  ]);
  if (
    black.info.width !== white.info.width ||
    black.info.height !== white.info.height ||
    black.info.channels !== 3 ||
    white.info.channels !== 3
  ) throw new Error(`V4 SOURCE PAIR FORMAT: FAIL (${blackName})`);
  for (let index = 0; index < black.data.length; index += 1) {
    if (black.data[index] + white.data[index] !== 255) {
      throw new Error(`V4 SOURCE PAIR INVERSE: FAIL (${blackName})`);
    }
  }
}

const variants = new Map([
  ['felya-mark', [439, 562]],
  ['felya-logo-horizontal', [879, 284]],
  ['felya-logo-vertical', [390, 373]]
]);
const forbiddenSvg = /<(?:image|filter|style|script|text|rect|circle|ellipse|polygon|polyline|line)\b/i;

for (const [stem, [width, height]] of variants) {
  const [blackSvg, whiteSvg] = await Promise.all([
    fs.readFile(path.join(logoRoot, `${stem}-black.svg`), 'utf8'),
    fs.readFile(path.join(logoRoot, `${stem}-white.svg`), 'utf8')
  ]);
  const expectedFrame = `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`;
  const blackPath = blackSvg.match(/<path d="([^"]+)"/)?.[1];
  const whitePath = whiteSvg.match(/<path d="([^"]+)"/)?.[1];
  if (!blackSvg.includes(expectedFrame) || !whiteSvg.includes(expectedFrame)) {
    throw new Error(`V4 SVG VIEWBOX: FAIL (${stem})`);
  }
  if (!blackPath || blackPath !== whitePath) throw new Error(`V4 SVG GEOMETRY MATCH: FAIL (${stem})`);
  if (!blackSvg.includes('fill="#000000"') || !whiteSvg.includes('fill="#FFFFFF"')) {
    throw new Error(`V4 SVG COLOR: FAIL (${stem})`);
  }
  if (forbiddenSvg.test(blackSvg) || forbiddenSvg.test(whiteSvg)) {
    throw new Error(`V4 SVG CLEAN CONTENT: FAIL (${stem})`);
  }

  for (const color of ['black', 'white']) {
    const metadata = await sharp(path.join(logoRoot, `${stem}-${color}.png`)).metadata();
    if (metadata.width !== width || metadata.height !== height || !metadata.hasAlpha) {
      throw new Error(`V4 PNG FORMAT: FAIL (${stem}-${color})`);
    }
  }
}

const faviconDimensions = new Map([
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['favicon-48x48.png', 48],
  ['favicon-96x96.png', 96],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['favicon-256x256.png', 256],
  ['android-chrome-512x512.png', 512],
  ['android-chrome-maskable-512x512.png', 512]
]);

for (const [fileName, size] of faviconDimensions) {
  const metadata = await sharp(path.join(root, 'public/assets/favicon', fileName)).metadata();
  if (metadata.width !== size || metadata.height !== size) {
    throw new Error(`V4 FAVICON DIMENSIONS: FAIL (${fileName})`);
  }
}

const [publicIco, assetIco] = await Promise.all([
  fs.readFile(path.join(root, 'public/favicon.ico')),
  fs.readFile(path.join(root, 'public/assets/favicon/favicon.ico'))
]);
if (!publicIco.equals(assetIco)) throw new Error('V4 FAVICON ICO MATCH: FAIL');

const archivedLogo = path.join(
  root,
  'assets-source/brand/archive/2026-09-pre-v4/website-logos/felya-logo-white-optical.svg'
);
await fs.access(archivedLogo);

console.log('V4 SOURCE HASHES: PASS');
console.log('V4 POSITIVE/NEGATIVE SOURCE PAIRS: PASS');
console.log('V4 SVG GEOMETRY AND CONTENT: PASS');
console.log('V4 TRANSPARENT PNGS: PASS');
console.log('V4 FAVICON FAMILY: PASS');
console.log('PRE-V4 ARCHIVE: PASS');
