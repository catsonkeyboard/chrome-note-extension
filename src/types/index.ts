// 笔记类型定义 (Note Type Definition)
export interface Note {
  id: string
  name: string
  content: string
  createdAt: number
  updatedAt: number
  type: 'note'
}

// 文件夹类型定义 (Folder Type Definition)
export interface Folder {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  type: 'folder'
  children: TreeNode[]
}

// 树节点联合类型 (Tree Node Union Type)
export type TreeNode = Note | Folder

// 判断是否为文件夹 (Type guard for Folder)
export function isFolder(node: TreeNode): node is Folder {
  return node.type === 'folder'
}

// 判断是否为笔记 (Type guard for Note)
export function isNote(node: TreeNode): node is Note {
  return node.type === 'note'
}

// 标签页类型定义 (Tab Type Definition)
export interface Tab {
  id: string
  noteId: string
  title: string
  isDirty: boolean // 是否有未保存的修改
}

// WebDAV配置类型 (WebDAV Config Type)
export interface WebDAVConfig {
  url: string
  username: string
  password: string
  remotePath: string // 远程存储路径
}

// 同步状态类型 (Sync Status Type)
export interface SyncStatus {
  isSyncing: boolean
  lastSyncTime: number | null
  lastSyncError: string | null
}

// 同步冲突类型 (Sync Conflict Type)
export interface SyncConflict {
  noteId: string
  localContent: string
  remoteContent: string
  localUpdatedAt: number
  remoteUpdatedAt: number
}

// 应用状态类型 (App State Type)
export interface AppState {
  theme: 'light' | 'dark'
  sidebarWidth: number
  isPreviewMode: boolean // 是否显示预览
}

// localStorage键名常量 (LocalStorage Key Constants)
export const STORAGE_KEYS = {
  NOTES_TREE: 'notes-tree',
  NOTE_PREFIX: 'note-',
  WEBDAV_CONFIG: 'webdav-config',
  SYNC_STATUS: 'sync-status',
  APP_STATE: 'app-state',
} as const
