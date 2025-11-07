# Yoopta Editor 实现方案

## 概述

我已经为你创建了基于 Yoopta Editor 的 Notion 风格富文本编辑器实现。Yoopta Editor 是一个专为构建类似 Notion、Craft、Coda 的编辑器而设计的开源 React 库。

## 🎯 Yoopta Editor vs Tiptap

### Yoopta Editor 优势

✅ **类 Notion 体验** - 原生支持 Notion 风格的块编辑器
✅ **开箱即用** - 默认提供完整的插件生态
✅ **命令菜单** - 内置 "/" 命令菜单（ActionMenu）
✅ **拖放支持** - 原生支持块的拖放和嵌套
✅ **待办列表** - 内置 TodoList 插件
✅ **移动优化** - 专为移动端优化
✅ **性能优秀** - 处理大文档性能好

### Tiptap 优势

✅ **成熟稳定** - 更成熟的社区和生态系统
✅ **文档丰富** - 更完善的文档和示例
✅ **自定义能力强** - 高度可定制的架构
✅ **插件丰富** - 大量第三方扩展
✅ **语法高亮** - 已配置好的代码块语法高亮

## 📦 已安装的依赖

```bash
npm install slate slate-react @yoopta/editor @yoopta/paragraph @yoopta/headings @yoopta/blockquote @yoopta/code @yoopta/lists @yoopta/link @yoopta/action-menu-list @yoopta/toolbar @yoopta/link-tool @yoopta/marks
```

### 核心包

- `slate`, `slate-react` - Yoopta 基于的底层编辑器框架
- `@yoopta/editor` - 核心编辑器
- `@yoopta/paragraph` - 段落块
- `@yoopta/headings` - 标题块 (H1, H2, H3)
- `@yoopta/blockquote` - 引用块
- `@yoopta/code` - 代码块（内置语法高亮）
- `@yoopta/lists` - 列表块（有序、无序、待办）
- `@yoopta/link` - 链接支持
- `@yoopta/marks` - 格式化标记（粗体、斜体等）

### 工具包

- `@yoopta/action-menu-list` - "/" 命令菜单
- `@yoopta/toolbar` - 浮动工具栏
- `@yoopta/link-tool` - 链接工具

## 📁 新建文件

### src/components/editor/YooptaNotionEditor.tsx

完整的 Yoopta Editor 实现，包括：
- 编辑器初始化
- 插件配置
- 自动保存功能
- 状态管理集成

### src/components/editor/yoopta-styles.css

Yoopta 专用样式，包括：
- 编辑器容器样式
- 各种块的样式（标题、代码、列表等）
- 工具栏样式
- 命令菜单样式
- 亮色/暗色主题适配

## 🎨 主要功能

### 块类型

1. **段落** - 基础文本块
2. **标题** - H1, H2, H3
3. **引用块** - 引用文本
4. **代码块** - 带语法高亮的代码
5. **列表**:
   - 无序列表（项目符号）
   - 有序列表（编号）
   - 待办列表（可勾选）
6. **链接** - 超链接支持

### 格式化标记

- **粗体** (Cmd/Ctrl + B)
- *斜体* (Cmd/Ctrl + I)
- `行内代码`
- ~~删除线~~
- <u>下划线</u>

### 交互功能

1. **命令菜单** - 输入 "/" 打开块选择菜单
2. **工具栏** - 选中文本显示格式化工具栏
3. **拖放** - 拖动块重新排序
4. **嵌套** - 支持列表嵌套

## 🔄 如何切换到 Yoopta Editor

### 方案 A: 完全替换 Tiptap

如果你想使用 Yoopta Editor，只需修改 [EditorPanel.tsx](src/components/editor/EditorPanel.tsx)：

```typescript
// 将
import { TiptapEditor } from './TiptapEditor'

// 改为
import { YooptaNotionEditor } from './YooptaNotionEditor'

// 将
<TiptapEditor noteId={activeTab.noteId} tabId={activeTab.id} />

// 改为
<YooptaNotionEditor noteId={activeTab.noteId} tabId={activeTab.id} />
```

### 方案 B: 保留两者，让用户选择

可以在设置中添加编辑器类型选项，让用户选择使用哪个编辑器。

## ⚠️ 注意事项

### 数据格式不兼容

**重要**: Yoopta Editor 和 Tiptap 使用不同的数据格式：

- **Tiptap**: 存储 HTML 格式
- **Yoopta**: 存储 JSON 格式（Slate 数据结构）

### 迁移策略

如果从 Tiptap 切换到 Yoopta，需要考虑：

1. **新笔记** - 直接使用 Yoopta 格式
2. **现有笔记** - 可能需要转换（或允许共存）

建议方案：
```typescript
// 检测数据格式
const isYooptaFormat = (content: string) => {
  try {
    const parsed = JSON.parse(content)
    return typeof parsed === 'object' && parsed !== null
  } catch {
    return false
  }
}

// 根据格式选择编辑器
{isYooptaFormat(note.content)
  ? <YooptaNotionEditor ... />
  : <TiptapEditor ... />
}
```

## 🚀 使用方法

### 创建块

1. 输入 **"/"** 打开命令菜单
2. 选择要创建的块类型
3. 或直接输入文本（自动创建段落）

### 格式化文本

1. **选中文本** - 显示浮动工具栏
2. 点击工具栏按钮应用格式
3. 或使用快捷键

### 拖放块

1. 鼠标悬停在块上
2. 拖动左侧的拖动手柄
3. 放到新位置

### 创建列表

1. 输入 "/" 选择列表类型
2. 或直接输入 "-" + 空格（无序列表）
3. 或输入 "1." + 空格（有序列表）
4. 或输入 "[]" + 空格（待办列表）

## 📊 性能对比

| 特性 | Yoopta | Tiptap |
|------|--------|--------|
| 包大小 | 较大（多个插件包） | 中等 |
| 初始化速度 | 快 | 快 |
| 大文档性能 | 优秀 | 良好 |
| 移动体验 | 优秀 | 良好 |
| 学习曲线 | 低（类 Notion） | 中等 |

## 🐛 已知限制

1. **代码语言选择** - Yoopta 的代码块语言选择可能需要额外配置
2. **主题定制** - 某些样式可能需要手动调整
3. **peer dependency 警告** - Slate 版本警告（不影响功能）

## 🔧 自定义建议

### 添加更多块类型

```typescript
import Image from '@yoopta/image'
import Video from '@yoopta/video'
import Table from '@yoopta/table'

const plugins = [
  // ... 现有插件
  Image,
  Video,
  Table,
]
```

### 自定义主题

修改 [yoopta-styles.css](src/components/editor/yoopta-styles.css) 中的 CSS 变量和样式。

### 添加快捷键

```typescript
const editor = createYooptaEditor({
  shortcuts: {
    'Mod-k': () => editor.commands.toggleLink(),
    'Mod-/': () => editor.commands.openActionMenu(),
  },
})
```

## 📚 相关资源

- [Yoopta GitHub](https://github.com/yoopta-editor/Yoopta-Editor)
- [Yoopta 官网](https://yoopta.dev/)
- [在线示例](https://yoopta.dev/examples/withBaseFullSetup)

## ✅ 测试清单

- [ ] 创建新笔记
- [ ] 输入 "/" 测试命令菜单
- [ ] 测试所有块类型（标题、列表、代码等）
- [ ] 测试格式化（粗体、斜体等）
- [ ] 测试自动保存
- [ ] 测试拖放功能
- [ ] 测试待办列表勾选
- [ ] 测试亮色/暗色主题

## 💡 建议

基于你的需求，我推荐：

### 如果你需要：
- ✅ **类 Notion 体验** → 使用 **Yoopta**
- ✅ **待办列表** → 使用 **Yoopta**
- ✅ **命令菜单** → 使用 **Yoopta**
- ✅ **更多自定义** → 使用 **Tiptap**
- ✅ **成熟生态** → 使用 **Tiptap**

### 我的推荐：
由于你提到想要"类似 Notion"的体验，**Yoopta Editor 更适合**你的需求。它专门为此设计，提供开箱即用的 Notion 风格功能。

## 🔄 切换步骤

如果决定使用 Yoopta：

1. 修改 [EditorPanel.tsx](src/components/editor/EditorPanel.tsx)（见上文）
2. 运行 `npm run build` 构建
3. 在 Chrome 中重新加载扩展
4. 测试所有功能

现有的 Tiptap 实现会保留，如果需要随时可以切换回去。

---

**需要我帮你切换到 Yoopta Editor 吗？** 只需说一声，我会立即更新 EditorPanel.tsx！ 🚀
