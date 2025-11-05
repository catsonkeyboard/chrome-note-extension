#!/bin/bash
# 简单的图标生成脚本 - 需要 ImageMagick
# Simple icon generation script - requires ImageMagick

# 检查是否安装了convert命令
if ! command -v convert &> /dev/null; then
    echo "ImageMagick未安装，请手动创建图标文件"
    echo "ImageMagick not installed, please create icon files manually"
    exit 1
fi

# 创建临时SVG
cat > /tmp/icon.svg << 'EOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="20" fill="#3b82f6"/>
  <text x="64" y="80" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">MD</text>
</svg>
EOF

# 生成不同尺寸的PNG
convert /tmp/icon.svg -resize 16x16 icon-16.png
convert /tmp/icon.svg -resize 48x48 icon-48.png
convert /tmp/icon.svg -resize 128x128 icon-128.png

echo "图标已生成！/ Icons generated!"
