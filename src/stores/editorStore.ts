import { create } from 'zustand'
import type { Tab } from '@/types'

interface EditorState {
  // 状态 (State)
  tabs: Tab[]
  activeTabId: string | null

  // 操作方法 (Actions)
  openTab: (noteId: string, title: string) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  updateTabTitle: (tabId: string, title: string) => void
  markTabDirty: (tabId: string, isDirty: boolean) => void
  closeAllTabs: () => void
  closeOtherTabs: (tabId: string) => void

  // 辅助方法 (Helper Methods)
  getActiveTab: () => Tab | null
  isNoteOpen: (noteId: string) => boolean
  closeTabByNoteId: (noteId: string) => void
}

// 生成Tab ID (Generate Tab ID)
const generateTabId = () => `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useEditorStore = create<EditorState>((set, get) => ({
  // 初始状态 (Initial State)
  tabs: [],
  activeTabId: null,

  // 打开标签页 (Open Tab)
  openTab: (noteId, title) => {
    const { tabs } = get()

    // 如果笔记已经打开，切换到该标签
    // (If note is already open, switch to that tab)
    const existingTab = tabs.find(tab => tab.noteId === noteId)
    if (existingTab) {
      set({ activeTabId: existingTab.id })
      return
    }

    // 创建新标签页 (Create new tab)
    const newTab: Tab = {
      id: generateTabId(),
      noteId,
      title,
      isDirty: false
    }

    set({
      tabs: [...tabs, newTab],
      activeTabId: newTab.id
    })
  },

  // 关闭标签页 (Close Tab)
  closeTab: (tabId) => {
    const { tabs, activeTabId } = get()
    const tabIndex = tabs.findIndex(tab => tab.id === tabId)

    if (tabIndex === -1) return

    const newTabs = tabs.filter(tab => tab.id !== tabId)
    let newActiveTabId = activeTabId

    // 如果关闭的是当前活动标签，切换到相邻标签
    // (If closing active tab, switch to adjacent tab)
    if (tabId === activeTabId) {
      if (newTabs.length === 0) {
        newActiveTabId = null
      } else if (tabIndex < newTabs.length) {
        newActiveTabId = newTabs[tabIndex].id
      } else {
        newActiveTabId = newTabs[newTabs.length - 1].id
      }
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveTabId
    })
  },

  // 设置活动标签 (Set Active Tab)
  setActiveTab: (tabId) => {
    set({ activeTabId: tabId })
  },

  // 更新标签标题 (Update Tab Title)
  updateTabTitle: (tabId, title) => {
    set(state => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId ? { ...tab, title } : tab
      )
    }))
  },

  // 标记标签为脏数据 (Mark Tab as Dirty)
  markTabDirty: (tabId, isDirty) => {
    set(state => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId ? { ...tab, isDirty } : tab
      )
    }))
  },

  // 关闭所有标签 (Close All Tabs)
  closeAllTabs: () => {
    set({ tabs: [], activeTabId: null })
  },

  // 关闭其他标签 (Close Other Tabs)
  closeOtherTabs: (tabId) => {
    const { tabs } = get()
    const keepTab = tabs.find(tab => tab.id === tabId)

    if (keepTab) {
      set({
        tabs: [keepTab],
        activeTabId: keepTab.id
      })
    }
  },

  // 获取活动标签 (Get Active Tab)
  getActiveTab: () => {
    const { tabs, activeTabId } = get()
    return tabs.find(tab => tab.id === activeTabId) || null
  },

  // 检查笔记是否已打开 (Check if Note is Open)
  isNoteOpen: (noteId) => {
    return get().tabs.some(tab => tab.noteId === noteId)
  },

  // 根据笔记ID关闭标签页 (Close Tab by Note ID)
  closeTabByNoteId: (noteId) => {
    const { tabs } = get()
    const tab = tabs.find(tab => tab.noteId === noteId)
    
    if (tab) {
      get().closeTab(tab.id)
    }
  }
}))
