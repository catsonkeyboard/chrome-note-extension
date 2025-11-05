const fs = require('fs');
const path = require('path');

// 创建简单的PNG文件（1x1像素蓝色占位符）
// 这只是临时解决方案，建议使用实际图标替换

// 基础的PNG文件头和数据（1x1蓝色像素）
const createSimplePNG = (size) => {
  // 这是一个简单的纯色PNG base64数据（蓝色正方形）
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==';
  return Buffer.from(base64PNG, 'base64');
};

// 确保目录存在
const publicIconsDir = path.join(__dirname, '../public/icons');
const distIconsDir = path.join(__dirname, '../dist/icons');

fs.mkdirSync(publicIconsDir, { recursive: true });
fs.mkdirSync(distIconsDir, { recursive: true });

// 生成占位符PNG
const sizes = [16, 48, 128];

console.log('⚠️  正在创建临时占位符PNG图标...\n');

sizes.forEach(size => {
  const pngData = createSimplePNG(size);

  // 保存到 public/icons 和 dist/icons
  fs.writeFileSync(path.join(publicIconsDir, `icon-${size}.png`), pngData);
  fs.writeFileSync(path.join(distIconsDir, `icon-${size}.png`), pngData);

  console.log(`✓ 创建临时 icon-${size}.png`);
});

console.log('\n✅ 临时占位符PNG已创建！');
console.log('\n⚠️  这只是1x1像素的占位符，扩展可以加载了。');
console.log('💡 建议尽快使用以下方法创建实际图标：\n');
console.log('推荐: 打开 scripts/generate-icons.html 在浏览器中生成');
console.log('或访问: https://www.favicon-generator.org/\n');
