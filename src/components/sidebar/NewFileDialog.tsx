import { useState } from 'react'
import { FilePlus, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface NewFileDialogProps {
  type: 'note' | 'folder'
  onConfirm: (name: string) => void
}

export function NewFileDialog({ type, onConfirm }: NewFileDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim())
      setName('')
      setOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  const isNote = type === 'note'
  const title = isNote ? '新建笔记' : '新建文件夹'
  const placeholder = isNote ? '输入笔记名称' : '输入文件夹名称'
  const Icon = isNote ? FilePlus : FolderPlus

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title={title}>
          <Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isNote ? '创建一个新的Markdown笔记' : '创建一个新的文件夹来组织笔记'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder={placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
