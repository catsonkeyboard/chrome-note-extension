import { useState } from 'react'
import { FileItem } from './FileItem'
import type { TreeNode } from '@/types'
import { isFolder } from '@/types'

interface FileTreeProps {
  nodes: TreeNode[]
  selectedNoteId: string | null
  onSelectNote: (nodeId: string) => void
  onRename: (nodeId: string, newName: string) => void
  onDelete: (nodeId: string) => void
}

export function FileTree({
  nodes,
  selectedNoteId,
  onSelectNote,
  onRename,
  onDelete,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.id)
    const isSelected = node.type === 'note' && node.id === selectedNoteId

    return (
      <div key={node.id}>
        <FileItem
          node={node}
          level={level}
          isSelected={isSelected}
          isExpanded={isExpanded}
          onSelect={onSelectNote}
          onToggle={toggleFolder}
          onRename={onRename}
          onDelete={onDelete}
        />

        {/* 递归渲染子节点 (Recursively render children) */}
        {isFolder(node) && isExpanded && node.children.length > 0 && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {nodes.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8">
          暂无笔记
          <br />
          点击上方按钮创建
        </div>
      ) : (
        nodes.map((node) => renderNode(node))
      )}
    </div>
  )
}
