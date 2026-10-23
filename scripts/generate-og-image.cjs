const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const output = path.join(
  root,
  "public/images/brand/patchworks-og-1200x630.png",
);

const width = 1200;
const height = 630;

const overlay = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#121723" stop-opacity="1"/>
        <stop offset="0.43" stop-color="#121723" stop-opacity="0.96"/>
        <stop offset="0.72" stop-color="#121723" stop-opacity="0.3"/>
        <stop offset="1" stop-color="#121723" stop-opacity="0.72"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#veil)"/>
    <rect width="1200" height="8" fill="#d16013"/>
    <rect x="72" y="205" width="64" height="3" fill="#d16013"/>
    <text x="72" y="288" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="51" font-weight="600" letter-spacing="-1.2">AI counsel and delivery</text>
    <text x="72" y="352" fill="#f4ece3" font-family="Georgia, 'Times New Roman', serif" font-size="55" font-style="italic" letter-spacing="-1">for complex enterprises</text>
    <text x="72" y="558" fill="#ffffff" fill-opacity="0.82" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="0.5">patchworks.ai</text>
  </svg>
`);

async function main() {
  const backdrop = await sharp(
    path.join(root, "public/images/editorial/home-systems.webp"),
  )
    .resize(width, 480, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.78, saturation: 0.82 })
    .png()
    .toBuffer();

  const wordmark = await sharp(
    path.join(
      root,
      "public/images/brand/patchworks-ai-dark-background-600.png",
    ),
  )
    .resize({ width: 480 })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#121723",
    },
  })
    .composite([
      { input: backdrop, left: 0, top: 150 },
      { input: overlay, left: 0, top: 0 },
      { input: wordmark, left: 72, top: 55 },
    ])
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 92,
      colours: 192,
    })
    .toFile(output);

  const metadata = await sharp(output).metadata();
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`Unexpected output dimensions: ${metadata.width}x${metadata.height}`);
  }
  process.stdout.write(`${output}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
