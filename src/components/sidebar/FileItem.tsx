import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, Pencil, Trash2, FilePlus, Copy, ArrowUpDown } from 'lucide-react'
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
import type { TreeNode } from '@/types'
import { isFolder } from '@/types'

interface FileItemProps {
  node: TreeNode
  level: number
  isSelected: boolean
  isExpanded: boolean
  onSelect: (nodeId: string) => void
  onToggle: (nodeId: string) => void
  onRename: (nodeId: string, newName: string) => void
  onDelete: (nodeId: string) => void
  onCreateNote?: (folderId: string) => void
  onCreateFolder?: (folderId: string) => void
  onCopyToClipboard?: (nodeId: string) => void
  onSortFolder?: (folderId: string) => void
}

export function FileItem({
  node,
  level,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
  onRename,
  onDelete,
  onCreateNote,
  onCopyToClipboard,
  onSortFolder,
}: FileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(node.name)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

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
            className={cn(
              'group flex items-center h-8 px-2 cursor-pointer hover:bg-accent rounded-sm',
              isSelected && 'bg-accent'
            )}
            style={{ paddingLeft }}
            onClick={() => {
              if (!isRenaming) {
                if (isFolder(node)) {
                  onToggle(node.id)
                } else {
                  onSelect(node.id)
                }
              }
            }}
          >
            {/* 展开/折叠图标 (Expand/Collapse Icon) */}
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

            {/* 文件/文件夹图标 (File/Folder Icon) */}
            <div className="mr-2">
              {isFolder(node) ? (
                <Folder className="h-4 w-4 text-muted-foreground" />
              ) : (
                <File className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* 文件名或重命名输入框 (Filename or Rename Input) */}
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
              <span className="flex-1 text-sm truncate">
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
                <ContextMenuItem onClick={() => onCreateNote(node.id)}>
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
