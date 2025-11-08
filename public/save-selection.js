// 获取 URL 参数
const urlParams = new URLSearchParams(window.location.search)
const selectedText = urlParams.get('text') || ''
const pageUrl = urlParams.get('url') || ''
const pageTitle = urlParams.get('title') || ''

// 显示预览
document.getElementById('preview').textContent = selectedText

// 自动生成笔记名（使用页面标题）
const noteNameInput = document.getElementById('noteName')
noteNameInput.value = pageTitle || '网页摘录'

// 保存按钮
document.getElementById('saveBtn').addEventListener('click', async () => {
  const noteName = noteNameInput.value.trim()

  if (!noteName) {
    showMessage('请输入笔记名称', 'error')
    return
  }

  const saveBtn = document.getElementById('saveBtn')
  saveBtn.disabled = true
  saveBtn.textContent = '保存中...'

  try {
    // 创建 Yoopta 格式的内容
    const yooptaContent = createYooptaContent(selectedText, pageUrl, pageTitle)

    // 从 localStorage 读取现有笔记树（Zustand persist 格式）
    const notesTreeStr = localStorage.getItem('notes-tree')
    let notesTree = []

    if (notesTreeStr) {
      try {
        const parsed = JSON.parse(notesTreeStr)
        // Zustand persist 将 state 包装在 {state: {...}} 中
        notesTree = parsed.state?.tree || parsed.tree || []
      } catch (e) {
        console.error('Failed to parse notes tree:', e)
        notesTree = []
      }
    }

    // 生成新笔记 ID (与 notesStore 保持一致)
    const noteId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = Date.now()

    // 序列化笔记内容（Yoopta格式的JSON字符串）
    const serializedContent = JSON.stringify(yooptaContent)

    // 创建新笔记节点（content字段包含完整内容）
    const newNote = {
      id: noteId,
      name: noteName,
      type: 'note',
      content: serializedContent,
      createdAt: now,
      updatedAt: now
    }

    // 添加到笔记树
    notesTree.push(newNote)

    // 保存笔记树（保持 Zustand persist 格式）
    const notesTreeData = notesTreeStr ? JSON.parse(notesTreeStr) : { state: {}, version: 0 }
    notesTreeData.state = notesTreeData.state || {}
    notesTreeData.state.tree = notesTree
    notesTreeData.state.selectedNoteId = notesTreeData.state.selectedNoteId || null

    localStorage.setItem('notes-tree', JSON.stringify(notesTreeData))

    // 同时保存到单独的 note-${id} key（保持兼容性）
    localStorage.setItem(`note-${noteId}`, serializedContent)

    // 通知插件页面刷新（如果打开着）
    chrome.runtime.sendMessage({
      type: 'NOTES_UPDATED'
    }).catch(() => {
      // 忽略错误（如果没有接收者）
    })

    showMessage('保存成功！', 'success')

    // 1秒后关闭窗口
    setTimeout(() => {
      window.close()
    }, 1000)

  } catch (error) {
    console.error('保存失败:', error)
    showMessage('保存失败: ' + error.message, 'error')
    saveBtn.disabled = false
    saveBtn.textContent = '保存'
  }
})

// 取消按钮
document.getElementById('cancelBtn').addEventListener('click', () => {
  window.close()
})

// 回车键保存
noteNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('saveBtn').click()
  }
})

// 显示消息
function showMessage(text, type) {
  const message = document.getElementById('message')
  message.textContent = text
  message.className = `message ${type}`
  message.style.display = 'block'
}

// 创建 Yoopta 格式的内容
function createYooptaContent(text, url, title) {
  const blocks = []
  let order = 0

  // 添加来源信息块（引用格式）
  if (title || url) {
    const sourceId = `source-${Date.now()}`
    blocks.push({
      id: sourceId,
      type: 'Blockquote',
      meta: {
        order: order++,
        depth: 0,
      },
      value: [
        {
          id: `${sourceId}-0`,
          type: 'blockquote',
          children: [
            { text: '摘录自: ' },
            { text: title || url, bold: true }
          ],
        },
      ],
    })

    if (url && title) {
      const urlId = `url-${Date.now()}`
      blocks.push({
        id: urlId,
        type: 'Paragraph',
        meta: {
          order: order++,
          depth: 0,
        },
        value: [
          {
            id: `${urlId}-0`,
            type: 'paragraph',
            children: [
              { text: '链接: ' },
              { text: url, code: true }
            ],
          },
        ],
      })
    }
  }

  // 分段处理选中的文本
  const paragraphs = text.split('\n').filter(p => p.trim())

  paragraphs.forEach((paragraph, index) => {
    const paraId = `para-${Date.now()}-${index}`
    blocks.push({
      id: paraId,
      type: 'Paragraph',
      meta: {
        order: order++,
        depth: 0,
      },
      value: [
        {
          id: `${paraId}-0`,
          type: 'paragraph',
          children: [{ text: paragraph }],
        },
      ],
    })
  })

  // 如果没有任何段落，添加一个空段落
  if (blocks.length === 0) {
    const emptyId = `empty-${Date.now()}`
    blocks.push({
      id: emptyId,
      type: 'Paragraph',
      meta: {
        order: 0,
        depth: 0,
      },
      value: [
        {
          id: `${emptyId}-0`,
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ],
    })
  }

  // 转换为对象格式
  const result = {}
  blocks.forEach(block => {
    result[block.id] = block
  })

  return result
}
