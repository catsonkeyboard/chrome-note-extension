import { useRef } from 'react'
import { FileUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { readMarkdownFile, markdownToYoopta, getFileNameWithoutExtension } from '@/lib/markdown-import'

interface ImportMarkdownButtonProps {
  onImport: (name: string, content: any) => void
}

export function ImportMarkdownButton({ onImport }: ImportMarkdownButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      toast.error('文件格式错误', {
        description: '请选择 .md 或 .markdown 文件',
      })
      return
    }

    try {
      // Read file content
      const content = await readMarkdownFile(file)

      // Convert to Yoopta format
      const yooptaValue = markdownToYoopta(content)

      // Get filename without extension
      const noteName = getFileNameWithoutExtension(file.name)

      // Call onImport callback
      onImport(noteName, yooptaValue)

      // Show success message
      toast.success('导入成功', {
        description: `已导入笔记 "${noteName}"`,
      })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('导入失败:', error)
      toast.error('导入失败', {
        description: error instanceof Error ? error.message : '未知错误',
      })
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="导入 Markdown 文件"
        onClick={handleClick}
      >
        <FileUp className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  )
}
