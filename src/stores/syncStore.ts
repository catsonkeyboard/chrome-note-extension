import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WebDAVConfig, SyncStatus, SyncConflict } from '@/types'
import { STORAGE_KEYS } from '@/types'

interface SyncState {
  // 状态 (State)
  config: WebDAVConfig | null
  status: SyncStatus
  conflicts: SyncConflict[]

  // 操作方法 (Actions)
  setConfig: (config: WebDAVConfig | null) => void
  updateStatus: (status: Partial<SyncStatus>) => void
  addConflict: (conflict: SyncConflict) => void
  resolveConflict: (noteId: string, useLocal: boolean) => void
  clearConflicts: () => void

  // 同步方法 (Sync Methods)
  startSync: () => void
  finishSync: (error?: string) => void
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      // 初始状态 (Initial State)
      config: null,
      status: {
        isSyncing: false,
        lastSyncTime: null,
        lastSyncError: null
      },
      conflicts: [],

      // 设置配置 (Set Config)
      setConfig: (config) => {
        set({ config })
      },

      // 更新状态 (Update Status)
      updateStatus: (statusUpdate) => {
        set(state => ({
          status: { ...state.status, ...statusUpdate }
        }))
      },

      // 添加冲突 (Add Conflict)
      addConflict: (conflict) => {
        set(state => ({
          conflicts: [...state.conflicts, conflict]
        }))
      },

      // 解决冲突 (Resolve Conflict)
      resolveConflict: (noteId, _useLocal) => {
        // 这里只是移除冲突记录
        // 实际的解决逻辑将在webdav工具类中实现
        // (This only removes the conflict record)
        // (Actual resolution logic will be implemented in webdav utility)
        set(state => ({
          conflicts: state.conflicts.filter(c => c.noteId !== noteId)
        }))
      },

      // 清除所有冲突 (Clear All Conflicts)
      clearConflicts: () => {
        set({ conflicts: [] })
      },

      // 开始同步 (Start Sync)
      startSync: () => {
        set({
          status: {
            isSyncing: true,
            lastSyncTime: null,
            lastSyncError: null
          }
        })
      },

      // 完成同步 (Finish Sync)
      finishSync: (error) => {
        set({
          status: {
            isSyncing: false,
            lastSyncTime: Date.now(),
            lastSyncError: error || null
          }
        })
      }
    }),
    {
      name: STORAGE_KEYS.WEBDAV_CONFIG,
      // 不持久化同步状态和冲突
      // (Don't persist sync status and conflicts)
      partialize: (state) => ({
        config: state.config
      })
    }
  )
)
