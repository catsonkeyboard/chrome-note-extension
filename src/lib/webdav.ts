import { createClient, WebDAVClient } from 'webdav'
import type { WebDAVConfig, Note, TreeNode } from '@/types'

/**
 * WebDAV同步工具类
 * (WebDAV Sync Utility Class)
 */
export class WebDAVSync {
  private client: WebDAVClient | null = null
  private config: WebDAVConfig | null = null

  /**
   * 初始化WebDAV客户端 (Initialize WebDAV Client)
   */
  init(config: WebDAVConfig): void {
    this.config = config
    this.client = createClient(config.url, {
      username: config.username,
      password: config.password
    })
  }

  /**
   * 测试连接 (Test Connection)
   */
  async testConnection(): Promise<boolean> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    try {
      await this.client.exists(this.config.remotePath)
      return true
    } catch (error) {
      console.error('WebDAV connection test failed:', error)
      return false
    }
  }

  /**
   * 确保远程目录存在 (Ensure Remote Directory Exists)
   */
  private async ensureDirectory(path: string): Promise<void> {
    if (!this.client) throw new Error('WebDAV client not initialized')

    try {
      const exists = await this.client.exists(path)
      if (!exists) {
        await this.client.createDirectory(path)
      }
    } catch (error) {
      console.error('Failed to create directory:', error)
      throw error
    }
  }

  /**
   * 上传笔记 (Upload Note)
   */
  async uploadNote(note: Note): Promise<void> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    try {
      await this.ensureDirectory(this.config.remotePath)

      const filePath = `${this.config.remotePath}/${note.id}.md`
      const content = this.createNoteContent(note)

      await this.client.putFileContents(filePath, content, {
        overwrite: true
      })
    } catch (error) {
      console.error('Failed to upload note:', error)
      throw new Error(`上传笔记失败: ${note.name}`)
    }
  }

  /**
   * 下载笔记 (Download Note)
   */
  async downloadNote(noteId: string): Promise<string> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    try {
      const filePath = `${this.config.remotePath}/${noteId}.md`
      const content = await this.client.getFileContents(filePath, {
        format: 'text'
      })

      return content as string
    } catch (error) {
      console.error('Failed to download note:', error)
      throw new Error(`下载笔记失败: ${noteId}`)
    }
  }

  /**
   * 上传笔记树结构 (Upload Notes Tree Structure)
   */
  async uploadTree(tree: TreeNode[]): Promise<void> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    try {
      await this.ensureDirectory(this.config.remotePath)

      const filePath = `${this.config.remotePath}/notes-tree.json`
      const content = JSON.stringify(tree, null, 2)

      await this.client.putFileContents(filePath, content, {
        overwrite: true
      })
    } catch (error) {
      console.error('Failed to upload tree:', error)
      throw new Error('上传笔记树结构失败')
    }
  }

  /**
   * 下载笔记树结构 (Download Notes Tree Structure)
   */
  async downloadTree(): Promise<TreeNode[]> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    try {
      const filePath = `${this.config.remotePath}/notes-tree.json`
      const content = await this.client.getFileContents(filePath, {
        format: 'text'
      })

      return JSON.parse(content as string)
    } catch (error) {
      console.error('Failed to download tree:', error)
      throw new Error('下载笔记树结构失败')
    }
  }

  /**
   * 获取远程文件修改时间 (Get Remote File Modified Time)
   */
  async getRemoteModifiedTime(noteId: string): Promise<number> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    try {
      const filePath = `${this.config.remotePath}/${noteId}.md`
      const stat: any = await this.client.stat(filePath)

      return new Date(stat.lastmod || stat.data?.lastmod).getTime()
    } catch (error) {
      console.error('Failed to get remote modified time:', error)
      return 0
    }
  }

  /**
   * 检查是否存在冲突 (Check for Conflicts)
   */
  async hasConflict(note: Note): Promise<boolean> {
    try {
      const remoteModifiedTime = await this.getRemoteModifiedTime(note.id)

      // 如果远程文件不存在，没有冲突
      // (If remote file doesn't exist, no conflict)
      if (remoteModifiedTime === 0) return false

      // 如果远程文件比本地新，存在冲突
      // (If remote file is newer than local, there's a conflict)
      return remoteModifiedTime > note.updatedAt
    } catch (error) {
      console.error('Failed to check conflict:', error)
      return false
    }
  }

  /**
   * 创建笔记内容（带元数据）(Create Note Content with Metadata)
   */
  private createNoteContent(note: Note): string {
    const metadata = {
      id: note.id,
      name: note.name,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }

    return `---
${JSON.stringify(metadata, null, 2)}
---

${note.content}`
  }

  /**
   * 解析笔记内容 (Parse Note Content)
   */
  parseNoteContent(content: string): { metadata: any; content: string } {
    const match = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/)

    if (match) {
      return {
        metadata: JSON.parse(match[1]),
        content: match[2]
      }
    }

    return {
      metadata: {},
      content
    }
  }

  /**
   * 完整同步 (Full Sync)
   */
  async fullSync(localTree: TreeNode[], localNotes: Note[]): Promise<{
    conflicts: Array<{ noteId: string; localUpdatedAt: number; remoteUpdatedAt: number }>
  }> {
    if (!this.client || !this.config) {
      throw new Error('WebDAV client not initialized')
    }

    const conflicts: Array<{ noteId: string; localUpdatedAt: number; remoteUpdatedAt: number }> = []

    try {
      // 1. 上传树结构
      // (Upload tree structure)
      await this.uploadTree(localTree)

      // 2. 对每个笔记进行同步
      // (Sync each note)
      for (const note of localNotes) {
        const hasConflict = await this.hasConflict(note)

        if (hasConflict) {
          const remoteModifiedTime = await this.getRemoteModifiedTime(note.id)
          conflicts.push({
            noteId: note.id,
            localUpdatedAt: note.updatedAt,
            remoteUpdatedAt: remoteModifiedTime
          })
        } else {
          await this.uploadNote(note)
        }
      }

      return { conflicts }
    } catch (error) {
      console.error('Full sync failed:', error)
      throw new Error('同步失败')
    }
  }
}

// 导出单例 (Export Singleton)
export const webdavSync = new WebDAVSync()
