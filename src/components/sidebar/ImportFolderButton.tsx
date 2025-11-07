import { useRef, useState } from 'react'
import { FolderUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { processFolderFiles, buildFolderStructure, type FolderStructure } from '@/lib/markdown-import'

interface ImportFolderButtonProps {
  onImport: (structure: FolderStructure, folderName: string) => void
}

export function ImportFolderButton({ onImport }: ImportFolderButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsProcessing(true)

    try {
      // Get folder name from the first file's path
      const firstFilePath = files[0].webkitRelativePath
      const folderName = firstFilePath.split('/')[0]

      // Show loading toast
      const loadingToast = toast.loading('正在导入文件夹...', {
        description: `处理 ${files.length} 个文件`,
      })

      // Process all markdown files
      const importedFiles = await processFolderFiles(files)

      if (importedFiles.length === 0) {
        toast.error('导入失败', {
          id: loadingToast,
          description: '文件夹中没有找到 Markdown 文件',
        })
        return
      }

      // Build folder structure
      const structure = buildFolderStructure(importedFiles)

      // Call onImport callback
      onImport(structure, folderName)

      // Show success message
      toast.success('导入成功', {
        id: loadingToast,
        description: `已导入 ${importedFiles.length} 个笔记`,
      })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('导入文件夹失败:', error)
      toast.error('导入失败', {
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="导入文件夹"
        onClick={handleClick}
        disabled={isProcessing}
      >
        <FolderUp className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        /* @ts-ignore - webkitdirectory is not in the type definition */
        webkitdirectory=""
        directory=""
        multiple
        style={{ display: 'none' }}
        onChange={handleFolderChange}
      />
    </>
  )
}
