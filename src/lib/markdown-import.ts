/**
 * Markdown import utilities
 * Converts markdown to Yoopta editor format
 */

interface YooptaBlock {
  id: string
  type: string
  meta: {
    order: number
    depth: number
  }
  value: Array<{
    id: string
    type: string
    children: Array<{ text: string; [key: string]: any }>
    props?: any
  }>
}

/**
 * Parse markdown content and convert to Yoopta format
 */
export function markdownToYoopta(markdown: string): Record<string, YooptaBlock> {
  const lines = markdown.split('\n')
  const blocks: Record<string, YooptaBlock> = {}
  let order = 0
  let currentListItems: string[] = []
  let currentListType: 'BulletedList' | 'NumberedList' | 'TodoList' | null = null

  const flushList = () => {
    if (currentListItems.length > 0 && currentListType) {
      const blockId = `block-${Date.now()}-${order}`
      blocks[blockId] = {
        id: blockId,
        type: currentListType,
        meta: { order, depth: 0 },
        value: currentListItems.map((item, idx) => ({
          id: `${blockId}-${idx}`,
          type: currentListType!.toLowerCase().replace('list', ''),
          children: parseInlineMarkdown(item),
          ...(currentListType === 'TodoList' ? { props: { checked: item.startsWith('[x]') || item.startsWith('[X]') } } : {}),
        })),
      }
      order++
      currentListItems = []
      currentListType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Skip empty lines
    if (!trimmedLine) {
      flushList()
      continue
    }

    // Headings
    if (trimmedLine.startsWith('# ')) {
      flushList()
      const blockId = `block-${Date.now()}-${order}`
      blocks[blockId] = createBlock(blockId, 'HeadingOne', order, trimmedLine.substring(2))
      order++
      continue
    }
    if (trimmedLine.startsWith('## ')) {
      flushList()
      const blockId = `block-${Date.now()}-${order}`
      blocks[blockId] = createBlock(blockId, 'HeadingTwo', order, trimmedLine.substring(3))
      order++
      continue
    }
    if (trimmedLine.startsWith('### ')) {
      flushList()
      const blockId = `block-${Date.now()}-${order}`
      blocks[blockId] = createBlock(blockId, 'HeadingThree', order, trimmedLine.substring(4))
      order++
      continue
    }

    // Blockquote
    if (trimmedLine.startsWith('> ')) {
      flushList()
      const blockId = `block-${Date.now()}-${order}`
      blocks[blockId] = createBlock(blockId, 'Blockquote', order, trimmedLine.substring(2))
      order++
      continue
    }

    // Code block
    if (trimmedLine.startsWith('```')) {
      flushList()
      const language = trimmedLine.substring(3).trim() || 'plaintext'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      const blockId = `block-${Date.now()}-${order}`
      blocks[blockId] = {
        id: blockId,
        type: 'Code',
        meta: { order, depth: 0 },
        value: [
          {
            id: `${blockId}-0`,
            type: 'code',
            children: [{ text: codeLines.join('\n') }],
            props: { language },
          },
        ],
      }
      order++
      continue
    }

    // Todo list
    if (trimmedLine.match(/^[-*]\s+\[[ xX]\]\s+/)) {
      if (currentListType !== 'TodoList') {
        flushList()
        currentListType = 'TodoList'
      }
      const item = trimmedLine.replace(/^[-*]\s+\[[ xX]\]\s+/, '')
      const checked = trimmedLine.match(/\[[ xX]\]/)![0].toLowerCase() === '[x]'
      currentListItems.push((checked ? '[x] ' : '[ ] ') + item)
      continue
    }

    // Bulleted list
    if (trimmedLine.match(/^[-*]\s+/)) {
      if (currentListType !== 'BulletedList') {
        flushList()
        currentListType = 'BulletedList'
      }
      currentListItems.push(trimmedLine.replace(/^[-*]\s+/, ''))
      continue
    }

    // Numbered list
    if (trimmedLine.match(/^\d+\.\s+/)) {
      if (currentListType !== 'NumberedList') {
        flushList()
        currentListType = 'NumberedList'
      }
      currentListItems.push(trimmedLine.replace(/^\d+\.\s+/, ''))
      continue
    }

    // Regular paragraph
    flushList()
    const blockId = `block-${Date.now()}-${order}`
    blocks[blockId] = createBlock(blockId, 'Paragraph', order, trimmedLine)
    order++
  }

  flushList()

  // If no blocks were created, return empty paragraph
  if (Object.keys(blocks).length === 0) {
    const blockId = `block-${Date.now()}-0`
    blocks[blockId] = createBlock(blockId, 'Paragraph', 0, '')
  }

  return blocks
}

/**
 * Create a simple block (Paragraph, Heading, Blockquote)
 */
function createBlock(id: string, type: string, order: number, text: string): YooptaBlock {
  return {
    id,
    type,
    meta: { order, depth: 0 },
    value: [
      {
        id: `${id}-0`,
        type: type.toLowerCase(),
        children: parseInlineMarkdown(text),
      },
    ],
  }
}

/**
 * Parse inline markdown (bold, italic, code, strikethrough)
 */
function parseInlineMarkdown(text: string): Array<{ text: string; [key: string]: any }> {
  // Simple regex-based parser for inline styles
  // This is a basic implementation - could be enhanced for more complex cases

  // For now, return plain text segments
  // A full implementation would need to handle:
  // - **bold**
  // - *italic*
  // - `code`
  // - ~~strikethrough~~
  // - [links](url)

  // This is a simplified version - just return plain text for now
  // TODO: Implement full inline markdown parsing
  if (!text) {
    return [{ text: '' }]
  }

  return [{ text }]
}

/**
 * Read markdown file and return content
 */
export async function readMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      resolve(content)
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Extract filename without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}
