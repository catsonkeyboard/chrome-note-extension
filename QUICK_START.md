# 快速开始指南 (Quick Start Guide)

## ✅ 问题已解决！

图标文件问题已修复。临时占位符图标已自动创建。

## 🚀 立即使用

### 1. 重新加载Chrome扩展

扩展现在可以正常加载了！

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 找到 "Markdown Notes" 扩展
4. 点击 **"重新加载"** 按钮 🔄

### 2. 开始使用

点击浏览器工具栏中的扩展图标，开始记笔记！

---

## 🎨 创建更好的图标（可选）

当前使用的是1x1像素的占位符。如需更好看的图标：

### 方法1: 浏览器生成（最简单）⭐

1. 打开文件: `scripts/generate-icons.html`
   - 双击文件，或
   - 拖到浏览器窗口

2. 点击三个按钮下载PNG图标

3. 替换图标：
   ```bash
   mv ~/Downloads/icon-*.png public/icons/
   npm run build
   ```

### 方法2: 在线工具

访问 https://www.favicon-generator.org/

1. 上传图片或创建新图标
2. 下载生成的图标包
3. 将 `icon-16.png`, `icon-48.png`, `icon-128.png` 复制到:
   - `public/icons/`
   - `dist/icons/`

### 方法3: 使用现有Logo

```bash
# 如果有 ImageMagick
convert your-logo.png -resize 16x16 public/icons/icon-16.png
convert your-logo.png -resize 48x48 public/icons/icon-48.png
convert your-logo.png -resize 128x128 public/icons/icon-128.png

# 重新构建
npm run build
```

---

## 📝 常用命令

```bash
# 开发模式
npm run dev

# 构建扩展
npm run build

# 生成占位符图标（如果删除了）
npm run icons

# 类型检查
npm run lint
```

---

## 🎯 功能特点

- ✅ 树形文件管理
- ✅ Markdown编辑器
- ✅ 多标签页
- ✅ 自动保存
- ✅ WebDAV同步
- ✅ 暗色主题
- ✅ 本地存储

---

## 📚 更多信息

- **使用文档**: 查看 `README.md`
- **开发指南**: 查看 `CLAUDE.md`
- **图标设置**: 查看 `ICON_SETUP.md`
- **项目总结**: 查看 `PROJECT_SUMMARY.md`

---

**现在就开始使用吧！** 🎉
