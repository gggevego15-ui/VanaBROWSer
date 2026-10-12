const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

async function main() {
  const root = path.resolve(__dirname, '..');
  const svgPath = path.join(root, 'assets', 'icon.svg');
  const icoPath = path.join(root, 'assets', 'icon.ico');

  if (!fs.existsSync(svgPath)) {
    throw new Error('Icon source not found: ' + svgPath);
  }

  const png = await sharp(svgPath)
    .resize(256, 256)
    .png()
    .toBuffer();

  const ico = await pngToIco(png);
  fs.writeFileSync(icoPath, ico);
  console.log('Created Windows icon: ' + icoPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
