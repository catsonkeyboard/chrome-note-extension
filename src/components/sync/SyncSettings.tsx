import { useState } from 'react'
import { Cloud, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSyncStore } from '@/stores/syncStore'
import { webdavSync } from '@/lib/webdav'
import type { WebDAVConfig } from '@/types'

export function SyncSettings() {
  const { config, setConfig } = useSyncStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<WebDAVConfig>(
    config || {
      url: '',
      username: '',
      password: '',
      remotePath: '/notes'
    }
  )
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      webdavSync.init(formData)
      const success = await webdavSync.testConnection()

      setTestResult({
        success,
        message: success ? '连接成功！' : '连接失败，请检查配置'
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: '连接失败：' + (error as Error).message
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    setConfig(formData)
    webdavSync.init(formData)
    setOpen(false)
  }

  const handleClear = () => {
    setConfig(null)
    setFormData({
      url: '',
      username: '',
      password: '',
      remotePath: '/notes'
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="同步设置">
          <Cloud className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>WebDAV 同步设置</DialogTitle>
          <DialogDescription>
            配置 WebDAV 服务器以同步您的笔记
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">服务器地址</label>
            <Input
              placeholder="https://example.com/webdav"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">用户名</label>
            <Input
              placeholder="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">密码</label>
            <Input
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">远程路径</label>
            <Input
              placeholder="/notes"
              value={formData.remotePath}
              onChange={(e) => setFormData({ ...formData, remotePath: e.target.value })}
            />
          </div>

          {/* 测试结果 (Test Result) */}
          {testResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.success ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            清除配置
          </Button>
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !formData.url || !formData.username}
          >
            {testing ? '测试中...' : '测试连接'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.url || !formData.username}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
