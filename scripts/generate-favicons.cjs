const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const designIconDirectory = path.join(
  root,
  "design/logo-assets-lowercase-continuum/icons",
);
const publicBrandDirectory = path.join(root, "public/images/brand");
const sizes = [16, 32, 64];
const pngSignature = Buffer.from("89504e470d0a1a0a", "hex");

function readApprovedPng(size) {
  const source = path.join(designIconDirectory, `patchworks-wo-${size}.png`);
  const png = fs.readFileSync(source);

  if (!png.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`${source} is not a PNG`);
  }

  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== size || height !== size) {
    throw new Error(
      `${source} is ${width}x${height}; expected ${size}x${size}`,
    );
  }

  return { png, size, source };
}

function buildPngBackedIco(images) {
  const headerSize = 6 + images.length * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let imageOffset = headerSize;
  images.forEach(({ png, size }, index) => {
    const entryOffset = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(png.length, entryOffset + 8);
    header.writeUInt32LE(imageOffset, entryOffset + 12);
    imageOffset += png.length;
  });

  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

const images = sizes.map(readApprovedPng);
const ico = buildPngBackedIco(images);
const outputs = [
  path.join(designIconDirectory, "patchworks-wo.ico"),
  path.join(root, "public/favicon.ico"),
  path.join(publicBrandDirectory, "patchworks-favicon-lowercase-continuum.ico"),
];

fs.mkdirSync(publicBrandDirectory, { recursive: true });
for (const { png, size } of images) {
  fs.writeFileSync(
    path.join(publicBrandDirectory, `patchworks-wo-${size}.png`),
    png,
  );
}
fs.copyFileSync(
  path.join(designIconDirectory, "patchworks-wo-180.png"),
  path.join(publicBrandDirectory, "patchworks-wo-180.png"),
);
for (const output of outputs) fs.writeFileSync(output, ico);

const sha256 = crypto.createHash("sha256").update(ico).digest("hex");
console.log(
  JSON.stringify(
    {
      source: images.map(({ source }) => path.relative(root, source)),
      sizes,
      sha256,
      outputs: outputs.map((output) => path.relative(root, output)),
    },
    null,
    2,
  ),
);
