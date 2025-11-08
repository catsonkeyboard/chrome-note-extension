// Background service worker for Notes extension

// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 在新标签页中打开应用
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  })
})

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToNotes',
    title: '保存到 Notes',
    contexts: ['selection']
  })
})

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToNotes' && info.selectionText) {
    // 打开输入框让用户输入笔记名
    chrome.windows.create({
      url: chrome.runtime.getURL(`save-selection.html?text=${encodeURIComponent(info.selectionText)}&url=${encodeURIComponent(tab.url)}&title=${encodeURIComponent(tab.title)}`),
      type: 'popup',
      width: 500,
      height: 300
    })
  }
})
