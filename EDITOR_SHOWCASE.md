# 编辑器功能展示

## 📝 富文本编辑器功能

### ✨ 文本格式化

- **粗体文本** - 使用 `Cmd/Ctrl + B` 或工具栏 **B** 按钮
- *斜体文本* - 使用 `Cmd/Ctrl + I` 或工具栏 *I* 按钮
- ~~删除线~~ - 使用工具栏按钮
- `行内代码` - 使用 `Cmd/Ctrl + E` 或工具栏按钮

### 📋 标题层级

使用工具栏中的 H1、H2、H3 按钮创建不同级别的标题：

# 一级标题
## 二级标题
### 三级标题

### 📌 列表

**无序列表**：
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

**有序列表**：
1. 第一步
2. 第二步
3. 第三步

### 💬 引用块

> 这是一个引用块。
>
> 可以用来引用他人的话，或者强调重要信息。

### ➖ 分割线

---

### 💻 代码块

这是编辑器最强大的功能之一 - 支持语法高亮的代码块！

**JavaScript 示例**：
```javascript
// 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const result = fibonacci(10)
console.log(`第10个斐波那契数是: ${result}`)
```

**Python 示例**：
```python
# 快速排序算法
def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))
```

**TypeScript 示例**：
```typescript
interface Product {
  id: number
  name: string
  price: number
  category: string
}

class ShoppingCart {
  private items: Product[] = []

  addItem(product: Product): void {
    this.items.push(product)
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0)
  }

  getItemCount(): number {
    return this.items.length
  }
}

const cart = new ShoppingCart()
cart.addItem({ id: 1, name: 'Laptop', price: 999, category: 'Electronics' })
console.log(`Total: $${cart.getTotalPrice()}`)
```

**CSS 示例**：
```css
/* 现代卡片样式 */
.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}
```

**HTML 示例**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>示例页面</title>
</head>
<body>
  <header>
    <h1>欢迎使用富文本编辑器</h1>
    <nav>
      <ul>
        <li><a href="#home">首页</a></li>
        <li><a href="#features">功能</a></li>
        <li><a href="#about">关于</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="features">
      <h2>主要特性</h2>
      <p>支持多种编程语言的语法高亮显示。</p>
    </section>
  </main>
</body>
</html>
```

**JSON 示例**：
```json
{
  "name": "chrome-note-extension",
  "version": "1.0.0",
  "description": "一个支持富文本编辑的 Chrome 笔记扩展",
  "features": [
    "语法高亮",
    "自动保存",
    "暗色模式",
    "WebDAV 同步"
  ],
  "config": {
    "autoSave": true,
    "debounceTime": 1000,
    "theme": "auto"
  }
}
```

**SQL 示例**：
```sql
-- 创建用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO users (username, email)
VALUES
  ('alice', 'alice@example.com'),
  ('bob', 'bob@example.com');

-- 查询用户
SELECT u.username, u.email, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id
ORDER BY post_count DESC;
```

**Bash 示例**：
```bash
#!/bin/bash

# 批量处理图片
for file in *.jpg; do
  echo "处理文件: $file"

  # 调整大小
  convert "$file" -resize 800x600 "thumb_$file"

  # 压缩
  jpegoptim --max=85 "thumb_$file"
done

echo "处理完成！"
```

## 🎨 代码块样式特性

### 暗色主题
- 深色渐变背景 (#1e1e1e → #2d2d2d)
- Material Theme 配色方案
- 模拟代码编辑器头部
- 圆角阴影效果

### 亮色主题
- 清新浅色渐变背景
- 适配的语法高亮色彩
- 保持一致的视觉风格

### 交互体验
- 自定义美化滚动条
- 悬停效果
- 平滑过渡动画

## 🎯 支持的编程语言

代码高亮支持 40+ 种常见语言：

- **Web 开发**: JavaScript, TypeScript, HTML, CSS, SCSS, JSON
- **后端语言**: Python, Java, C, C++, C#, PHP, Ruby, Go, Rust
- **数据相关**: SQL, YAML, XML, GraphQL
- **脚本语言**: Bash, Shell, PowerShell
- **标记语言**: Markdown
- **配置文件**: Dockerfile, Nginx, Apache
- **其他**: Swift, Kotlin, Scala, R, Matlab, 等等

## ⌨️ 键盘快捷键

| 功能 | 快捷键 |
|------|--------|
| 粗体 | `Cmd/Ctrl + B` |
| 斜体 | `Cmd/Ctrl + I` |
| 删除线 | `Cmd/Ctrl + Shift + S` |
| 行内代码 | `Cmd/Ctrl + E` |
| 代码块 | `Cmd/Ctrl + Alt + C` |
| 有序列表 | `Cmd/Ctrl + Shift + 7` |
| 无序列表 | `Cmd/Ctrl + Shift + 8` |
| 引用块 | `Cmd/Ctrl + Shift + B` |
| 撤销 | `Cmd/Ctrl + Z` |
| 重做 | `Cmd/Ctrl + Shift + Z` |

## 💡 使用技巧

### 创建代码块
1. 点击工具栏中的 `</>` 按钮
2. 或使用快捷键 `Cmd/Ctrl + Alt + C`
3. 或输入三个反引号 ` ``` ` 后按回车

### 退出代码块
- 在代码块末尾按两次 `Enter` 键
- 或使用方向键移动到代码块外

### 快速格式化
- 选中文本后点击格式化按钮
- 支持多次应用不同格式
- 使用 `Cmd/Ctrl + Z` 可以撤销任何操作

### 自动保存
- 编辑器会在停止输入 1 秒后自动保存
- 标签页标题会显示未保存状态 (*)
- 保存完成后标记会自动消失

## 🌟 特色功能

### 智能排版
- 自动将 `"` 转换为智能引号 " "
- 自动将 `...` 转换为省略号 …
- 自动将 `--` 转换为破折号 —

### 响应式设计
- 适配不同屏幕尺寸
- 移动端友好的触摸操作
- 流畅的滚动体验

### 主题适配
- 自动检测系统主题
- 支持亮色/暗色模式切换
- 代码块样式完美适配

## 📚 相关文档

- [TIPTAP_MIGRATION.md](TIPTAP_MIGRATION.md) - Tiptap 迁移完整文档
- [CODE_BLOCK_FEATURES.md](CODE_BLOCK_FEATURES.md) - 代码块功能详细说明
- [Tiptap 官方文档](https://tiptap.dev/)

---

**开始创作吧！** 🎉 从左侧文件树选择或创建一个笔记，体验强大的富文本编辑功能。
