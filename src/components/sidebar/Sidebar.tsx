import { DraggableFileTree } from './DraggableFileTree'
import { NewFileDialog } from './NewFileDialog'
import { ImportMarkdownButton } from './ImportMarkdownButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotesStore } from '@/stores/notesStore'
import { useEditorStore } from '@/stores/editorStore'

export function Sidebar() {
  const { tree, selectedNoteId, createNote, createFolder, renameNode, deleteNode, selectNote, getNote, moveNode, reorderNodes, updateNote } = useNotesStore()
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

  const handleCreateNoteInFolder = (folderId: string, name: string) => {
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

  return (
    <div className="w-64 border-r border-border flex flex-col h-full bg-background">
      {/* 工具栏 (Toolbar) */}
      <div className="p-2 flex items-center justify-between border-b border-border">
        <h2 className="text-sm font-semibold">Notes</h2>
        <div className="flex gap-1">
          <ImportMarkdownButton onImport={handleImportMarkdown} />
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
          />
        </div>
      </ScrollArea>
    </div>
  )
}
