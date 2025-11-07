# Tiptap 迁移说明

## 概述

已成功将笔记编辑器从 `@uiw/react-md-editor` (Markdown编辑器) 迁移到 **Tiptap** (富文本编辑器)。

## 所做更改

### 1. 安装的依赖

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-typography
```

已安装的 Tiptap 包：
- `@tiptap/react` - React 集成
- `@tiptap/pm` - ProseMirror 核心
- `@tiptap/starter-kit` - 包含基本扩展（标题、列表、粗体、斜体等）
- `@tiptap/extension-placeholder` - 占位符文本支持
- `@tiptap/extension-typography` - 智能排版功能
- `@tiptap/extension-code-block-lowlight` - 代码块语法高亮
- `lowlight` - 轻量级语法高亮引擎
- `highlight.js` - 代码高亮样式主题

### 2. 新建文件

#### `src/components/editor/TiptapEditor.tsx`
替换了原来的 `MarkdownEditor.tsx`，实现了：
- 富文本编辑功能
- 自动保存（1秒防抖）
- 标签脏数据标记
- 笔记内容加载和更新

#### `src/components/editor/MenuBar.tsx`
新的工具栏组件，提供：
- 文本格式化（粗体、斜体、删除线、行内代码）
- 代码块（带语法高亮）
- 标题级别（H1、H2、H3）
- 列表（无序、有序）
- 引用块
- 分割线
- 撤销/重做功能

#### `src/components/editor/tiptap-styles.css`
自定义 Tiptap 编辑器样式：
- 标题样式
- 段落和列表样式
- 美化的代码块样式（渐变背景、语法高亮）
- 引用块样式
- 亮色/暗色主题支持
- 自定义滚动条样式

### 3. 修改的文件

#### `src/components/editor/EditorPanel.tsx`
- 导入改为使用 `TiptapEditor` 而不是 `MarkdownEditor`
- 欢迎消息更新为"欢迎使用富文本笔记"

## Tiptap 功能特性

### 已配置的扩展

1. **StarterKit** - 包含基本编辑功能：
   - 文档结构
   - 段落
   - 文本样式（粗体、斜体、删除线）
   - 标题（1-6级）
   - 列表（有序和无序）
   - 引用块
   - 代码和代码块
   - 水平分割线
   - 硬换行
   - 历史记录（撤销/重做）

2. **Placeholder** - 显示占位符文本"开始写作..."

3. **Typography** - 智能排版，自动替换：
   - 引号智能替换
   - 省略号
   - 破折号
   - 等等

4. **CodeBlockLowlight** - 代码块语法高亮：
   - 支持 40+ 种编程语言
   - 基于 lowlight (highlight.js)
   - 美化的代码块样式
   - 亮色/暗色主题适配

### 编辑器特性

- ✅ 所见即所得（WYSIWYG）编辑
- ✅ 丰富的格式化工具栏
- ✅ 代码块语法高亮（支持 40+ 种语言）
- ✅ 键盘快捷键支持
- ✅ 自动保存（1秒防抖）
- ✅ 撤销/重做
- ✅ 深色模式支持
- ✅ 响应式设计
- ✅ 与现有的 Zustand 状态管理集成

## 工具栏快捷键

Tiptap 支持标准的键盘快捷键：

- `Cmd/Ctrl + B` - 粗体
- `Cmd/Ctrl + I` - 斜体
- `Cmd/Ctrl + Shift + S` - 删除线
- `Cmd/Ctrl + E` - 行内代码
- `Cmd/Ctrl + Alt + C` - 代码块
- `Cmd/Ctrl + Shift + 7` - 有序列表
- `Cmd/Ctrl + Shift + 8` - 无序列表
- `Cmd/Ctrl + Shift + B` - 引用块
- `Cmd/Ctrl + Z` - 撤销
- `Cmd/Ctrl + Shift + Z` - 重做

## 数据存储

笔记内容现在以 **HTML 格式**存储（而不是 Markdown）：
- 存储在 Zustand store 的 `content` 字段中
- 自动保存到 localStorage
- 通过 WebDAV 同步（如果已配置）

## 后续优化建议

如果需要进一步增强编辑器，可以考虑添加：

1. **更多扩展**：
   - `@tiptap/extension-link` - 链接支持
   - `@tiptap/extension-image` - 图片支持
   - `@tiptap/extension-table` - 表格支持
   - `@tiptap/extension-task-list` - 任务列表（待办事项）
   - `@tiptap/extension-highlight` - 文本高亮
   - `@tiptap/extension-text-align` - 文本对齐

2. **Markdown 支持**（如果需要）：
   - `@tiptap/extension-markdown` - Markdown 输入/输出
   - 可以实现 Markdown 和富文本之间的转换

3. **协作功能**：
   - `@tiptap/extension-collaboration` - 实时协作编辑

4. **AI 功能**：
   - Tiptap 提供 AI 扩展用于智能写作辅助

## 测试建议

启动开发服务器测试新的编辑器：

```bash
npm run dev
```

在 Chrome 中加载扩展：
1. 运行 `npm run build`
2. 打开 Chrome 扩展页面 (`chrome://extensions/`)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist/` 文件夹

测试以下功能：
- ✅ 创建新笔记
- ✅ 使用工具栏格式化文本
- ✅ 插入代码块并测试语法高亮
- ✅ 测试键盘快捷键
- ✅ 验证自动保存
- ✅ 切换标签页
- ✅ 测试亮色/暗色主题
- ✅ 测试撤销/重做

## 技术栈

- **Tiptap** - 基于 ProseMirror 的无头富文本编辑器
- **React** - UI 框架
- **Zustand** - 状态管理
- **Tailwind CSS** - 样式
- **shadcn/ui** - UI 组件

## 参考资料

- [Tiptap 官方文档](https://tiptap.dev/)
- [Tiptap React 指南](https://tiptap.dev/installation/react)
- [Tiptap 扩展列表](https://tiptap.dev/extensions)
