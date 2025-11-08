/**
 * Markdown import/export utilities
 * Converts markdown to Yoopta editor format and vice versa
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

/**
 * File structure for folder import
 */
export interface ImportedFile {
  name: string
  path: string
  content: any // Yoopta format
}

/**
 * Process folder and read all markdown files
 */
export async function processFolderFiles(files: FileList): Promise<ImportedFile[]> {
  const markdownFiles: ImportedFile[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const relativePath = file.webkitRelativePath || file.name

    // Only process markdown files
    if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
      try {
        const content = await readMarkdownFile(file)
        const yooptaValue = markdownToYoopta(content)
        const fileName = getFileNameWithoutExtension(file.name)

        markdownFiles.push({
          name: fileName,
          path: relativePath,
          content: yooptaValue,
        })
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error)
      }
    }
  }

  return markdownFiles
}

/**
 * Build folder structure from file paths
 */
export interface FolderStructure {
  [key: string]: {
    type: 'folder' | 'file'
    name: string
    content?: any
    children?: FolderStructure
  }
}

export function buildFolderStructure(files: ImportedFile[]): FolderStructure {
  const root: FolderStructure = {}

  for (const file of files) {
    const pathParts = file.path.split('/')
    let currentLevel = root

    // Navigate/create folder structure
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i]

      if (!currentLevel[folderName]) {
        currentLevel[folderName] = {
          type: 'folder',
          name: folderName,
          children: {},
        }
      }

      currentLevel = currentLevel[folderName].children!
    }

    // Add file at the final level
    currentLevel[file.name] = {
      type: 'file',
      name: file.name,
      content: file.content,
    }
  }

  return root
}

/**
 * Convert Yoopta editor content to Markdown
 */
export function yooptaToMarkdown(yooptaContent: Record<string, YooptaBlock>): string {
  if (!yooptaContent || Object.keys(yooptaContent).length === 0) {
    return ''
  }

  // Sort blocks by order
  const blocks = Object.values(yooptaContent).sort((a, b) => a.meta.order - b.meta.order)
  const lines: string[] = []

  for (const block of blocks) {
    const blockType = block.type

    switch (blockType) {
      case 'HeadingOne':
        lines.push(`# ${getBlockText(block)}`)
        break
      case 'HeadingTwo':
        lines.push(`## ${getBlockText(block)}`)
        break
      case 'HeadingThree':
        lines.push(`### ${getBlockText(block)}`)
        break
      case 'Blockquote':
        lines.push(`> ${getBlockText(block)}`)
        break
      case 'Code':
        const codeText = getBlockText(block)
        lines.push('```')
        lines.push(codeText)
        lines.push('```')
        break
      case 'BulletedList':
        if (block.value && Array.isArray(block.value)) {
          block.value.forEach(item => {
            lines.push(`- ${getItemText(item)}`)
          })
        }
        break
      case 'NumberedList':
        if (block.value && Array.isArray(block.value)) {
          block.value.forEach((item, idx) => {
            lines.push(`${idx + 1}. ${getItemText(item)}`)
          })
        }
        break
      case 'TodoList':
        if (block.value && Array.isArray(block.value)) {
          block.value.forEach(item => {
            const checked = item.props?.checked ? 'x' : ' '
            lines.push(`- [${checked}] ${getItemText(item)}`)
          })
        }
        break
      case 'Paragraph':
      default:
        const text = getBlockText(block)
        if (text) {
          lines.push(text)
        }
        break
    }

    // Add empty line between blocks
    lines.push('')
  }

  return lines.join('\n').trim()
}

/**
 * Get text content from a block
 */
function getBlockText(block: YooptaBlock): string {
  if (!block.value || !Array.isArray(block.value) || block.value.length === 0) {
    return ''
  }
  return getItemText(block.value[0])
}

/**
 * Get text content from a value item
 */
function getItemText(item: any): string {
  if (!item.children || !Array.isArray(item.children)) {
    return ''
  }
  return item.children.map((child: any) => child.text || '').join('')
}
