import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Tab } from '@/types'

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string | null
  onSelectTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
}

export function TabBar({ tabs, activeTabId, onSelectTab, onCloseTab }: TabBarProps) {
  if (tabs.length === 0) return null

  return (
    <ScrollArea className="w-full border-b border-border">
      <div className="flex items-center h-10 px-2 gap-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'group flex items-center gap-2 px-3 h-8 rounded-md cursor-pointer border border-transparent',
              'hover:bg-accent transition-colors',
              activeTabId === tab.id && 'bg-accent border-border'
            )}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="text-sm truncate max-w-[120px]">
              {tab.isDirty && <span className="text-destructive mr-1">•</span>}
              {tab.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onCloseTab(tab.id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
