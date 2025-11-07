# 代码块语言选择器功能

## 概述

为代码块添加了交互式语言选择器，用户可以为每个代码块设置不同的编程语言，实现针对不同语言的语法高亮。

## 🎯 新增功能

### 语言选择下拉菜单

- **位置**: 代码块头部
- **触发方式**: 鼠标悬停在代码块上时显示
- **功能**: 从28种常见编程语言中选择
- **实时更新**: 选择语言后立即应用语法高亮

### 语言显示标签

- **默认显示**: 右上角显示当前语言（小号灰色文字）
- **悬停时**: 语言标签隐藏，下拉菜单出现
- **视觉反馈**: 清晰指示当前代码块的语言

## 📋 支持的语言列表

代码块支持以下 28 种编程语言：

### Web 开发
- **JavaScript** - 最流行的网页脚本语言
- **TypeScript** - JavaScript 的超集，添加类型系统
- **HTML** - 网页标记语言
- **CSS** - 样式表语言
- **SCSS** - CSS 预处理器

### 后端语言
- **Python** - 通用编程语言
- **Java** - 企业级编程语言
- **C++** - 高性能系统编程语言
- **C** - 底层系统编程语言
- **C#** - .NET 平台语言
- **PHP** - 服务器端脚本语言
- **Ruby** - 优雅的动态语言
- **Go** - Google 开发的系统语言
- **Rust** - 内存安全的系统编程语言
- **Swift** - Apple 生态系统语言
- **Kotlin** - 现代 JVM 语言

### 数据和配置
- **JSON** - JavaScript 对象表示法
- **XML** - 可扩展标记语言
- **YAML** - 人类可读的数据序列化格式
- **SQL** - 结构化查询语言
- **GraphQL** - API 查询语言

### 脚本和工具
- **Bash** - Unix shell 脚本
- **Shell** - 通用 shell 脚本
- **PowerShell** - Windows 自动化框架
- **Dockerfile** - Docker 容器配置
- **Nginx** - Nginx 服务器配置

### 其他
- **Markdown** - 轻量级标记语言
- **Plain Text** - 纯文本（无高亮）

## 💡 使用方法

### 创建代码块

1. 点击工具栏中的 `</>` 按钮
2. 或使用快捷键 `Cmd/Ctrl + Alt + C`
3. 代码块默认语言为 **Plain Text**

### 选择语言

1. **鼠标悬停** 在代码块上
2. 头部会出现 **语言选择下拉菜单**
3. 点击下拉菜单，选择需要的语言
4. 语法高亮 **立即生效**

### 查看当前语言

- 不悬停时，代码块右上角显示当前语言名称
- 例如：`JAVASCRIPT`、`PYTHON`、`HTML` 等

## 🎨 视觉设计

### 语言选择器样式

**外观**：
- 半透明深色背景
- 圆角边框
- 下拉箭头图标
- 平滑的悬停效果

**动画**：
- 淡入动画 (fadeIn)
- 0.2 秒过渡效果
- 向上 2px 的位移

**交互**：
- 悬停时背景变亮
- 聚焦时蓝色边框高亮
- 平滑的过渡动画

### 语言标签样式

- **字体大小**: 0.75em
- **颜色**: 半透明灰色
- **字体**: 等宽编程字体
- **样式**: 大写字母 + 字母间距

### 主题适配

#### 暗色主题
- 深色半透明背景 `rgba(255, 255, 255, 0.1)`
- 白色文字 `#e4e4e7`
- 亮色边框悬停效果

#### 亮色主题
- 浅色半透明背景 `rgba(0, 0, 0, 0.05)`
- 深色文字 `#1f2937`
- 深色边框悬停效果

## 🔧 技术实现

### 自定义 React 节点视图

创建了 [CodeBlockComponent.tsx](src/components/editor/CodeBlockComponent.tsx)：

```typescript
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export const CodeBlockComponent = ({ node, updateAttributes }) => {
  const currentLanguage = node.attrs.language || 'plaintext'

  return (
    <NodeViewWrapper>
      <select onChange={(e) => updateAttributes({ language: e.target.value })}>
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <pre>
        <code>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  )
}
```

### Tiptap 扩展配置

在 [TiptapEditor.tsx](src/components/editor/TiptapEditor.tsx) 中：

```typescript
import { ReactNodeViewRenderer } from '@tiptap/react'

CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
}).configure({
  lowlight,
  defaultLanguage: 'plaintext',
})
```

### 专用样式文件

创建了 [code-block-styles.css](src/components/editor/code-block-styles.css)：
- 代码块容器样式
- 语言选择器样式
- 悬停状态动画
- 亮色/暗色主题适配

## 📝 代码示例

### JavaScript 示例
```javascript
// 将语言设置为 JavaScript
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(10)) // 55
```

### Python 示例
```python
# 将语言设置为 Python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

### TypeScript 示例
```typescript
// 将语言设置为 TypeScript
interface User {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]
```

## 🚀 用户体验优化

### 直观的交互

1. **悬停显示**: 只在需要时显示选择器，不干扰阅读
2. **即时反馈**: 选择语言后立即更新高亮
3. **清晰标识**: 始终显示当前语言

### 键盘友好

- 可以使用 Tab 键聚焦到语言选择器
- 使用方向键浏览语言选项
- 使用 Enter 键确认选择

### 无障碍访问

- 语言选择器具有正确的 HTML 语义
- 支持屏幕阅读器
- 清晰的视觉对比度

## 📂 文件结构

**新建文件**：
- [src/components/editor/CodeBlockComponent.tsx](src/components/editor/CodeBlockComponent.tsx) - 代码块组件
- [src/components/editor/code-block-styles.css](src/components/editor/code-block-styles.css) - 专用样式

**修改文件**：
- [src/components/editor/TiptapEditor.tsx](src/components/editor/TiptapEditor.tsx) - 配置自定义节点视图
- [src/components/editor/tiptap-styles.css](src/components/editor/tiptap-styles.css) - 清理旧代码块样式

## ⚡ 性能优化

### React 优化

- 使用 `useState` 管理悬停状态
- 仅在需要时重新渲染
- 语言列表为常量，避免重复创建

### CSS 优化

- 使用 CSS transitions 而非 animations
- 硬件加速的 transform 属性
- 最小化重绘和重排

## 🎯 后续优化建议

1. **语言自动检测**
   - 分析代码内容自动识别语言
   - 提供"自动检测"选项

2. **常用语言置顶**
   - 记录用户最常用的语言
   - 在下拉菜单中优先显示

3. **搜索过滤**
   - 在语言列表中添加搜索框
   - 快速定位所需语言

4. **语言别名**
   - 支持常见别名（如 `js` → `javascript`）
   - 提高用户体验

5. **自定义语言**
   - 允许用户添加自定义语言
   - 支持自定义语法高亮规则

## 🧪 测试建议

### 功能测试

- ✅ 创建代码块
- ✅ 悬停显示语言选择器
- ✅ 选择不同语言
- ✅ 验证语法高亮正确应用
- ✅ 测试所有 28 种语言
- ✅ 切换亮色/暗色主题

### 兼容性测试

- ✅ Chrome 浏览器
- ✅ 不同屏幕尺寸
- ✅ 触摸设备支持

### 性能测试

- ✅ 包含多个代码块的笔记
- ✅ 大型代码块（1000+ 行）
- ✅ 快速切换语言

## 📚 相关文档

- [CODE_BLOCK_FEATURES.md](CODE_BLOCK_FEATURES.md) - 代码块基础功能
- [TIPTAP_MIGRATION.md](TIPTAP_MIGRATION.md) - Tiptap 迁移文档
- [EDITOR_SHOWCASE.md](EDITOR_SHOWCASE.md) - 编辑器功能展示

---

**现在开始使用！** 🎉 创建一个代码块，悬停鼠标，选择你喜欢的编程语言，享受美丽的语法高亮！
