# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that provides a Markdown note-taking application with the following features:
- Left sidebar: Tree-based file list for organizing notes with drag-and-drop support
- Right panel: Tabbed Markdown editor with multi-document support
- Storage: Notes stored in localStorage with WebDAV sync capability
- UI: Built with shadcn/ui and Tailwind CSS
- Framework: React with Zustand for state management
- Build: Vite
- Activation: Click extension icon to open app in a new tab

## Development Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### State Management (Zustand)
The app uses Zustand for state management with the following stores:

1. **notesStore**: Manages note files and folders
   - File tree structure
   - CRUD operations for notes
   - localStorage persistence

2. **editorStore**: Manages editor tabs and active documents
   - Open tabs tracking
   - Active tab selection
   - Tab creation/closing

3. **syncStore**: Handles WebDAV synchronization
   - WebDAV connection settings
   - Sync status and operations
   - Conflict resolution

### Component Structure

```
src/
├── components/
│   ├── sidebar/
│   │   ├── FileTree.tsx      # Recursive tree component
│   │   ├── FileItem.tsx      # Individual file/folder item
│   │   └── NewFileDialog.tsx # Create new note/folder
│   ├── editor/
│   │   ├── TabBar.tsx        # Tab management UI
│   │   ├── MarkdownEditor.tsx # Main editor component
│   │   └── Preview.tsx       # Markdown preview panel
│   ├── sync/
│   │   ├── SyncSettings.tsx  # WebDAV configuration
│   │   └── SyncStatus.tsx    # Sync indicator
│   └── ui/                   # shadcn components
├── stores/
│   ├── notesStore.ts
│   ├── editorStore.ts
│   └── syncStore.ts
├── lib/
│   ├── storage.ts            # localStorage utilities
│   ├── webdav.ts            # WebDAV client
│   └── markdown.ts          # Markdown processing
└── types/
    └── index.ts             # TypeScript definitions
```

### Chrome Extension Structure

```
public/
├── manifest.json            # Chrome extension manifest (V3)
├── icons/                   # Extension icons
└── background.js           # Service worker for background tasks
```

### Data Flow

1. User clicks file in tree → `notesStore.selectFile()` → `editorStore.openTab()`
2. User edits content → `notesStore.updateNote()` → localStorage save → WebDAV sync trigger
3. Sync process → `syncStore.sync()` → WebDAV upload/download → localStorage update

### Storage Schema

localStorage keys:
- `notes-tree`: JSON structure of files/folders
- `note-{id}`: Individual note content
- `webdav-config`: WebDAV server settings
- `sync-status`: Last sync timestamp and status

### Key Technical Decisions

1. **localStorage over IndexedDB**: Simpler API, sufficient for text-based notes
2. **Tab state in memory**: Tabs don't persist on reload (by design)
3. **Zustand over Redux**: Simpler API, less boilerplate
4. **Vite over CRA**: Faster builds, better DX
5. **Manifest V3**: Chrome's latest extension format
6. **Extension activation**: Click icon to open in new tab (not as new tab override)
7. **Background service worker**: Handles extension icon clicks to open the app

### WebDAV Integration

- Uses standard WebDAV protocol (RFC 4918)
- Automatic conflict detection based on timestamps
- Manual sync only (no auto-sync to preserve battery)
- Supports standard WebDAV servers (Nextcloud, ownCloud, etc.)

### Building for Production

The build process:
1. Vite bundles React app → `dist/`
2. Copy `manifest.json` and `public/` files
3. Generate source maps (for debugging)
4. Output ready for Chrome Web Store upload

### Loading in Chrome

1. Build the extension: `npm run build`
2. Open Chrome → Extensions → Enable Developer Mode
3. Click "Load unpacked" → Select `dist/` folder

## MCP Servers

- **shadcn**: Used for adding UI components. Run commands like: `npx shadcn@latest add button`
