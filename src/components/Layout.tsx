import { Sidebar } from './sidebar/Sidebar'
import { EditorPanel } from './editor/EditorPanel'
import { SyncSettings } from './sync/SyncSettings'
import { SyncButton } from './sync/SyncButton'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'

export function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 初始化主题 (Initialize theme)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* 顶部工具栏 (Top Toolbar) */}
      <header className="border-b border-border px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Markdown Notes</h1>
        <div className="flex items-center gap-1">
          <SyncButton />
          <SyncSettings />
          <Button variant="ghost" size="icon" onClick={toggleTheme} title="切换主题">
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* 主内容区域 (Main Content Area) */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <EditorPanel />
      </main>
    </div>
  )
}
