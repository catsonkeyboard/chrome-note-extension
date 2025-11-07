import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DraggableFileItem } from './DraggableFileItem'
import type { TreeNode } from '@/types'
import { isFolder } from '@/types'
import { File, Folder } from 'lucide-react'

interface DraggableFileTreeProps {
  nodes: TreeNode[]
  selectedNoteId: string | null
  onSelectNote: (nodeId: string) => void
  onRename: (nodeId: string, newName: string) => void
  onDelete: (nodeId: string) => void
  onCreateNote?: (folderId: string, name: string) => void
  onCreateFolder?: (folderId: string, name: string) => void
  onMove: (nodeId: string, newParentId: string | null, newIndex: number) => void
  onReorder: (parentId: string | null, oldIndex: number, newIndex: number) => void
}

export function DraggableFileTree({
  nodes,
  selectedNoteId,
  onSelectNote,
  onRename,
  onDelete,
  onCreateNote,
  onCreateFolder,
  onMove,
  onReorder,
}: DraggableFileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

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

  // 获取所有节点ID（包括子节点）
  const getAllNodeIds = (nodeList: TreeNode[]): string[] => {
    const ids: string[] = []
    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        ids.push(node.id)
        if (isFolder(node) && expandedFolders.has(node.id)) {
          traverse(node.children)
        }
      })
    }
    traverse(nodeList)
    return ids
  }

  // 查找节点的父ID
  const findParentId = (nodeId: string, nodes: TreeNode[], parentId: string | null = null): string | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return parentId
      }
      if (isFolder(node)) {
        const found = findParentId(nodeId, node.children, node.id)
        if (found !== undefined) return found
      }
    }
    return undefined as any
  }

  // 查找节点
  const findNode = (nodeId: string, nodeList: TreeNode[] = nodes): TreeNode | null => {
    for (const node of nodeList) {
      if (node.id === nodeId) return node
      if (isFolder(node)) {
        const found = findNode(nodeId, node.children)
        if (found) return found
      }
    }
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      setActiveId(null)
      setOverId(null)
      return
    }

    const activeNodeId = active.id as string
    const overNodeId = over.id as string

    const activeNode = findNode(activeNodeId)
    const overNode = findNode(overNodeId)

    if (!activeNode || !overNode) {
      setActiveId(null)
      setOverId(null)
      return
    }

    const activeParentId = findParentId(activeNodeId, nodes)
    const overParentId = findParentId(overNodeId, nodes)

    // 如果拖到文件夹上，移动到文件夹内
    if (isFolder(overNode)) {
      onMove(activeNodeId, overNodeId, 0)
      // 自动展开目标文件夹
      if (!expandedFolders.has(overNodeId)) {
        toggleFolder(overNodeId)
      }
    }
    // 否则在同一层级重新排序
    else if (activeParentId === overParentId) {
      const parentNodes = activeParentId === null
        ? nodes
        : (findNode(activeParentId) as any)?.children || []

      const activeIndex = parentNodes.findIndex((n: TreeNode) => n.id === activeNodeId)
      const overIndex = parentNodes.findIndex((n: TreeNode) => n.id === overNodeId)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        onReorder(activeParentId, activeIndex, overIndex)
      }
    }
    // 不同父节点间移动
    else {
      const overParentNodes = overParentId === null
        ? nodes
        : (findNode(overParentId) as any)?.children || []
      const overIndex = overParentNodes.findIndex((n: TreeNode) => n.id === overNodeId)
      onMove(activeNodeId, overParentId, overIndex)
    }

    setActiveId(null)
    setOverId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setOverId(null)
  }

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.id)
    const isSelected = node.type === 'note' && node.id === selectedNoteId
    const isDragOver = overId === node.id

    return (
      <div key={node.id}>
        <DraggableFileItem
          node={node}
          level={level}
          isSelected={isSelected}
          isExpanded={isExpanded}
          isDragOver={isDragOver}
          onSelect={onSelectNote}
          onToggle={toggleFolder}
          onRename={onRename}
          onDelete={onDelete}
          onCreateNote={onCreateNote}
          onCreateFolder={onCreateFolder}
        />

        {/* 递归渲染子节点 */}
        {isFolder(node) && isExpanded && node.children.length > 0 && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const activeNode = activeId ? findNode(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={getAllNodeIds(nodes)}
        strategy={verticalListSortingStrategy}
      >
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
      </SortableContext>

      <DragOverlay>
        {activeNode && (
          <div className="bg-accent border border-border rounded px-2 py-1 shadow-lg flex items-center gap-2">
            {isFolder(activeNode) ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="text-sm">{activeNode.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
