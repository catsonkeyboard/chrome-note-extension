import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * 将 Yoopta 编辑器内容转换为 Markdown 格式
 */
export function convertYooptaToMarkdown(yooptaValue: any): string {
  if (!yooptaValue) return ''

  const blocks = Object.values(yooptaValue) as any[]
  const lines: string[] = []

  // 按 order 排序
  blocks.sort((a, b) => a.meta.order - b.meta.order)

  blocks.forEach((block) => {
    const blockType = block.type
    const value = block.value[0]

    if (!value || !value.children) return

    // 提取文本内容
    const getText = (children: any[]): string => {
      return children
        .map((child) => {
          if (typeof child === 'string') return child
          if (child.text !== undefined) {
            let text = child.text
            // 处理格式化标记
            if (child.bold) text = `**${text}**`
            if (child.italic) text = `*${text}*`
            if (child.code) text = `\`${text}\``
            if (child.strike) text = `~~${text}~~`
            if (child.underline) text = `<u>${text}</u>`
            return text
          }
          if (child.children) return getText(child.children)
          return ''
        })
        .join('')
    }

    const text = getText(value.children)

    // 根据块类型转换
    switch (blockType) {
      case 'HeadingOne':
        lines.push(`# ${text}`)
        lines.push('')
        break
      case 'HeadingTwo':
        lines.push(`## ${text}`)
        lines.push('')
        break
      case 'HeadingThree':
        lines.push(`### ${text}`)
        lines.push('')
        break
      case 'Paragraph':
        lines.push(text)
        lines.push('')
        break
      case 'Blockquote':
        lines.push(`> ${text}`)
        lines.push('')
        break
      case 'Code':
        const language = value.props?.language || ''
        lines.push(`\`\`\`${language}`)
        lines.push(text)
        lines.push('```')
        lines.push('')
        break
      case 'BulletedList':
        lines.push(`- ${text}`)
        break
      case 'NumberedList':
        lines.push(`1. ${text}`)
        break
      case 'TodoList':
        const checked = value.props?.checked ? 'x' : ' '
        lines.push(`- [${checked}] ${text}`)
        break
      default:
        lines.push(text)
        lines.push('')
    }
  })

  return lines.join('\n')
}

/**
 * 导出为 Markdown 文件
 */
export function exportAsMarkdown(yooptaValue: any, filename: string = 'document') {
  const markdown = convertYooptaToMarkdown(yooptaValue)
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, `${filename}.md`)
}

/**
 * 在克隆的文档中转换 oklch 颜色为 RGB
 */
function convertOklchToRgb(clonedDoc: Document) {
  const root = clonedDoc.documentElement

  // 定义颜色映射（从 oklch 到 RGB）
  const colorMap: Record<string, string> = {
    // Light mode colors
    '--color-background': '#ffffff',
    '--color-foreground': '#1a1a1a',
    '--color-card': '#ffffff',
    '--color-card-foreground': '#1a1a1a',
    '--color-popover': '#ffffff',
    '--color-popover-foreground': '#1a1a1a',
    '--color-primary': '#4f46e5',
    '--color-primary-foreground': '#fafafa',
    '--color-secondary': '#f5f5f5',
    '--color-secondary-foreground': '#1a1a1a',
    '--color-muted': '#f5f5f5',
    '--color-muted-foreground': '#737373',
    '--color-accent': '#f5f5f5',
    '--color-accent-foreground': '#1a1a1a',
    '--color-destructive': '#dc2626',
    '--color-destructive-foreground': '#fafafa',
    '--color-border': '#e5e5e5',
    '--color-input': '#e5e5e5',
    '--color-ring': '#4f46e5',
  }

  // 替换 CSS 变量
  Object.entries(colorMap).forEach(([variable, color]) => {
    root.style.setProperty(variable, color)
  })

  // 如果是暗色模式，使用暗色方案
  if (root.classList.contains('dark')) {
    const darkColorMap: Record<string, string> = {
      '--color-background': '#1a1a1a',
      '--color-foreground': '#fafafa',
      '--color-card': '#1a1a1a',
      '--color-card-foreground': '#fafafa',
      '--color-popover': '#1a1a1a',
      '--color-popover-foreground': '#fafafa',
      '--color-primary': '#6366f1',
      '--color-primary-foreground': '#1a1a1a',
      '--color-secondary': '#262626',
      '--color-secondary-foreground': '#fafafa',
      '--color-muted': '#262626',
      '--color-muted-foreground': '#a3a3a3',
      '--color-accent': '#262626',
      '--color-accent-foreground': '#fafafa',
      '--color-destructive': '#ef4444',
      '--color-destructive-foreground': '#fafafa',
      '--color-border': '#262626',
      '--color-input': '#262626',
      '--color-ring': '#6366f1',
    }

    Object.entries(darkColorMap).forEach(([variable, color]) => {
      root.style.setProperty(variable, color)
    })
  }
}

/**
 * 导出为 PDF 文件
 */
export async function exportAsPDF(
  editorElement: HTMLElement,
  filename: string = 'document'
) {
  try {
    // 查找实际的编辑器内容区域（Yoopta 编辑器）
    const yooptaEditor = editorElement.querySelector('[data-yoopta-editor-id]') as HTMLElement
    const targetElement = yooptaEditor || editorElement

    // 使用 html2canvas 将编辑器内容转换为图片
    const canvas = await html2canvas(targetElement, {
      scale: 2, // 提高清晰度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 950, // 设置固定宽度（900px 内容 + 50px 边距）
      onclone: (clonedDoc) => {
        // 在克隆的文档中转换 oklch 颜色为 RGB
        convertOklchToRgb(clonedDoc)

        // 找到克隆文档中的目标元素
        const clonedTarget = yooptaEditor
          ? clonedDoc.querySelector('[data-yoopta-editor-id]') as HTMLElement
          : clonedDoc.body

        if (clonedTarget) {
          // 设置固定宽度，不居中
          clonedTarget.style.margin = '0'
          clonedTarget.style.maxWidth = '900px'
          clonedTarget.style.width = '900px'
          clonedTarget.style.padding = '20px'

          // 确保父容器也不会添加额外空间
          if (clonedTarget.parentElement) {
            clonedTarget.parentElement.style.display = 'block'
            clonedTarget.parentElement.style.width = '950px'
            clonedTarget.parentElement.style.margin = '0'
            clonedTarget.parentElement.style.padding = '0'
          }
        }
      },
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 宽度（毫米）
    const pageHeight = 297 // A4 高度（毫米）
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // 如果内容超过一页，添加更多页面
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('导出 PDF 失败:', error)
    throw error
  }
}

/**
 * 导出为图片文件
 */
export async function exportAsImage(
  editorElement: HTMLElement,
  filename: string = 'document',
  format: 'png' | 'jpeg' = 'png'
) {
  try {
    // 查找实际的编辑器内容区域（Yoopta 编辑器）
    const yooptaEditor = editorElement.querySelector('[data-yoopta-editor-id]') as HTMLElement
    const targetElement = yooptaEditor || editorElement

    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 950, // 设置固定宽度（900px 内容 + 50px 边距）
      onclone: (clonedDoc) => {
        // 在克隆的文档中转换 oklch 颜色为 RGB
        convertOklchToRgb(clonedDoc)

        // 找到克隆文档中的目标元素
        const clonedTarget = yooptaEditor
          ? clonedDoc.querySelector('[data-yoopta-editor-id]') as HTMLElement
          : clonedDoc.body

        if (clonedTarget) {
          // 设置固定宽度，不居中
          clonedTarget.style.margin = '0'
          clonedTarget.style.maxWidth = '900px'
          clonedTarget.style.width = '900px'
          clonedTarget.style.padding = '20px'

          // 确保父容器也不会添加额外空间
          if (clonedTarget.parentElement) {
            clonedTarget.parentElement.style.display = 'block'
            clonedTarget.parentElement.style.width = '950px'
            clonedTarget.parentElement.style.margin = '0'
            clonedTarget.parentElement.style.padding = '0'
          }
        }
      },
    })

    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, `${filename}.${format}`)
        }
      },
      `image/${format}`,
      format === 'jpeg' ? 0.95 : undefined
    )
  } catch (error) {
    console.error('导出图片失败:', error)
    throw error
  }
}

/**
 * 下载 Blob 对象
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
