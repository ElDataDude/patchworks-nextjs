const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('/Users/bryanj/dev/patchworks/patchworks-nextjs/node_modules/sharp');
const root = '/Users/bryanj/dev/patchworks/patchworks-nextjs';
const source = path.join(root, 'design/logo-joined-wordmark-iterations-2026-09-13/03-lowercase-continuum.png');
const out = path.join(root, 'design/logo-assets-lowercase-continuum');
const INK = [9, 14, 52];
const ORANGE = [209, 96, 19];
const WHITE = [255, 255, 255];
const manifest = [];

function cutout(data, info, box, mark = false) {
  const pixels = Buffer.alloc(box.w * box.h * 4);
  for (let y = 0; y < box.h; y++) for (let x = 0; x < box.w; x++) {
    const i = ((box.y + y) * info.width + box.x + x) * info.channels;
    const rgb = [data[i], data[i + 1], data[i + 2]];
    const orange = mark || rgb[0] > rgb[2] + 6;
    const matteColour = orange ? [216, 88, 12] : [4, 8, 36];
    const vector = matteColour.map(c => 254 - c);
    const a = rgb.reduce((sum, c, k) => sum + (254 - c) * vector[k], 0) / vector.reduce((sum, c) => sum + c * c, 0);
    const alpha = a < 0.025 ? 0 : a > 0.94 ? 255 : Math.round(Math.min(1, Math.max(0, a)) * 255);
    const j = (y * box.w + x) * 4;
    const colour = orange ? ORANGE : INK;
    for (let k = 0; k < 3; k++) pixels[j + k] = colour[k];
    pixels[j + 3] = alpha;
  }
  return pixels;
}

function recolour(input, mode) {
  const pixels = Buffer.from(input);
  for (let i = 0; i < pixels.length; i += 4) {
    const orange = pixels[i] > pixels[i + 2];
    const colour = mode === 'white' ? WHITE : mode === 'ink' ? INK : mode === 'reverse' && !orange ? WHITE : orange ? ORANGE : INK;
    for (let k = 0; k < 3; k++) pixels[i + k] = colour[k];
  }
  return pixels;
}

async function save(buffer, raw, file, width, square = false, background) {
  const dest = path.join(out, file);
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  let pipeline = sharp(buffer, {raw});
  if (square) {
    const inner = Math.round(width * .80);
    const background = {r: 0, g: 0, b: 0, alpha: 0};
    const content = await pipeline.resize({width: inner, height: inner, fit: 'contain', kernel: 'lanczos3', background}).png().toBuffer();
    pipeline = sharp(content).extend({top: Math.floor((width - inner) / 2), bottom: Math.ceil((width - inner) / 2), left: Math.floor((width - inner) / 2), right: Math.ceil((width - inner) / 2), background});
  }
  else {
    const padded = await pipeline.extend({top: 20, bottom: 20, left: 24, right: 24, background: {r: 0, g: 0, b: 0, alpha: 0}}).png().toBuffer();
    pipeline = sharp(padded).resize(width, null, {kernel: 'lanczos3'});
  }
  if (background) pipeline = sharp(await pipeline.png().toBuffer()).flatten({background}).removeAlpha();
  await pipeline.png({compressionLevel: 9}).toFile(dest);
  const metadata = await sharp(dest).metadata();
  const stats = await sharp(dest).stats();
  if (!background && (!metadata.hasAlpha || stats.channels[3].min !== 0 || stats.channels[3].max !== 255)) throw Error('Transparency check failed: ' + file);
  if (square && (metadata.width !== width || metadata.height !== width)) throw Error('Square dimensions failed: ' + file);
  if (!square && metadata.width !== width) throw Error('Wordmark width failed: ' + file);
  if (background && metadata.hasAlpha) throw Error('Opaque background check failed: ' + file);
  manifest.push({file, width: metadata.width, height: metadata.height, transparent: !!metadata.hasAlpha, sha256: crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')});
}

(async () => {
  fs.mkdirSync(out, {recursive: true});
  const {data, info} = await sharp(source).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const logoBox = {x: 104, y: 180, w: 1329, h: 202};
  const markBox = {x: 228, y: 548, w: 249, h: 106};
  const wordmark = cutout(data, info, logoBox);
  const mark = cutout(data, info, markBox, true);
  const rawLogo = {width: logoBox.w, height: logoBox.h, channels: 4};
  const rawMark = {width: markBox.w, height: markBox.h, channels: 4};
  for (const [name, mode] of [['full-colour', 'colour'], ['dark-background', 'reverse'], ['single-colour-ink', 'ink'], ['single-colour-white', 'white']]) {
    const pixels = recolour(wordmark, mode);
    for (const width of [2400, 1200, 600, 300]) await save(pixels, rawLogo, `wordmark/patchworks-ai-${name}-${width}.png`, width);
  }
  for (const [name, mode] of [['orange', 'colour'], ['ink', 'ink'], ['white', 'white']]) {
    for (const width of [1024, 512, 256]) await save(recolour(mark, mode), rawMark, `mark/patchworks-wo-${name}-${width}.png`, width, true);
  }
  for (const width of [180, 64, 32, 16]) await save(mark, rawMark, `icons/patchworks-wo-${width}.png`, width, true);
  await save(mark, rawMark, 'social/patchworks-avatar-light-1024.png', 1024, true, '#fcfcfc');
  await save(mark, rawMark, 'social/patchworks-avatar-dark-1024.png', 1024, true, '#121723');
  await save(wordmark, rawLogo, 'preview/patchworks-wordmark-light-1200.png', 1200, false, '#fcfcfc');
  await save(recolour(wordmark, 'reverse'), rawLogo, 'preview/patchworks-wordmark-dark-1200.png', 1200, false, '#121723');
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({source, sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), nativeWordmarkBounds: logoBox, nativeMarkBounds: markBox, method: 'Direct extraction from the approved raster board, flat brand colour normalisation, alpha matte and Lanczos PNG size exports. Larger files are upscaled raster exports, not new vector artwork.', files: manifest}, null, 2) + '\n');
  console.log(JSON.stringify({files: manifest.length, output: out, transparent: manifest.filter(x => x.transparent).length}, null, 2));
})();
