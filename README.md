# Markdown Notes Chrome Extension

一个功能强大的 Chrome 扩展程序，提供 Markdown 笔记功能，支持树形文件管理和 WebDAV 同步。

A powerful Chrome extension for Markdown note-taking with tree-based file management and WebDAV sync.

## ✨ 功能特性 (Features)

- 📁 **树形文件管理** - 支持文件夹层级结构，轻松组织笔记
- 🖱️ **拖拽排序** - 支持拖拽文件/文件夹重新排序和移动
- 📝 **Markdown 编辑** - 强大的 Yoopta 编辑器，支持 Notion 风格编辑
- 🗂️ **多标签页** - 同时打开多个笔记，快速切换
- 📤 **导出功能** - 支持导出为 Markdown、PDF、PNG、JPEG 格式
- 💾 **本地存储** - 使用 localStorage 存储，数据安全可靠
- ☁️ **WebDAV 同步** - 支持与远程服务器同步（Nextcloud、ownCloud 等）
- 🎨 **主题切换** - 支持亮色/暗色主题
- ⚡ **自动保存** - 编辑内容自动保存，不用担心数据丢失

## 🚀 开发 (Development)

### 环境要求

- Node.js 16+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

在浏览器中访问 `http://localhost:5173` 预览

### 构建

```bash
npm run build
```

构建输出在 `dist/` 目录

### 类型检查

```bash
npm run lint
```

## 📦 安装到 Chrome (Install to Chrome)

1. 构建项目：`npm run build`
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist/` 目录

## 💡 使用方式

**扩展图标模式**：点击浏览器扩展栏的 Markdown Notes 图标，应用会在新标签页中打开！

## 🎯 使用说明 (Usage)

### 打开应用

- 点击 Chrome 扩展栏的 Markdown Notes 图标
- 应用会在新标签页中打开

### 创建笔记

1. 点击左侧工具栏的 ➕ 图标
2. 输入笔记名称
3. 开始编辑

### 创建文件夹

1. 点击左侧工具栏的 📁 图标
2. 输入文件夹名称
3. 拖拽笔记到文件夹进行整理

### 拖拽排序

- 将鼠标悬停在文件/文件夹上，会显示拖拽手柄
- 拖动文件到文件夹上可以移入该文件夹
- 拖动文件到其他文件旁边可以重新排序
- 支持跨文件夹移动

### 导出笔记

1. 打开要导出的笔记
2. 点击顶部的导出按钮
3. 选择导出格式：
   - Markdown (.md)
   - PDF (.pdf)
   - PNG 图片
   - JPEG 图片

### WebDAV 同步

1. 点击顶部工具栏的云图标
2. 配置 WebDAV 服务器信息：
   - 服务器地址
   - 用户名
   - 密码
   - 远程路径
3. 点击"测试连接"验证配置
4. 保存配置
5. 点击同步按钮开始同步

### 主题切换

点击顶部工具栏的月亮/太阳图标切换主题

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **状态管理**: Zustand
- **UI 组件**: shadcn/ui + Radix UI
- **样式系统**: Tailwind CSS
- **Markdown 编辑器**: Yoopta Editor (Notion-like editor)
- **拖拽功能**: @dnd-kit
- **导出功能**: jsPDF + html2canvas
- **WebDAV 客户端**: webdav
- **图标**: Lucide React

## 📁 项目结构 (Project Structure)

```
src/
├── components/          # UI 组件
│   ├── editor/         # 编辑器相关组件
│   ├── sidebar/        # 侧边栏组件
│   ├── sync/           # 同步相关组件
│   └── ui/             # shadcn UI 组件
├── stores/             # Zustand 状态管理
│   ├── notesStore.ts   # 笔记状态
│   ├── editorStore.ts  # 编辑器状态
│   └── syncStore.ts    # 同步状态
├── lib/                # 工具库
│   ├── storage.ts      # localStorage 封装
│   ├── webdav.ts       # WebDAV 客户端
│   ├── markdown.ts     # Markdown 工具
│   └── utils.ts        # 通用工具
├── types/              # TypeScript 类型定义
└── App.tsx             # 主应用组件
```

## 🔒 数据存储 (Data Storage)

所有笔记数据存储在浏览器的 localStorage 中：

- `notes-tree`: 文件树结构
- `note-{id}`: 单个笔记内容
- `webdav-config`: WebDAV 配置
- `theme`: 主题设置

## 🤝 贡献 (Contributing)

欢迎提交 Issue 和 Pull Request！

## 📄 许可证 (License)

MIT License

## 🙏 致谢 (Acknowledgments)

- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor) - Markdown 编辑器
- [Zustand](https://github.com/pmndrs/zustand) - 简单高效的状态管理
