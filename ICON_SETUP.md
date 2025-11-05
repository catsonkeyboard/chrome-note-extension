# 图标设置指南 (Icon Setup Guide)

## 问题 (Problem)

Chrome扩展需要PNG格式的图标文件，但项目中还没有创建这些文件。

## 快速解决方案 (Quick Solutions)

### 方法1: 使用浏览器生成（推荐） ⭐

1. 在浏览器中打开 `scripts/generate-icons.html`
   ```bash
   # 在项目根目录执行
   open scripts/generate-icons.html
   # 或在浏览器中打开文件
   ```

2. 点击三个按钮下载图标：
   - 生成 16x16
   - 生成 48x48
   - 生成 128x128

3. 将下载的图标文件移动到项目目录：
   ```bash
   mv ~/Downloads/icon-16.png public/icons/
   mv ~/Downloads/icon-48.png public/icons/
   mv ~/Downloads/icon-128.png public/icons/

   # 复制到 dist 目录
   cp public/icons/*.png dist/icons/
   ```

### 方法2: 使用在线工具

访问以下任一网站上传logo或生成图标：

- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- https://www.iconfinder.com/icon-sets/featured/free

下载后将文件重命名为：
- `icon-16.png`
- `icon-48.png`
- `icon-128.png`

并放入 `public/icons/` 和 `dist/icons/` 目录

### 方法3: 使用 ImageMagick（如果已安装）

```bash
# 检查是否安装
convert --version

# 如果已安装，运行
cd public/icons
for size in 16 48 128; do
  convert icon-${size}.svg icon-${size}.png
done

# 复制到 dist
cp *.png ../../dist/icons/
```

### 方法4: 使用现有图片

如果你有现有的logo或图片：

```bash
# 使用在线工具调整大小：
# https://www.iloveimg.com/resize-image
# https://imageresizer.com/

# 或使用 ImageMagick
convert your-logo.png -resize 16x16 public/icons/icon-16.png
convert your-logo.png -resize 48x48 public/icons/icon-48.png
convert your-logo.png -resize 128x128 public/icons/icon-128.png

# 复制到 dist
cp public/icons/*.png dist/icons/
```

## 验证安装 (Verify Installation)

检查文件是否存在：

```bash
ls -lh dist/icons/
```

应该看到：
```
icon-16.png
icon-48.png
icon-128.png
```

## 重新加载扩展 (Reload Extension)

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 找到你的扩展
4. 点击 "重新加载" 按钮 🔄

## 临时解决方案：修改 manifest.json (Temporary Solution)

如果暂时不想处理图标，可以移除 manifest.json 中的图标引用：

```bash
# 备份原文件
cp public/manifest.json public/manifest.json.bak

# 编辑 manifest.json，移除 icons 和 default_icon 配置
```

然后重新构建：
```bash
npm run build
```

---

## 自动化方案 (Automated Solution)

如果需要在构建时自动生成图标，可以：

1. 安装 sharp 包：
   ```bash
   npm install -D sharp
   ```

2. 更新 vite.config.ts 添加图标生成插件

3. 重新构建：
   ```bash
   npm run build
   ```

---

**推荐**: 使用方法1（浏览器生成），最简单快捷！🚀
