import { useState } from 'react'
import { CloudUpload, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSyncStore } from '@/stores/syncStore'
import { useNotesStore } from '@/stores/notesStore'
import { webdavSync } from '@/lib/webdav'

export function SyncButton() {
  const { config, status, startSync, finishSync } = useSyncStore()
  const { tree } = useNotesStore()
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    if (!config) {
      alert('请先配置 WebDAV 服务器')
      return
    }

    setSyncing(true)
    startSync()

    try {
      // 初始化 WebDAV 客户端
      webdavSync.init(config)

      // 收集所有笔记
      const allNotes: any[] = []
      const collectNotes = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.type === 'note') {
            allNotes.push(node)
          } else if (node.type === 'folder') {
            collectNotes(node.children)
          }
        }
      }
      collectNotes(tree)

      // 执行同步
      await webdavSync.fullSync(tree, allNotes)

      finishSync()
      alert('同步成功！')
    } catch (error) {
      const errorMessage = (error as Error).message
      finishSync(errorMessage)
      alert('同步失败：' + errorMessage)
    } finally {
      setSyncing(false)
    }
  }

  const getTooltipContent = () => {
    if (!config) return '请先配置 WebDAV'
    if (syncing) return '同步中...'
    if (status.lastSyncTime) {
      const date = new Date(status.lastSyncTime)
      return `上次同步：${date.toLocaleString()}`
    }
    return '点击同步'
  }

  const getIcon = () => {
    if (syncing) return <Loader2 className="h-4 w-4 animate-spin" />
    if (status.lastSyncError) return <X className="h-4 w-4 text-destructive" />
    if (status.lastSyncTime) return <Check className="h-4 w-4 text-green-600" />
    return <CloudUpload className="h-4 w-4" />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            disabled={!config || syncing}
          >
            {getIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
