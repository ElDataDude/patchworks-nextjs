const fs = require("fs");
const sharp = require("sharp");
(async () => {
  const slices = JSON.parse(fs.readFileSync("design/evidence/qa-slices.json"));
  const groups = Map.groupBy(
    slices,
    (s) => `${s.route === "/" ? "home" : s.route.slice(1)}-${s.viewport}`,
  );
  for (const [name, rows] of groups) {
    const { width, pageHeight } = rows[0];
    const tiles = [];
    for (let i = 0; i < rows.length; i++) {
      let s = rows[i];
      let crop = i ? 100 : 0;
      let m = await sharp(s.path).metadata();
      const height = Math.min(m.height - crop, pageHeight - s.y - crop);
      if (height <= 0) continue;
      tiles.push({
        input: await sharp(s.path)
          .extract({
            left: 0,
            top: crop,
            width: Math.min(width, m.width),
            height,
          })
          .png()
          .toBuffer(),
        left: 0,
        top: Math.round(s.y + crop),
      });
    }
    await sharp({
      create: { width, height: pageHeight, channels: 3, background: "#fcfcfc" },
    })
      .composite(tiles)
      .png()
      .toFile(`design/evidence/${name}.png`);
  }
  for (const viewport of ["desktop", "tablet", "mobile"]) {
    const names = [...groups.keys()].filter((n) => n.endsWith(viewport));
    if (!names.length) continue;
    const thumbWidth = viewport === "mobile" ? 240 : 400;
    const thumbHeight = 1000;
    const columns = 4;
    const composites = [];
    for (let i = 0; i < names.length; i++) {
      const file = `design/evidence/${names[i]}.png`;
      const buf = await sharp(file)
        .resize({ width: thumbWidth, height: thumbHeight, fit: "inside" })
        .png()
        .toBuffer();
      composites.push({
        input: buf,
        left: (i % columns) * (thumbWidth + 12),
        top: Math.floor(i / columns) * (thumbHeight + 12),
      });
    }
    await sharp({
      create: {
        width: columns * (thumbWidth + 12),
        height: Math.ceil(names.length / columns) * (thumbHeight + 12),
        channels: 3,
        background: "#ddd",
      },
    })
      .composite(composites)
      .png()
      .toFile(`design/evidence/${viewport}-overview.png`);
  }
  console.log(`Composed ${groups.size} route screenshots`);
})();
