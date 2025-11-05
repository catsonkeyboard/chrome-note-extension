import { FileTree } from './FileTree'
import { NewFileDialog } from './NewFileDialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotesStore } from '@/stores/notesStore'
import { useEditorStore } from '@/stores/editorStore'

export function Sidebar() {
  const { tree, selectedNoteId, createNote, createFolder, renameNode, deleteNode, selectNote, getNote } = useNotesStore()
  const { openTab } = useEditorStore()

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

  return (
    <div className="w-64 border-r border-border flex flex-col h-full bg-background">
      {/* 工具栏 (Toolbar) */}
      <div className="p-2 flex items-center justify-between border-b border-border">
        <h2 className="text-sm font-semibold">笔记本</h2>
        <div className="flex gap-1">
          <NewFileDialog type="note" onConfirm={handleCreateNote} />
          <NewFileDialog type="folder" onConfirm={handleCreateFolder} />
        </div>
      </div>

      {/* 文件树 (File Tree) */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <FileTree
            nodes={tree}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onRename={renameNode}
            onDelete={deleteNode}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
