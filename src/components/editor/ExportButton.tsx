import { useState } from 'react'
import { Download, FileText, FileImage, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportAsMarkdown, exportAsPDF, exportAsImage } from '@/lib/export'
import { toast } from 'sonner'

interface ExportButtonProps {
  yooptaValue: any
  editorElementRef: React.RefObject<HTMLDivElement | null>
  filename?: string
}

export function ExportButton({
  yooptaValue,
  editorElementRef,
  filename = 'document',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'markdown' | 'pdf' | 'png' | 'jpeg') => {
    setIsExporting(true)

    try {
      switch (format) {
        case 'markdown':
          exportAsMarkdown(yooptaValue, filename)
          toast.success('导出成功', {
            description: 'Markdown 文件已下载',
          })
          break

        case 'pdf':
          if (!editorElementRef.current) {
            throw new Error('编辑器元素未找到')
          }
          await exportAsPDF(editorElementRef.current, filename)
          toast.success('导出成功', {
            description: 'PDF 文件已下载',
          })
          break

        case 'png':
        case 'jpeg':
          if (!editorElementRef.current) {
            throw new Error('编辑器元素未找到')
          }
          await exportAsImage(editorElementRef.current, filename, format)
          toast.success('导出成功', {
            description: `${format.toUpperCase()} 图片已下载`,
          })
          break
      }
    } catch (error) {
      console.error('导出失败:', error)
      toast.error('导出失败', {
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? '导出中...' : '导出'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          <FileText className="mr-2 h-4 w-4" />
          导出为 Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileDown className="mr-2 h-4 w-4" />
          导出为 PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('png')}>
          <FileImage className="mr-2 h-4 w-4" />
          导出为 PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('jpeg')}>
          <FileImage className="mr-2 h-4 w-4" />
          导出为 JPEG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
