import { TabBar } from './TabBar'
import { MarkdownEditor } from './MarkdownEditor'
import { useEditorStore } from '@/stores/editorStore'
import { FileText } from 'lucide-react'

export function EditorPanel() {
  const { tabs, activeTabId, setActiveTab, closeTab, getActiveTab } = useEditorStore()

  const activeTab = getActiveTab()

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* 标签栏 (Tab Bar) */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTab}
        onCloseTab={closeTab}
      />

      {/* 编辑器区域 (Editor Area) */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (
          <MarkdownEditor noteId={activeTab.noteId} tabId={activeTab.id} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileText className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg">欢迎使用 Markdown 笔记</p>
            <p className="text-sm mt-2">从左侧选择或创建一个笔记开始</p>
          </div>
        )}
      </div>
    </div>
  )
}
