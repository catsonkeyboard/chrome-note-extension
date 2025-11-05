import { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useNotesStore } from '@/stores/notesStore'
import { useEditorStore } from '@/stores/editorStore'

interface MarkdownEditorProps {
  noteId: string
  tabId: string
}

export function MarkdownEditor({ noteId, tabId }: MarkdownEditorProps) {
  const { getNote, updateNote } = useNotesStore()
  const { markTabDirty } = useEditorStore()

  const note = getNote(noteId)
  const [content, setContent] = useState(note?.content || '')
  const [lastSavedContent, setLastSavedContent] = useState(note?.content || '')

  // 加载笔记内容 (Load note content)
  useEffect(() => {
    const currentNote = getNote(noteId)
    if (currentNote) {
      setContent(currentNote.content)
      setLastSavedContent(currentNote.content)
    }
  }, [noteId, getNote])

  // 自动保存 (Auto-save)
  useEffect(() => {
    const isDirty = content !== lastSavedContent

    // 标记标签为dirty (Mark tab as dirty)
    markTabDirty(tabId, isDirty)

    if (!isDirty) return

    // 防抖保存 (Debounced save)
    const timer = setTimeout(() => {
      updateNote(noteId, content)
      setLastSavedContent(content)
      markTabDirty(tabId, false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, lastSavedContent, noteId, tabId, updateNote, markTabDirty])

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        笔记不存在
      </div>
    )
  }

  // 检测主题 (Detect theme)
  const isDark = document.documentElement.classList.contains('dark')

  return (
    <div className="h-full w-full" data-color-mode={isDark ? 'dark' : 'light'}>
      <MDEditor
        value={content}
        onChange={(val) => setContent(val || '')}
        height="100%"
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={false}
      />
    </div>
  )
}
