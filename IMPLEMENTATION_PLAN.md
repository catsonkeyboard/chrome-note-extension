# Chrome Markdown Note Extension - Implementation Plan

## 项目功能说明 (Project Feature Description)

### 核心功能 (Core Features)

1. **双面板布局 (Dual-Panel Layout)**
   - 左侧：树形文件列表，支持文件夹层级结构
   - 右侧：标签页式Markdown编辑器，支持多文档同时打开

2. **Markdown编辑 (Markdown Editing)**
   - 实时编辑Markdown内容
   - 支持Markdown语法高亮
   - 实时预览功能（可选）

3. **文件管理 (File Management)**
   - 创建新笔记/文件夹
   - 重命名文件/文件夹
   - 删除文件/文件夹
   - 拖拽排序和移动（可选扩展功能）

4. **数据存储 (Data Storage)**
   - 使用localStorage存储笔记内容
   - 自动保存机制
   - 数据导出/导入功能

5. **WebDAV同步 (WebDAV Sync)**
   - 配置WebDAV服务器连接
   - 手动触发同步
   - 冲突检测和解决
   - 同步状态显示

6. **美观界面 (Beautiful UI)**
   - 使用shadcn/ui组件库
   - Tailwind CSS样式系统
   - 响应式设计
   - 暗色/亮色主题切换

---

## 实施步骤 (Implementation Steps)

### Phase 1: 项目初始化 (Project Initialization)

#### 1.1 配置开发环境
- [ ] 初始化Vite + React + TypeScript项目
- [ ] 配置Tailwind CSS
- [ ] 配置shadcn/ui
- [ ] 创建Chrome Extension manifest.json
- [ ] 设置项目目录结构

#### 1.2 基础配置文件
- [ ] vite.config.ts - Vite配置
- [ ] tailwind.config.js - Tailwind配置
- [ ] tsconfig.json - TypeScript配置
- [ ] components.json - shadcn配置

---

### Phase 2: 核心架构搭建 (Core Architecture)

#### 2.1 类型定义
创建 `src/types/index.ts`:
```typescript
- Note: 笔记数据结构
- Folder: 文件夹结构
- TreeNode: 树节点（文件或文件夹）
- Tab: 标签页数据
- WebDAVConfig: WebDAV配置
```

#### 2.2 Zustand状态管理
创建三个主要store:

**notesStore.ts**:
- 文件树状态
- 笔记内容缓存
- CRUD操作方法
- localStorage持久化

**editorStore.ts**:
- 打开的标签页列表
- 当前活动标签
- 标签操作方法

**syncStore.ts**:
- WebDAV连接配置
- 同步状态
- 同步操作方法

#### 2.3 工具库
**lib/storage.ts**:
- localStorage封装
- 数据序列化/反序列化
- 导出/导入功能

**lib/webdav.ts**:
- WebDAV客户端
- 上传/下载方法
- 冲突检测

**lib/markdown.ts**:
- Markdown解析
- 语法高亮辅助

---

### Phase 3: UI组件开发 (UI Component Development)

#### 3.1 基础UI组件 (使用shadcn)
安装需要的shadcn组件:
- [ ] Button
- [ ] Input
- [ ] Dialog
- [ ] Tabs
- [ ] Tree (或自定义)
- [ ] Separator
- [ ] ScrollArea
- [ ] DropdownMenu
- [ ] Tooltip
- [ ] Badge

#### 3.2 左侧边栏组件
**components/sidebar/FileTree.tsx**:
- 递归渲染树形结构
- 文件/文件夹图标
- 展开/折叠功能
- 右键菜单

**components/sidebar/FileItem.tsx**:
- 单个文件/文件夹项
- 选中状态
- 点击事件处理
- 重命名输入框

**components/sidebar/NewFileDialog.tsx**:
- 创建新笔记对话框
- 创建新文件夹对话框
- 表单验证

**components/sidebar/Sidebar.tsx**:
- 侧边栏容器
- 工具栏（新建、搜索等）
- 滚动区域

#### 3.3 编辑器组件
**components/editor/TabBar.tsx**:
- 标签页列表渲染
- 标签切换
- 关闭标签按钮
- 标签滚动

**components/editor/MarkdownEditor.tsx**:
- Markdown编辑区域（使用textarea或富文本编辑器）
- 自动保存
- 快捷键支持
- 工具栏（加粗、斜体、链接等）

**components/editor/Preview.tsx**:
- Markdown渲染预览
- 实时更新
- 代码高亮

**components/editor/EditorPanel.tsx**:
- 编辑器容器
- 分栏布局（编辑/预览）
- 空状态显示

#### 3.4 同步组件
**components/sync/SyncSettings.tsx**:
- WebDAV服务器配置表单
- 连接测试
- 保存配置

**components/sync/SyncStatus.tsx**:
- 同步状态指示器
- 手动同步按钮
- 最后同步时间

#### 3.5 主布局
**components/Layout.tsx**:
- 整体布局容器
- 左右分栏
- 响应式设计
- 顶部工具栏（设置、同步等）

---

### Phase 4: Chrome Extension集成 (Chrome Extension Integration)

#### 4.1 Manifest配置
**public/manifest.json**:
```json
{
  "manifest_version": 3,
  "name": "Markdown Notes",
  "version": "1.0.0",
  "description": "A markdown note-taking extension",
  "action": {
    "default_popup": "index.html"
  },
  "permissions": ["storage", "unlimitedStorage"],
  "icons": { ... }
}
```

#### 4.2 Extension特定功能
- [ ] popup页面集成
- [ ] 图标和资源
- [ ] 权限处理
- [ ] 浏览器存储API（可选，作为localStorage备份）

---

### Phase 5: 数据持久化与同步 (Data Persistence & Sync)

#### 5.1 localStorage实现
- [ ] 自动保存机制
- [ ] 数据结构设计
- [ ] 数据迁移方案

#### 5.2 WebDAV同步
- [ ] 选择WebDAV客户端库（如：webdav）
- [ ] 实现上传/下载逻辑
- [ ] 冲突检测算法
- [ ] 错误处理和重试

#### 5.3 数据导入/导出
- [ ] 导出所有笔记为JSON
- [ ] 导入JSON数据
- [ ] 导出单个笔记为.md文件

---

### Phase 6: 增强功能 (Enhanced Features)

#### 6.1 搜索功能
- [ ] 全文搜索
- [ ] 文件名搜索
- [ ] 搜索结果高亮

#### 6.2 主题系统
- [ ] 暗色/亮色主题
- [ ] 主题切换按钮
- [ ] 主题持久化

#### 6.3 快捷键
- [ ] 新建笔记 (Ctrl+N)
- [ ] 保存 (Ctrl+S)
- [ ] 搜索 (Ctrl+F)
- [ ] 切换标签 (Ctrl+Tab)

#### 6.4 Markdown增强
- [ ] 集成Markdown编辑器库（如：react-markdown, @uiw/react-md-editor）
- [ ] 代码块语法高亮
- [ ] 数学公式支持（KaTeX）
- [ ] 图片上传和显示

---

### Phase 7: 测试与优化 (Testing & Optimization)

#### 7.1 功能测试
- [ ] 文件CRUD操作测试
- [ ] 标签页管理测试
- [ ] localStorage存储测试
- [ ] WebDAV同步测试

#### 7.2 性能优化
- [ ] 大文件处理优化
- [ ] 虚拟滚动（大量文件）
- [ ] 防抖/节流
- [ ] 代码分割

#### 7.3 用户体验
- [ ] 加载状态显示
- [ ] 错误提示
- [ ] 确认对话框（删除等操作）
- [ ] 快捷操作提示

---

### Phase 8: 打包与发布 (Build & Release)

#### 8.1 构建配置
- [ ] 生产环境构建优化
- [ ] 代码压缩和混淆
- [ ] Source map配置

#### 8.2 Chrome扩展打包
- [ ] 创建.crx包
- [ ] 准备Chrome Web Store资源
- [ ] 编写用户文档

---

## 技术栈总结 (Technology Stack Summary)

- **前端框架**: React 18
- **构建工具**: Vite
- **类型系统**: TypeScript
- **状态管理**: Zustand
- **UI组件库**: shadcn/ui
- **样式系统**: Tailwind CSS
- **Markdown**: react-markdown / @uiw/react-md-editor
- **WebDAV客户端**: webdav
- **Chrome Extension**: Manifest V3

---

## 开发顺序建议 (Recommended Development Order)

1. ✅ 创建项目文档（本文档）
2. 🔄 Phase 1: 初始化项目和配置
3. 🔄 Phase 2: 创建类型定义和Store
4. 🔄 Phase 3: 开发基础UI组件
5. 🔄 Phase 4: 实现文件管理功能
6. 🔄 Phase 5: 实现编辑器功能
7. 🔄 Phase 6: 集成localStorage
8. 🔄 Phase 7: 实现WebDAV同步
9. 🔄 Phase 8: 增强功能和优化
10. 🔄 Phase 9: Chrome Extension适配
11. 🔄 Phase 10: 测试和打包

每个阶段都应该进行测试，确保功能正常后再进入下一阶段。
