import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Pencil,
  Trash2,
  FilePlus,
  Copy,
  GripVertical,
  ArrowUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  onCreateNote?: (folderId: string | null, name: string) => void
  onCreateFolder?: (folderId: string, name: string) => void
  onCopyToClipboard?: (nodeId: string) => void
  onSortFolder?: (folderId: string) => void
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
  onCopyToClipboard,
  onSortFolder,
}: DraggableFileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(node.name)
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false)
  const [createName, setCreateName] = useState('')
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

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


  const handleConfirmCreateNote = () => {
    if (createName.trim() && onCreateNote) {
      onCreateNote(node.id, createName.trim())
      setShowCreateNoteDialog(false)
      setCreateName('')
    }
  }


  const handleCreateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showCreateNoteDialog) {
      handleConfirmCreateNote()
    }
  }

  const paddingLeft = `${level * 16 + 8}px`

  const handleDeleteConfirm = () => {
    onDelete(node.id)
    setShowDeleteAlert(false)
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
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

    </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {isFolder(node) ? (
            <>
              {/* 文件夹右键菜单 */}
              {onCreateNote && (
                <ContextMenuItem onClick={handleCreateNoteClick}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  新建笔记
                </ContextMenuItem>
              )}
              {onSortFolder && (
                <ContextMenuItem onClick={() => onSortFolder(node.id)}>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  排序
                </ContextMenuItem>
              )}
              <ContextMenuItem onClick={handleRenameStart}>
                <Pencil className="mr-2 h-4 w-4" />
                重命名
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </ContextMenuItem>
            </>
          ) : (
            <>
              {/* 文件右键菜单 */}
              {onCopyToClipboard && (
                <ContextMenuItem onClick={() => onCopyToClipboard(node.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  复制到剪贴板
                </ContextMenuItem>
              )}
              <ContextMenuItem onClick={handleRenameStart}>
                <Pencil className="mr-2 h-4 w-4" />
                重命名
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

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

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              {isFolder(node)
                ? `确定要删除文件夹 "${node.name}" 及其所有内容吗？此操作无法撤销。`
                : `确定要删除笔记 "${node.name}" 吗？此操作无法撤销。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
