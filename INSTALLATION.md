# 安装指南 (Installation Guide)

## Chrome 扩展安装步骤

### 1. 构建项目

首先，确保已安装依赖并构建项目：

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹。

### 2. 加载到 Chrome

1. 打开 Chrome 浏览器
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 在页面右上角开启 **"开发者模式"**
4. 点击左上角的 **"加载已解压的扩展程序"** 按钮
5. 在弹出的文件选择对话框中，选择项目的 `dist/` 目录
6. 点击 **"选择文件夹"**

### 3. 使用扩展

安装成功后，你会在 Chrome 扩展栏看到 Markdown Notes 的图标。

**使用方法**：
- 点击扩展图标
- 应用会在新标签页中打开
- 开始创建和管理你的 Markdown 笔记！

### 4. 固定扩展图标（可选）

为了方便访问，建议将扩展图标固定到工具栏：

1. 点击 Chrome 扩展图标（拼图图标）
2. 找到 "Markdown Notes"
3. 点击图钉图标将其固定到工具栏

## 故障排除

### 扩展无法加载

如果遇到 "清单文件缺失或不可读" 的错误：
- 确保选择的是 `dist/` 目录，而不是项目根目录
- 确保已经运行 `npm run build` 完成构建

### 图标显示异常

- 项目使用临时占位符图标
- 可以通过运行 `scripts/generate-icons.html` 在浏览器中生成自定义图标
- 或访问 https://www.favicon-generator.org/ 生成图标后替换 `dist/icons/` 目录下的文件

### 点击图标无反应

- 检查浏览器控制台是否有错误
- 尝试重新加载扩展：
  1. 访问 `chrome://extensions/`
  2. 点击 Markdown Notes 扩展的刷新按钮
  3. 再次点击扩展图标

## 开发模式

如果你想在开发模式下测试扩展：

1. 运行 `npm run dev` 启动开发服务器
2. 访问 `http://localhost:5173` 在浏览器中预览
3. 修改代码后会自动热重载

注意：开发模式下无法作为 Chrome 扩展运行，需要先构建。

## 更新扩展

当代码有更新时：

1. 运行 `npm run build` 重新构建
2. 访问 `chrome://extensions/`
3. 点击 Markdown Notes 扩展的刷新按钮
4. 扩展会自动更新到最新版本
