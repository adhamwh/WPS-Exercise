import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const inputDir = path.resolve("resources/js/imgs");
const outputDir = path.resolve("resources/js/imgs-optimized");

const allowed = [".jpg", ".jpeg", ".png"];

await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(inputDir);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();

  if (!allowed.includes(ext)) continue;

  const inputPath = path.join(inputDir, file);
  const name = path.basename(file, ext);
  const outputPath = path.join(outputDir, `${name}.webp`);

  await sharp(inputPath)
    .resize({
      width: 1600,
      withoutEnlargement: true,
    })
    .webp({
      quality: 78,
    })
    .toFile(outputPath);

  console.log(`Compressed: ${file} -> ${name}.webp`);
}
