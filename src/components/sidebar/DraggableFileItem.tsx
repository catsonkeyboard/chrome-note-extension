import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  MoreHorizontal,
  Pencil,
  Trash2,
  FilePlus,
  FolderPlus,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TreeNode } from '@/types'
import { isFolder } from '@/types'

interface DraggableFileItemProps {
  node: TreeNode
  level: number
  isSelected: boolean
  isExpanded: boolean
  isDragOver: boolean
  onSelect: (nodeId: string) => void
  onToggle: (nodeId: string) => void
  onRename: (nodeId: string, newName: string) => void
  onDelete: (nodeId: string) => void
  onCreateNote?: (folderId: string, name: string) => void
  onCreateFolder?: (folderId: string, name: string) => void
}

export function DraggableFileItem({
  node,
  level,
  isSelected,
  isExpanded,
  isDragOver,
  onSelect,
  onToggle,
  onRename,
  onDelete,
  onCreateNote,
  onCreateFolder,
}: DraggableFileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(node.name)
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [createName, setCreateName] = useState('')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleRenameStart = () => {
    setIsRenaming(true)
    setNewName(node.name)
  }

  const handleRenameConfirm = () => {
    if (newName.trim() && newName !== node.name) {
      onRename(node.id, newName.trim())
    }
    setIsRenaming(false)
  }

  const handleRenameCancel = () => {
    setNewName(node.name)
    setIsRenaming(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameConfirm()
    } else if (e.key === 'Escape') {
      handleRenameCancel()
    }
  }

  const handleCreateNoteClick = () => {
    setShowCreateNoteDialog(true)
    setCreateName('')
  }

  const handleCreateFolderClick = () => {
    setShowCreateFolderDialog(true)
    setCreateName('')
  }

  const handleConfirmCreateNote = () => {
    if (createName.trim() && onCreateNote) {
      onCreateNote(node.id, createName.trim())
      setShowCreateNoteDialog(false)
      setCreateName('')
    }
  }

  const handleConfirmCreateFolder = () => {
    if (createName.trim() && onCreateFolder) {
      onCreateFolder(node.id, createName.trim())
      setShowCreateFolderDialog(false)
      setCreateName('')
    }
  }

  const handleCreateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showCreateNoteDialog) {
        handleConfirmCreateNote()
      } else if (showCreateFolderDialog) {
        handleConfirmCreateFolder()
      }
    }
  }

  const paddingLeft = `${level * 16 + 8}px`

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center h-8 px-2 cursor-pointer hover:bg-accent rounded-sm',
        isSelected && 'bg-accent',
        isDragOver && 'bg-accent/50 ring-2 ring-primary'
      )}
    >
      {/* 拖拽手柄 */}
      <div
        {...attributes}
        {...listeners}
        className="mr-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        style={{ paddingLeft }}
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>

      {/* 展开/折叠图标 */}
      {isFolder(node) && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 mr-1"
          onClick={(e) => {
            e.stopPropagation()
            onToggle(node.id)
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* 文件/文件夹图标 */}
      <div className="mr-2">
        {isFolder(node) ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* 文件名或重命名输入框 */}
      {isRenaming ? (
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRenameConfirm}
          onKeyDown={handleKeyDown}
          className="h-6 text-sm flex-1"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="flex-1 text-sm truncate"
          onClick={() => !isFolder(node) && onSelect(node.id)}
        >
          {node.name}
        </span>
      )}

      {/* 更多操作菜单 */}
      {!isRenaming && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isFolder(node) && onCreateNote && (
              <DropdownMenuItem onClick={handleCreateNoteClick}>
                <FilePlus className="mr-2 h-4 w-4" />
                新建笔记
              </DropdownMenuItem>
            )}
            {isFolder(node) && onCreateFolder && (
              <DropdownMenuItem onClick={handleCreateFolderClick}>
                <FolderPlus className="mr-2 h-4 w-4" />
                新建文件夹
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleRenameStart}>
              <Pencil className="mr-2 h-4 w-4" />
              重命名
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(node.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Create Note Dialog */}
      <Dialog open={showCreateNoteDialog} onOpenChange={setShowCreateNoteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新建笔记</DialogTitle>
            <DialogDescription>
              在 "{node.name}" 文件夹中创建一个新的Markdown笔记
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="输入笔记名称"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={handleCreateKeyDown}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateNoteDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmCreateNote} disabled={!createName.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新建文件夹</DialogTitle>
            <DialogDescription>
              在 "{node.name}" 文件夹中创建一个新的文件夹来组织笔记
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="输入文件夹名称"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={handleCreateKeyDown}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmCreateFolder} disabled={!createName.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
