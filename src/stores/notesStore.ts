import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TreeNode, Note, Folder } from '@/types'
import { STORAGE_KEYS } from '@/types'

interface NotesState {
  // 状态 (State)
  tree: TreeNode[]
  selectedNoteId: string | null

  // 操作方法 (Actions)
  setTree: (tree: TreeNode[]) => void
  selectNote: (noteId: string | null) => void

  // CRUD操作 (CRUD Operations)
  createNote: (parentId: string | null, name: string) => Note
  createFolder: (parentId: string | null, name: string) => Folder
  updateNote: (noteId: string, content: string) => void
  renameNode: (nodeId: string, newName: string) => void
  deleteNode: (nodeId: string) => void

  // 移动和排序操作 (Move and Reorder Operations)
  moveNode: (nodeId: string, newParentId: string | null, newIndex: number) => void
  reorderNodes: (parentId: string | null, oldIndex: number, newIndex: number) => void
  sortFolderChildren: (folderId: string | null) => void

  // 辅助方法 (Helper Methods)
  findNode: (nodeId: string, nodes?: TreeNode[]) => TreeNode | null
  getNote: (noteId: string) => Note | null
}

// 生成唯一ID (Generate unique ID)
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// 递归查找节点 (Recursively find node)
const findNodeRecursive = (nodeId: string, nodes: TreeNode[]): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === nodeId) return node
    if (node.type === 'folder') {
      const found = findNodeRecursive(nodeId, node.children)
      if (found) return found
    }
  }
  return null
}

// 递归更新节点 (Recursively update node)
const updateNodeRecursive = (
  nodes: TreeNode[],
  nodeId: string,
  updater: (node: TreeNode) => TreeNode
): TreeNode[] => {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return updater(node)
    }
    if (node.type === 'folder') {
      return {
        ...node,
        children: updateNodeRecursive(node.children, nodeId, updater)
      }
    }
    return node
  })
}

// 递归删除节点 (Recursively delete node)
const deleteNodeRecursive = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
  return nodes.filter(node => {
    if (node.id === nodeId) return false
    if (node.type === 'folder') {
      node.children = deleteNodeRecursive(node.children, nodeId)
    }
    return true
  })
}

// 添加节点到父节点 (Add node to parent)
const addNodeToParent = (
  nodes: TreeNode[],
  parentId: string | null,
  newNode: TreeNode
): TreeNode[] => {
  if (parentId === null) {
    return [...nodes, newNode]
  }

  return updateNodeRecursive(nodes, parentId, (node) => {
    if (node.type === 'folder') {
      return {
        ...node,
        children: [...node.children, newNode]
      }
    }
    return node
  })
}

// 从树中移除节点并返回节点和新树 (Remove node from tree and return node and new tree)
const removeNode = (nodes: TreeNode[], nodeId: string): { node: TreeNode | null; newNodes: TreeNode[] } => {
  let removedNode: TreeNode | null = null

  const removeRecursive = (items: TreeNode[]): TreeNode[] => {
    return items.filter(item => {
      if (item.id === nodeId) {
        removedNode = item
        return false
      }
      if (item.type === 'folder') {
        item.children = removeRecursive(item.children)
      }
      return true
    })
  }

  const newNodes = removeRecursive([...nodes])
  return { node: removedNode, newNodes }
}

// 在指定位置插入节点 (Insert node at specific position)
const insertNodeAt = (
  nodes: TreeNode[],
  parentId: string | null,
  node: TreeNode,
  index: number
): TreeNode[] => {
  if (parentId === null) {
    const newNodes = [...nodes]
    newNodes.splice(index, 0, node)
    return newNodes
  }

  return updateNodeRecursive(nodes, parentId, (parent) => {
    if (parent.type === 'folder') {
      const newChildren = [...parent.children]
      newChildren.splice(index, 0, node)
      return {
        ...parent,
        children: newChildren
      }
    }
    return parent
  })
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      // 初始状态 (Initial State)
      tree: [],
      selectedNoteId: null,

      // 设置树 (Set Tree)
      setTree: (tree) => set({ tree }),

      // 选择笔记 (Select Note)
      selectNote: (noteId) => set({ selectedNoteId: noteId }),

      // 创建笔记 (Create Note)
      createNote: (parentId, name) => {
        const newNote: Note = {
          id: generateId(),
          name,
          content: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          type: 'note'
        }

        set(state => ({
          tree: addNodeToParent(state.tree, parentId, newNote)
        }))

        return newNote
      },

      // 创建文件夹 (Create Folder)
      createFolder: (parentId, name) => {
        const newFolder: Folder = {
          id: generateId(),
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          type: 'folder',
          children: []
        }

        set(state => ({
          tree: addNodeToParent(state.tree, parentId, newFolder)
        }))

        return newFolder
      },

      // 更新笔记内容 (Update Note Content)
      updateNote: (noteId, content) => {
        set(state => ({
          tree: updateNodeRecursive(state.tree, noteId, (node) => {
            if (node.type === 'note') {
              return {
                ...node,
                content,
                updatedAt: Date.now()
              }
            }
            return node
          })
        }))
      },

      // 重命名节点 (Rename Node)
      renameNode: (nodeId, newName) => {
        set(state => ({
          tree: updateNodeRecursive(state.tree, nodeId, (node) => ({
            ...node,
            name: newName,
            updatedAt: Date.now()
          }))
        }))
      },

      // 删除节点 (Delete Node)
      deleteNode: (nodeId) => {
        set(state => ({
          tree: deleteNodeRecursive(state.tree, nodeId),
          selectedNoteId: state.selectedNoteId === nodeId ? null : state.selectedNoteId
        }))
      },

      // 查找节点 (Find Node)
      findNode: (nodeId, nodes) => {
        const searchNodes = nodes || get().tree
        return findNodeRecursive(nodeId, searchNodes)
      },

      // 获取笔记 (Get Note)
      getNote: (noteId) => {
        const node = get().findNode(noteId)
        return node?.type === 'note' ? node : null
      },

      // 移动节点 (Move Node)
      moveNode: (nodeId, newParentId, newIndex) => {
        set(state => {
          // 移除节点
          const { node, newNodes } = removeNode(state.tree, nodeId)
          if (!node) return state

          // 插入到新位置
          const finalTree = insertNodeAt(newNodes, newParentId, node, newIndex)
          return { tree: finalTree }
        })
      },

      // 重新排序节点 (Reorder Nodes)
      reorderNodes: (parentId, oldIndex, newIndex) => {
        set(state => {
          if (parentId === null) {
            // 根级别重排序
            const newTree = [...state.tree]
            const [movedNode] = newTree.splice(oldIndex, 1)
            newTree.splice(newIndex, 0, movedNode)
            return { tree: newTree }
          } else {
            // 文件夹内重排序
            return {
              tree: updateNodeRecursive(state.tree, parentId, (node) => {
                if (node.type === 'folder') {
                  const newChildren = [...node.children]
                  const [movedNode] = newChildren.splice(oldIndex, 1)
                  newChildren.splice(newIndex, 0, movedNode)
                  return {
                    ...node,
                    children: newChildren
                  }
                }
                return node
              })
            }
          }
        })
      },

      // 按名称排序文件夹子节点 (Sort Folder Children by Name)
      sortFolderChildren: (folderId) => {
        set(state => {
          if (folderId === null) {
            // 根级别排序
            const sortedTree = [...state.tree].sort((a, b) =>
              a.name.localeCompare(b.name, 'zh-CN')
            )
            return { tree: sortedTree }
          } else {
            // 文件夹内排序
            return {
              tree: updateNodeRecursive(state.tree, folderId, (node) => {
                if (node.type === 'folder') {
                  const sortedChildren = [...node.children].sort((a, b) =>
                    a.name.localeCompare(b.name, 'zh-CN')
                  )
                  return {
                    ...node,
                    children: sortedChildren,
                    updatedAt: Date.now()
                  }
                }
                return node
              })
            }
          }
        })
      }
    }),
    {
      name: STORAGE_KEYS.NOTES_TREE,
    }
  )
)
