import type { TreeNode, Note } from '@/types'
import { STORAGE_KEYS } from '@/types'

/**
 * localStorage工具类
 * (LocalStorage Utility Class)
 */
export class Storage {
  /**
   * 保存笔记树 (Save Notes Tree)
   */
  static saveTree(tree: TreeNode[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES_TREE, JSON.stringify(tree))
    } catch (error) {
      console.error('Failed to save tree:', error)
      throw new Error('保存笔记树失败')
    }
  }

  /**
   * 加载笔记树 (Load Notes Tree)
   */
  static loadTree(): TreeNode[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES_TREE)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load tree:', error)
      return []
    }
  }

  /**
   * 保存单个笔记内容 (Save Single Note Content)
   */
  static saveNote(note: Note): void {
    try {
      const key = `${STORAGE_KEYS.NOTE_PREFIX}${note.id}`
      localStorage.setItem(key, note.content)
    } catch (error) {
      console.error('Failed to save note:', error)
      throw new Error('保存笔记失败')
    }
  }

  /**
   * 加载单个笔记内容 (Load Single Note Content)
   */
  static loadNote(noteId: string): string | null {
    try {
      const key = `${STORAGE_KEYS.NOTE_PREFIX}${noteId}`
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Failed to load note:', error)
      return null
    }
  }

  /**
   * 删除笔记 (Delete Note)
   */
  static deleteNote(noteId: string): void {
    try {
      const key = `${STORAGE_KEYS.NOTE_PREFIX}${noteId}`
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  /**
   * 导出所有笔记为JSON (Export All Notes as JSON)
   */
  static exportAllNotes(): string {
    try {
      const tree = this.loadTree()
      const notes: Record<string, string> = {}

      // 递归收集所有笔记内容
      // (Recursively collect all note contents)
      const collectNotes = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.type === 'note') {
            notes[node.id] = node.content
          } else if (node.type === 'folder') {
            collectNotes(node.children)
          }
        }
      }

      collectNotes(tree)

      return JSON.stringify(
        {
          version: '1.0',
          exportedAt: Date.now(),
          tree,
          notes
        },
        null,
        2
      )
    } catch (error) {
      console.error('Failed to export notes:', error)
      throw new Error('导出笔记失败')
    }
  }

  /**
   * 导入笔记数据 (Import Notes Data)
   */
  static importNotes(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)

      if (!data.version || !data.tree || !data.notes) {
        throw new Error('Invalid data format')
      }

      // 保存树结构
      // (Save tree structure)
      this.saveTree(data.tree)

      // 保存所有笔记内容
      // (Save all note contents)
      Object.entries(data.notes).forEach(([noteId, content]) => {
        const key = `${STORAGE_KEYS.NOTE_PREFIX}${noteId}`
        localStorage.setItem(key, content as string)
      })
    } catch (error) {
      console.error('Failed to import notes:', error)
      throw new Error('导入笔记失败')
    }
  }

  /**
   * 导出单个笔记为Markdown文件 (Export Single Note as Markdown)
   */
  static exportNoteAsMarkdown(note: Note): string {
    const header = `---
title: ${note.name}
created: ${new Date(note.createdAt).toISOString()}
updated: ${new Date(note.updatedAt).toISOString()}
---

`
    return header + note.content
  }

  /**
   * 获取存储使用情况 (Get Storage Usage)
   */
  static getStorageUsage(): { used: number; total: number; percentage: number } {
    let used = 0

    // 计算所有键的大小
    // (Calculate size of all keys)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) || ''
        used += key.length + value.length
      }
    }

    // localStorage通常限制为5MB (5 * 1024 * 1024 bytes)
    // (localStorage is typically limited to 5MB)
    const total = 5 * 1024 * 1024
    const percentage = (used / total) * 100

    return {
      used,
      total,
      percentage: Math.round(percentage * 100) / 100
    }
  }

  /**
   * 清空所有数据 (Clear All Data)
   */
  static clearAll(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear storage:', error)
      throw new Error('清空存储失败')
    }
  }
}
