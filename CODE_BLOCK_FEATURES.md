# 代码块功能说明

## 概述

已为 Tiptap 编辑器添加了美化的代码块功能，支持语法高亮和现代化的视觉设计。

## 新增功能

### ✨ 代码块高亮显示

- 使用 `@tiptap/extension-code-block-lowlight` 实现语法高亮
- 基于 `lowlight` (highlight.js 的轻量级版本)
- 支持 40+ 种常见编程语言

### 🎯 语言选择器

- **交互式下拉菜单**: 悬停代码块时显示语言选择器
- **28 种语言**: 涵盖最常用的编程语言
- **实时更新**: 选择语言后立即应用语法高亮
- **语言标签**: 显示当前代码块的语言
- **主题适配**: 完美支持亮色和暗色主题

### 🎨 美化的代码块样式

#### 暗色主题
- 渐变深色背景 (#1e1e1e → #2d2d2d)
- 模拟代码编辑器的头部区域
- 圆角边框和阴影效果
- 自定义语法高亮配色（Material Theme 风格）

#### 亮色主题
- 清新浅色渐变背景 (#f8f9fa → #e9ecef)
- 适配的亮色语法高亮
- 保持一致的视觉风格

### 🖱️ 交互功能

- **工具栏按钮**：点击 `</>` 图标插入代码块
- **键盘快捷键**：`Cmd/Ctrl + Alt + C` 切换代码块
- **自定义滚动条**：美化的横向滚动条样式

## 技术实现

### 安装的依赖

```bash
npm install @tiptap/extension-code-block-lowlight lowlight highlight.js
```

### 配置详情

#### TiptapEditor.tsx 更新

```typescript
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import 'highlight.js/styles/github-dark.css'

const lowlight = createLowlight(common)

// 在 extensions 中配置
CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: 'plaintext',
})
```

#### MenuBar.tsx 更新

添加了代码块按钮：
- 图标：`Code2` (来自 lucide-react)
- 功能：切换代码块 `editor.chain().focus().toggleCodeBlock().run()`
- 激活状态：`editor.isActive('codeBlock')`

#### tiptap-styles.css 新增样式

**代码块容器**：
- 渐变背景
- 模拟头部装饰
- 圆角和阴影
- 响应式设计

**语法高亮配色**：
- 关键字：紫色 (#c792ea / #7c3aed)
- 字符串：绿色 (#c3e88d / #059669)
- 数字：橙色/红色 (#f78c6c / #dc2626)
- 函数：蓝色 (#82aaff / #2563eb)
- 注释：灰色 + 斜体

## 支持的语言

Lowlight 的 `common` 包包含以下常见语言：

- **Web**: JavaScript, TypeScript, HTML, CSS, JSON
- **后端**: Python, Java, C, C++, C#, PHP, Ruby, Go, Rust
- **数据**: SQL, YAML, XML
- **脚本**: Bash, Shell, PowerShell
- **标记**: Markdown
- **其他**: Dockerfile, Nginx, Apache, 等等

## 使用方法

### 插入代码块

1. **通过工具栏**：点击工具栏中的 `</>` 按钮
2. **通过键盘**：按下 `Cmd/Ctrl + Alt + C`
3. **转换现有文本**：选中文本后点击代码块按钮

### 选择编程语言

1. **悬停鼠标** 在代码块上
2. 头部会出现 **语言选择下拉菜单**
3. 从 28 种语言中选择需要的语言
4. 语法高亮 **立即生效**

### 输入代码

在代码块中直接输入代码，语法高亮会自动应用。

### 退出代码块

- 按两次 `Enter` 键退出代码块
- 或使用方向键移动到代码块外

### 删除代码块

- 将光标放在代码块开头，按 `Backspace`
- 或选中整个代码块，按 `Delete`

## 样式特性

### 代码块头部

包含交互式语言选择器：
- **悬停前**: 显示当前语言标签
- **悬停后**: 显示语言选择下拉菜单
- 半透明渐变背景
- 底部分割线
- 增强视觉层次感

### 自定义滚动条

- **高度**：8px
- **轨道**：半透明背景
- **滑块**：悬停时变亮
- **圆角**：4px

### 字体选择

优先使用等宽编程字体：
1. Fira Code (推荐，支持连字)
2. Monaco
3. Menlo
4. Ubuntu Mono
5. Consolas
6. Courier New

### Tab 宽度

设置为 2 个空格，符合现代编程习惯。

## 自定义建议

### 添加更多语言

如需支持特定语言，可以手动注册：

```typescript
import { createLowlight } from 'lowlight'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'

const lowlight = createLowlight()
lowlight.register('typescript', typescript)
lowlight.register('python', python)
```

### 更改配色方案

在 `TiptapEditor.tsx` 中更改 highlight.js 主题：

```typescript
// 其他可选主题
import 'highlight.js/styles/monokai.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/styles/vs2015.css'
```

### 添加行号

可以安装额外的扩展：

```bash
npm install @tiptap/extension-code-block-line-numbers
```

### 添加语言选择器

可以创建自定义节点视图，在代码块顶部添加语言下拉菜单。

## 示例代码块

在编辑器中，代码块看起来像这样：

**JavaScript 示例**：
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`)
  return true
}

const user = 'World'
greet(user)
```

**Python 示例**：
```python
def calculate_sum(numbers):
    """计算数字列表的总和"""
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(f"总和是: {result}")
```

**TypeScript 示例**：
```typescript
interface User {
  id: number
  name: string
  email: string
}

const createUser = (data: Partial<User>): User => {
  return {
    id: Date.now(),
    name: data.name || 'Anonymous',
    email: data.email || 'no-email@example.com',
  }
}
```

## 性能考虑

- ✅ **按需加载**：只加载 common 语言包，体积较小
- ✅ **客户端渲染**：高亮在浏览器端完成
- ✅ **缓存友好**：highlight.js 使用缓存机制
- ⚠️ **大文件**：超长代码块可能影响性能

## 已知限制

1. **语言自动检测**：需要手动选择语言（未来功能）
2. **复制按钮**：暂未添加一键复制功能
3. **行号**：默认未启用行号显示
4. **主题切换**：highlight.js 主题固定，不随系统主题动态切换

## 文件清单

**新建文件**：
- [src/components/editor/CodeBlockComponent.tsx](src/components/editor/CodeBlockComponent.tsx) - 自定义代码块组件
- [src/components/editor/code-block-styles.css](src/components/editor/code-block-styles.css) - 代码块专用样式

**修改的文件**：
- [src/components/editor/TiptapEditor.tsx](src/components/editor/TiptapEditor.tsx) - 配置自定义节点视图
- [src/components/editor/MenuBar.tsx](src/components/editor/MenuBar.tsx) - 添加代码块按钮
- [src/components/editor/tiptap-styles.css](src/components/editor/tiptap-styles.css) - 清理旧代码块样式

**依赖更新**：
- `@tiptap/extension-code-block-lowlight` - Tiptap 代码块扩展
- `lowlight` - 语法高亮引擎
- `highlight.js` - 高亮样式主题

## 测试清单

- ✅ 安装依赖成功
- ✅ TypeScript 编译通过
- ✅ 项目构建成功
- ✅ 工具栏显示代码块按钮
- ✅ 代码块样式美化
- ✅ 语法高亮正常工作
- ✅ 亮色/暗色主题适配

## 参考资料

- [Tiptap CodeBlock Extension](https://tiptap.dev/api/nodes/code-block)
- [Tiptap CodeBlockLowlight](https://tiptap.dev/api/nodes/code-block-lowlight)
- [Lowlight Documentation](https://github.com/wooorm/lowlight)
- [Highlight.js Themes](https://github.com/highlightjs/highlight.js/tree/main/src/styles)
