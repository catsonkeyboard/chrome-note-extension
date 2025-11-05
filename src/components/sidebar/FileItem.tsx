import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
}: FileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(node.name)

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

  return (
    <div
      className={cn(
        'group flex items-center h-8 px-2 cursor-pointer hover:bg-accent rounded-sm',
        isSelected && 'bg-accent'
      )}
      style={{ paddingLeft }}
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
        <span
          className="flex-1 text-sm truncate"
          onClick={() => !isFolder(node) && onSelect(node.id)}
        >
          {node.name}
        </span>
      )}

      {/* 更多操作菜单 (More Actions Menu) */}
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
    </div>
  )
}
