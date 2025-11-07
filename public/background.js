// Background service worker for Markdown Notes extension

// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 在新标签页中打开应用
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  })
})
