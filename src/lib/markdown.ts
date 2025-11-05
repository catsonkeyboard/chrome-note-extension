/**
 * Markdown工具类
 * (Markdown Utility Class)
 */
export class MarkdownUtils {
  /**
   * 获取Markdown标题层级 (Get Markdown Heading Level)
   */
  static getHeadingLevel(line: string): number {
    const match = line.match(/^(#{1,6})\s/)
    return match ? match[1].length : 0
  }

  /**
   * 从Markdown内容中提取标题 (Extract Headings from Markdown)
   */
  static extractHeadings(content: string): Array<{ level: number; text: string; line: number }> {
    const lines = content.split('\n')
    const headings: Array<{ level: number; text: string; line: number }> = []

    lines.forEach((line, index) => {
      const level = this.getHeadingLevel(line)
      if (level > 0) {
        const text = line.replace(/^#{1,6}\s+/, '').trim()
        headings.push({ level, text, line: index + 1 })
      }
    })

    return headings
  }

  /**
   * 生成目录 (Generate Table of Contents)
   */
  static generateTOC(content: string): string {
    const headings = this.extractHeadings(content)

    if (headings.length === 0) {
      return ''
    }

    const toc = headings.map(heading => {
      const indent = '  '.repeat(heading.level - 1)
      const link = heading.text.toLowerCase().replace(/\s+/g, '-')
      return `${indent}- [${heading.text}](#${link})`
    })

    return '## 目录\n\n' + toc.join('\n')
  }

  /**
   * 统计字数（支持中英文）(Count Words - Supports Chinese and English)
   */
  static countWords(content: string): {
    characters: number
    words: number
    lines: number
  } {
    const characters = content.length
    const lines = content.split('\n').length

    // 统计英文单词数
    // (Count English words)
    const englishWords = content.match(/[a-zA-Z]+/g)?.length || 0

    // 统计中文字符数
    // (Count Chinese characters)
    const chineseChars = content.match(/[\u4e00-\u9fa5]/g)?.length || 0

    const words = englishWords + chineseChars

    return {
      characters,
      words,
      lines
    }
  }

  /**
   * 插入Markdown语法 (Insert Markdown Syntax)
   */
  static insertSyntax(
    content: string,
    cursorPosition: number,
    syntax: 'bold' | 'italic' | 'code' | 'link' | 'image' | 'heading'
  ): { newContent: string; newCursorPosition: number } {
    const before = content.slice(0, cursorPosition)
    const after = content.slice(cursorPosition)

    let insert = ''
    let offset = 0

    switch (syntax) {
      case 'bold':
        insert = '****'
        offset = 2
        break
      case 'italic':
        insert = '__'
        offset = 1
        break
      case 'code':
        insert = '``'
        offset = 1
        break
      case 'link':
        insert = '[]()'
        offset = 1
        break
      case 'image':
        insert = '![]()'
        offset = 2
        break
      case 'heading':
        insert = '## '
        offset = 3
        break
    }

    return {
      newContent: before + insert + after,
      newCursorPosition: cursorPosition + offset
    }
  }

  /**
   * 检查是否为有效的Markdown (Check if Valid Markdown)
   */
  static isValidMarkdown(content: string): boolean {
    // 基本验证：检查是否包含常见的Markdown元素
    // (Basic validation: check for common Markdown elements)
    const hasHeading = /^#{1,6}\s/m.test(content)
    const hasList = /^[\*\-\+]\s/m.test(content)
    const hasLink = /\[.*?\]\(.*?\)/.test(content)
    const hasCode = /`.*?`/.test(content)

    // 如果包含任何Markdown元素，或者是纯文本，都认为有效
    // (Valid if contains any Markdown elements, or is plain text)
    return hasHeading || hasList || hasLink || hasCode || content.trim().length > 0
  }

  /**
   * 转义Markdown特殊字符 (Escape Markdown Special Characters)
   */
  static escapeMarkdown(text: string): string {
    return text.replace(/([\\`*_{}[\]()#+\-.!])/g, '\\$1')
  }

  /**
   * 移除Markdown语法（获取纯文本）(Remove Markdown Syntax - Get Plain Text)
   */
  static toPlainText(content: string): string {
    return content
      // 移除代码块 (Remove code blocks)
      .replace(/```[\s\S]*?```/g, '')
      // 移除内联代码 (Remove inline code)
      .replace(/`[^`]*`/g, '')
      // 移除链接 (Remove links)
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // 移除图片 (Remove images)
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
      // 移除标题标记 (Remove heading marks)
      .replace(/^#{1,6}\s+/gm, '')
      // 移除加粗 (Remove bold)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // 移除斜体 (Remove italic)
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // 移除列表标记 (Remove list marks)
      .replace(/^[\*\-\+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .trim()
  }

  /**
   * 格式化Markdown表格 (Format Markdown Table)
   */
  static formatTable(rows: string[][]): string {
    if (rows.length === 0) return ''

    const columnWidths: number[] = []

    // 计算每列的最大宽度
    // (Calculate maximum width for each column)
    rows.forEach(row => {
      row.forEach((cell, i) => {
        columnWidths[i] = Math.max(columnWidths[i] || 0, cell.length)
      })
    })

    // 生成表格
    // (Generate table)
    const formattedRows = rows.map((row, rowIndex) => {
      const cells = row.map((cell, i) => cell.padEnd(columnWidths[i]))
      const line = `| ${cells.join(' | ')} |`

      // 在第一行后添加分隔线
      // (Add separator after first row)
      if (rowIndex === 0) {
        const separator = columnWidths.map(w => '-'.repeat(w)).join(' | ')
        return `${line}\n| ${separator} |`
      }

      return line
    })

    return formattedRows.join('\n')
  }
}
