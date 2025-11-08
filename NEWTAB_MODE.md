# 新标签页模式说明 (New Tab Mode Guide)

## ✨ 新功能：新标签页显示

扩展已修改为**新标签页模式**，每次打开新标签页时自动显示Markdown笔记应用。

---

## 🚀 如何使用

### 1. 重新加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 找到 "Notes" 扩展
4. 点击 **"重新加载"** 按钮 🔄

### 2. 打开新标签页

- 点击浏览器的 **"+"** 按钮
- 或按快捷键 **Ctrl+T** (Windows/Linux) / **Cmd+T** (Mac)
- Markdown笔记应用会自动显示！

---

## 📋 功能对比

### 新标签页模式（当前）✅
- ✅ 打开新标签页即可使用
- ✅ 全屏显示，更大空间
- ✅ 无需点击图标
- ✅ 自动加载，更方便
- ⚠️ 会替换Chrome默认新标签页

### 弹窗模式（之前）
- 需要点击扩展图标
- 小窗口显示（约400x600px）
- 适合快速查看
- 不影响新标签页

---

## 🔄 切换回弹窗模式

如果你想切换回弹窗模式，修改 `public/manifest.json`：

```json
{
  "manifest_version": 3,
  "name": "Notes",
  "version": "1.0.0",
  "description": "A powerful notion-like note-taking extension with tree view and WebDAV sync",
  "action": {
    "default_popup": "index.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  ...
}
```

删除 `chrome_url_overrides` 部分，然后重新构建：
```bash
npm run build
```

---

## 🎯 两种模式都想要？

你可以同时支持两种模式：

### 选项1: 新标签页 + 点击图标打开新页面

修改 `public/manifest.json`：

```json
{
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "action": {
    "default_title": "打开 Notes"
  },
  ...
}
```

添加 `public/background.js`：
```javascript
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});
```

然后在 manifest.json 添加：
```json
{
  "background": {
    "service_worker": "background.js"
  },
  ...
}
```

### 选项2: 独立页面（不占用新标签页）

如果不想占用新标签页，可以创建独立入口：

1. 移除 `chrome_url_overrides`
2. 添加 background.js（如上）
3. 点击扩展图标会在新标签页中打开应用

---

## 📱 快捷键访问（推荐）

为扩展添加自定义快捷键：

1. 访问 `chrome://extensions/shortcuts`
2. 找到 "Notes"
3. 设置快捷键（例如：**Alt+M**）
4. 按快捷键快速打开应用

---

## 💡 提示

### 优势
- ✅ 更大的显示空间
- ✅ 更方便的访问
- ✅ 像使用独立应用一样

### 注意事项
- ⚠️ 会替换Chrome默认新标签页
- ⚠️ 如果你习惯使用默认新标签页，可能需要调整

---

## 🔧 技术说明

修改内容：
- ✅ `public/manifest.json` - 添加 `chrome_url_overrides.newtab`
- ✅ 移除 `action.default_popup`
- ✅ 保留扩展图标（用于识别）

---

**享受全新的使用体验！** 🎉
