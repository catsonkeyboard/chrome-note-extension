import { DraggableFileTree } from './DraggableFileTree'
import { NewFileDialog } from './NewFileDialog'
import { ImportMarkdownButton } from './ImportMarkdownButton'
import { ImportFolderButton } from './ImportFolderButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotesStore } from '@/stores/notesStore'
import { useEditorStore } from '@/stores/editorStore'
import type { FolderStructure } from '@/lib/markdown-import'
import { yooptaToMarkdown } from '@/lib/markdown-import'
import { toast } from 'sonner'

export function Sidebar() {
  const { tree, selectedNoteId, createNote, createFolder, renameNode, deleteNode, selectNote, getNote, moveNode, reorderNodes, updateNote, sortFolderChildren } = useNotesStore()
  const { openTab, tabs, updateTabTitle, closeTabByNoteId } = useEditorStore()

  const handleSelectNote = (noteId: string) => {
    const note = getNote(noteId)
    if (note) {
      selectNote(noteId)
      openTab(noteId, note.name)
    }
  }

  const handleCreateNote = (name: string) => {
    const note = createNote(null, name)
    selectNote(note.id)
    openTab(note.id, note.name)
  }

  const handleCreateFolder = (name: string) => {
    createFolder(null, name)
  }

  const handleCreateNoteInFolder = (folderId: string | null, name: string) => {
    const note = createNote(folderId, name)
    selectNote(note.id)
    openTab(note.id, note.name)
  }

  const handleCreateFolderInFolder = (parentFolderId: string, name: string) => {
    createFolder(parentFolderId, name)
  }

  const handleRename = (nodeId: string, newName: string) => {
    // 更新笔记名称
    renameNode(nodeId, newName)

    // 如果这个笔记有打开的标签，也更新标签标题
    const openTab = tabs.find(tab => tab.noteId === nodeId)
    if (openTab) {
      updateTabTitle(openTab.id, newName)
    }
  }

  const handleDelete = (nodeId: string) => {
    // 先关闭对应的标签页
    closeTabByNoteId(nodeId)
    // 然后删除笔记
    deleteNode(nodeId)
  }

  const handleImportMarkdown = (name: string, content: any) => {
    // 创建新笔记并设置内容
    const note = createNote(null, name)
    // 更新笔记内容为导入的 Markdown
    updateNote(note.id, JSON.stringify(content))
    // 选择并打开笔记
    selectNote(note.id)
    openTab(note.id, note.name)
  }

  const handleImportFolder = (structure: FolderStructure, folderName: string) => {
    // 递归创建文件夹和笔记
    const createStructure = (struct: FolderStructure, parentId: string | null = null) => {
      Object.values(struct).forEach((item) => {
        if (item.type === 'folder') {
          // 创建文件夹
          const folder = createFolder(parentId, item.name)
          // 递归处理子项
          if (item.children) {
            createStructure(item.children, folder.id)
          }
        } else if (item.type === 'file') {
          // 创建笔记
          const note = createNote(parentId, item.name)
          // 设置笔记内容
          updateNote(note.id, JSON.stringify(item.content))
        }
      })
    }

    // 创建根文件夹
    const rootFolder = createFolder(null, folderName)
    // 从根文件夹开始创建结构
    const firstLevelStruct = structure[Object.keys(structure)[0]]
    if (firstLevelStruct && firstLevelStruct.children) {
      createStructure(firstLevelStruct.children, rootFolder.id)
    }
  }

  const handleCopyToClipboard = async (noteId: string) => {
    const note = getNote(noteId)
    if (!note || !note.content) {
      toast.error('无法复制：笔记内容为空')
      return
    }

    try {
      // Parse the Yoopta content
      const yooptaContent = JSON.parse(note.content)
      // Convert to markdown
      const markdown = yooptaToMarkdown(yooptaContent)

      // Copy to clipboard
      await navigator.clipboard.writeText(markdown)
      toast.success('已复制到剪贴板')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('复制失败')
    }
  }

  const handleSortFolder = (folderId: string) => {
    sortFolderChildren(folderId)
    toast.success('已按名称排序')
  }

  return (
    <div className="w-64 border-r border-border flex flex-col h-full bg-background">
      {/* 工具栏 (Toolbar) */}
      <div className="p-2 flex items-center justify-between border-b border-border">
        <h2 className="text-sm font-semibold">Notes</h2>
        <div className="flex gap-1">
          <ImportMarkdownButton onImport={handleImportMarkdown} />
          <ImportFolderButton onImport={handleImportFolder} />
          <NewFileDialog type="note" onConfirm={handleCreateNote} />
          <NewFileDialog type="folder" onConfirm={handleCreateFolder} />
        </div>
      </div>

      {/* 文件树 (File Tree) */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <DraggableFileTree
            nodes={tree}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onRename={handleRename}
            onDelete={handleDelete}
            onCreateNote={handleCreateNoteInFolder}
            onCreateFolder={handleCreateFolderInFolder}
            onMove={moveNode}
            onReorder={reorderNodes}
            onCopyToClipboard={handleCopyToClipboard}
            onSortFolder={handleSortFolder}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
