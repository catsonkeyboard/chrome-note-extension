import { useEffect, useState, useRef, useMemo } from 'react'
import YooptaEditor, { createYooptaEditor, YooEditor } from '@yoopta/editor'
import Paragraph from '@yoopta/paragraph'
import Blockquote from '@yoopta/blockquote'
import Code from '@yoopta/code'
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings'
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists'
import Link from '@yoopta/link'
import { Bold, Italic, CodeMark, Strike, Underline } from '@yoopta/marks'
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool'
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list'
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar'
import { useNotesStore } from '@/stores/notesStore'
import { useEditorStore } from '@/stores/editorStore'
import { ExportButton } from './ExportButton'
import './yoopta-styles.css'

interface YooptaNotionEditorProps {
  noteId: string
  tabId: string
}

// 定义插件 (在组件外部定义以避免重新创建)
const plugins = [
  Paragraph,
  Blockquote,
  Code,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  BulletedList,
  NumberedList,
  TodoList,
  Link,
]

// 定义标记 (Marks)
const marks = [Bold, Italic, CodeMark, Strike, Underline]

// 定义工具
const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
}

// 创建空的 Yoopta 文档结构
const createEmptyYooptaValue = () => {
  const id = Date.now().toString()
  return {
    [id]: {
      id,
      type: 'Paragraph',
      meta: {
        order: 0,
        depth: 0,
      },
      value: [
        {
          id: `${id}-0`,
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ],
    },
  }
}

export function YooptaNotionEditor({ noteId, tabId }: YooptaNotionEditorProps) {
  const { getNote, updateNote } = useNotesStore()
  const { markTabDirty } = useEditorStore()

  const note = getNote(noteId)
  const [value, setValue] = useState<any>()
  const [lastSavedContent, setLastSavedContent] = useState<string>('')
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // 用于跟踪前一个笔记 ID 和标签页 ID（必须在 useEffect 前初始化）
  const previousNoteIdRef = useRef<string>(noteId)
  const previousTabIdRef = useRef<string>(tabId)

  // 为每个标签页创建独立的编辑器实例 (使用 tabId 作为 key)
  // Create independent editor instance for each tab (use tabId as key)
  const editor: YooEditor = useMemo(() => {
    console.log('创建新的编辑器实例，tabId:', tabId)
    return createYooptaEditor()
  }, [tabId])

  // 调试日志
  console.log('YooptaNotionEditor 渲染:', {
    noteId,
    tabId,
    previousNoteId: previousNoteIdRef.current,
    note: !!note,
    value,
    isInitialized
  })

  // 加载笔记内容
  useEffect(() => {
    console.log('=== 加载笔记内容 useEffect 触发 ===')
    console.log('当前 noteId:', noteId)
    console.log('当前 tabId:', tabId)
    console.log('上一个 noteId:', previousNoteIdRef.current)
    console.log('上一个 tabId:', previousTabIdRef.current)
    console.log('当前 value:', value)
    console.log('lastSavedContent:', lastSavedContent)

    // 检查是否是切换标签页或笔记
    const isTabChanged = previousTabIdRef.current !== tabId
    const isNoteChanged = previousNoteIdRef.current !== noteId

    // 先保存当前编辑的内容（如果有切换）
    if (value && (isTabChanged || isNoteChanged)) {
      // 只有在切换到不同的笔记时才保存（切换标签页但笔记相同不需要保存）
      if (isNoteChanged && previousNoteIdRef.current) {
        const currentSerialized = JSON.stringify(value)
        console.log('当前序列化内容长度:', currentSerialized.length)
        console.log('已保存内容长度:', lastSavedContent.length)

        if (currentSerialized !== lastSavedContent) {
          console.log('✅ 切换前保存当前笔记:', previousNoteIdRef.current)
          updateNote(previousNoteIdRef.current, currentSerialized)
        } else {
          console.log('⏭️ 内容未变化，跳过保存')
        }
      }
    }

    // 加载新笔记内容
    const currentNote = getNote(noteId)
    console.log('获取到的笔记:', currentNote)

    if (currentNote) {
      const content = currentNote.content
      console.log('笔记内容:', content)

      let newValue
      let newLastSavedContent = ''

      // 如果内容为空，使用空的 Yoopta 结构
      if (!content) {
        console.log('内容为空，创建新的空文档')
        newValue = createEmptyYooptaValue()
        newLastSavedContent = ''
      } else {
        // 尝试解析 JSON 格式的内容
        try {
          newValue = JSON.parse(content)
          console.log('成功解析 JSON 内容:', newValue)
          newLastSavedContent = content
        } catch (error) {
          // 如果解析失败（旧格式数据），使用空文档
          console.warn('无法解析笔记内容，创建新的空文档:', error)
          newValue = createEmptyYooptaValue()
          newLastSavedContent = ''
        }
      }

      // 更新状态
      setValue(newValue)
      setLastSavedContent(newLastSavedContent)
      setIsInitialized(false)

      // 使用编辑器的 setEditorValue 方法确保内容被正确加载
      // 使用 requestAnimationFrame 确保 DOM 已更新
      requestAnimationFrame(() => {
        console.log('使用 editor.setEditorValue 设置内容')
        editor.setEditorValue(newValue)
        setIsInitialized(true)
      })

      // 更新 refs
      previousNoteIdRef.current = noteId
      previousTabIdRef.current = tabId
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, tabId]) // 在 noteId 或 tabId 改变时重新加载

  // 处理内容变化
  const handleChange = (newValue: any) => {
    setValue(newValue)

    // 序列化内容
    const serializedContent = JSON.stringify(newValue)
    const isDirty = serializedContent !== lastSavedContent

    markTabDirty(tabId, isDirty)

    // 清除之前的定时器
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // 设置新的防抖保存
    if (isDirty) {
      saveTimerRef.current = setTimeout(() => {
        updateNote(noteId, serializedContent)
        setLastSavedContent(serializedContent)
        markTabDirty(tabId, false)
      }, 1000)
    }
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  if (!note) {
    console.log('笔记不存在!')
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        笔记不存在
      </div>
    )
  }

  // 编辑器内容区域引用，用于导出
  const editorContentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="h-full w-full flex flex-col overflow-hidden yoopta-editor-container">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="text-sm font-medium text-foreground">{note.name}</div>
        <ExportButton
          yooptaValue={value}
          editorElementRef={editorContentRef}
          filename={note.name}
        />
      </div>

      {/* 编辑器内容区域 */}
      <div ref={editorContentRef} className="flex-1 overflow-auto p-4">
        <YooptaEditor
          editor={editor}
          plugins={plugins}
          marks={marks}
          tools={TOOLS}
          value={value}
          onChange={handleChange}
          autoFocus
          placeholder="输入 '/' 打开命令菜单"
          style={{
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            paddingBottom: '100px',
          }}
        />
      </div>
    </div>
  )
}
