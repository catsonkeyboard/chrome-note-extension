const fs = require('fs');
const path = require('path');

// 创建SVG图标
function createSVG(size) {
  const fontSize = Math.floor(size * 0.4);
  const radius = Math.floor(size * 0.15);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#3b82f6"/>
  <text
    x="50%"
    y="50%"
    font-family="Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="central">MD</text>
</svg>`;
}

// 确保目录存在
const publicIconsDir = path.join(__dirname, '../public/icons');
const distIconsDir = path.join(__dirname, '../dist/icons');

fs.mkdirSync(publicIconsDir, { recursive: true });
fs.mkdirSync(distIconsDir, { recursive: true });

// 生成SVG图标
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svg = createSVG(size);

  // 保存到 public/icons
  fs.writeFileSync(
    path.join(publicIconsDir, `icon-${size}.svg`),
    svg
  );

  console.log(`✓ 生成 icon-${size}.svg`);
});

console.log('\n✅ SVG图标已生成！');
console.log('\n⚠️  注意：Chrome扩展需要PNG格式的图标。');
console.log('请使用以下方式之一将SVG转换为PNG：\n');
console.log('方法1: 在浏览器中打开 scripts/generate-icons.html');
console.log('方法2: 使用在线工具 https://www.favicon-generator.org/');
console.log('方法3: 使用 ImageMagick 命令：');
sizes.forEach(size => {
  console.log(`  convert public/icons/icon-${size}.svg public/icons/icon-${size}.png`);
});
console.log('\n然后将生成的PNG文件复制到 dist/icons/ 目录');
