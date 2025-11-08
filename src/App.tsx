import { Layout } from './components/Layout'
import { Toaster } from '@/components/ui/sonner'
import { useEffect } from 'react'
import { useNotesStore } from '@/stores/notesStore'

function App() {
  const setTree = useNotesStore((state) => state.setTree)

  // 监听来自 background script 的消息
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'NOTES_UPDATED') {
        // 重新从 localStorage 加载笔记树
        const notesTreeStr = localStorage.getItem('notes-tree')
        if (notesTreeStr) {
          try {
            const parsed = JSON.parse(notesTreeStr)
            // Zustand persist 格式: {state: {tree: [...], selectedNoteId: null}, version: 0}
            const tree = parsed.state?.tree || parsed.tree || []
            setTree(tree)
          } catch (error) {
            console.error('Failed to reload notes tree:', error)
          }
        }
      }
    }

    // 添加消息监听器
    if (chrome?.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage)

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage)
      }
    }
  }, [setTree])

  return (
    <>
      <Layout />
      <Toaster />
    </>
  )
}

export default App
