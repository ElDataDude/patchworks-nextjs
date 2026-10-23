const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const masterDirectory = path.join(root, "design/editorial-masters");
const outputDirectory = path.join(
  root,
  "public/images/editorial/responsive",
);
const widths = [480, 768, 1200];

const images = [
  "about-bridge",
  "article-leadership",
  "article-manufacturing",
  "article-roi",
  "careers-system",
  "drilling-study",
  "home-systems",
  "industries-system",
  "services-system",
];

async function main() {
  await fs.mkdir(outputDirectory, { recursive: true });

  for (const image of images) {
    const source = path.join(masterDirectory, `${image}.png`);
    const metadata = await sharp(source).metadata();

    for (const width of widths.filter((candidate) => candidate < metadata.width)) {
      const output = path.join(outputDirectory, `${image}-${width}.webp`);
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6, smartSubsample: true })
        .toFile(output);
    }
  }

  process.stdout.write(`${outputDirectory}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
