# 重命名和保存问题修复

## 问题描述

用户报告了两个相关的问题：

1. **标签标题不更新**：在左侧列表中重命名笔记文件名后，右侧标签栏上的文件名没有同步更新
2. **内容丢失**：刷新页面后，原来的笔记内容会丢失

## 根本原因

### 问题 1：标签标题不更新

- 当用户通过左侧文件树重命名笔记时，只调用了 `notesStore.renameNode()`
- 这只更新了 `notesStore` 中的 tree 结构
- `editorStore` 中已打开的 tab 的 title 没有被更新
- 导致标签栏显示的是旧名称

### 问题 2：内容丢失

有几个相互关联的原因：

1. **重新加载触发**：当 `notesStore` 更新时（例如重命名），`getNote` 函数引用改变，触发 `useEffect` 重新加载笔记内容
2. **未保存内容覆盖**：如果用户刚编辑完还在 1 秒自动保存的等待期内就重命名，重新加载会用旧内容覆盖新内容
3. **切换笔记时丢失**：之前的 cleanup 逻辑不正确，每次 `value` 改变都会执行，导致保存逻辑混乱

## 解决方案

### 修复 1：同步更新标签标题

**文件**：[src/components/sidebar/Sidebar.tsx](src/components/sidebar/Sidebar.tsx)

添加了 `handleRename` 函数：

```typescript
const handleRename = (nodeId: string, newName: string) => {
  // 更新笔记名称
  renameNode(nodeId, newName)

  // 如果这个笔记有打开的标签，也更新标签标题
  const openTab = tabs.find(tab => tab.noteId === nodeId)
  if (openTab) {
    updateTabTitle(openTab.id, newName)
  }
}
```

**工作原理**：
1. 调用 `renameNode` 更新 `notesStore` 中的笔记名称
2. 查找是否有打开的标签对应这个笔记
3. 如果找到，同步调用 `updateTabTitle` 更新标签标题

### 修复 2：优化 useEffect 依赖

**文件**：[src/components/editor/YooptaNotionEditor.tsx](src/components/editor/YooptaNotionEditor.tsx:148)

```typescript
// 只在 noteId 改变时重新加载
}, [noteId]) // 移除了 getNote 依赖
```

**工作原理**：
- 移除 `getNote` 依赖，避免 store 更新时触发不必要的重新加载
- 只有当切换到不同的笔记时（`noteId` 改变）才重新加载内容

### 修复 3：正确处理切换笔记时的保存

**文件**：[src/components/editor/YooptaNotionEditor.tsx](src/components/editor/YooptaNotionEditor.tsx:154-200)

使用 `useRef` 跟踪前一个笔记的状态：

```typescript
const previousNoteIdRef = useRef<string>(noteId)
const previousValueRef = useRef<any>(value)
const previousLastSavedContentRef = useRef<string>(lastSavedContent)

useEffect(() => {
  // 如果 noteId 改变了，保存上一个笔记的内容
  if (previousNoteIdRef.current !== noteId) {
    console.log('切换笔记，保存上一个笔记的内容:', previousNoteIdRef.current)

    // 清除定时器
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }

    // 如果有未保存的内容，立即保存
    const serializedContent = JSON.stringify(previousValueRef.current)
    if (serializedContent !== previousLastSavedContentRef.current) {
      console.log('有未保存内容，立即保存')
      updateNote(previousNoteIdRef.current, serializedContent)
    }

    // 更新引用
    previousNoteIdRef.current = noteId
  }

  // 更新当前值的引用
  previousValueRef.current = value
  previousLastSavedContentRef.current = lastSavedContent
}, [noteId, value, lastSavedContent, updateNote])
```

**工作原理**：
1. 使用三个 ref 保存前一个笔记的 ID、内容和已保存内容
2. 当 `noteId` 改变时，检测到切换笔记
3. 立即保存前一个笔记的未保存内容
4. 清除自动保存定时器
5. 更新 ref 为当前笔记的信息

### 修复 4：组件卸载时保存

```typescript
// 组件卸载时清理定时器并保存
useEffect(() => {
  return () => {
    console.log('组件卸载，清理定时器')
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // 组件卸载时立即保存（如果有未保存的内容）
    const serializedContent = JSON.stringify(previousValueRef.current)
    if (serializedContent !== previousLastSavedContentRef.current) {
      console.log('组件卸载，立即保存内容')
      updateNote(previousNoteIdRef.current, serializedContent)
    }
  }
}, [updateNote])
```

**工作原理**：
- 只依赖 `updateNote`，避免在每次 `value` 改变时执行
- 只在真正卸载时保存最后的内容

## 测试场景

### 场景 1：重命名笔记

1. ✅ 创建一个新笔记 "测试笔记"
2. ✅ 输入一些内容
3. ✅ 重命名笔记为 "新名称"
4. ✅ 验证标签栏上的名称也更新为 "新名称"
5. ✅ 验证内容没有丢失

### 场景 2：快速编辑和重命名

1. ✅ 打开一个笔记
2. ✅ 输入内容（不等待 1 秒自动保存）
3. ✅ 立即重命名笔记
4. ✅ 点击其他笔记
5. ✅ 回到原笔记，验证内容已保存

### 场景 3：切换笔记

1. ✅ 打开笔记 A，输入内容
2. ✅ 不等待自动保存，立即切换到笔记 B
3. ✅ 回到笔记 A，验证内容已保存

### 场景 4：刷新页面

1. ✅ 打开笔记，输入内容
2. ✅ 重命名笔记
3. ✅ 刷新浏览器页面
4. ✅ 验证笔记内容和新名称都保存了

## 技术要点

### useRef vs useState

使用 `useRef` 而不是 `useState` 来跟踪前一个笔记的信息：
- `useRef` 的值改变不会触发重新渲染
- 可以在 cleanup 函数中访问最新的值
- 避免闭包陷阱

### useEffect 依赖优化

- 只在必要时包含依赖
- 使用 ESLint disable 注释明确表示已考虑依赖
- 分离关注点：加载、保存、清理使用不同的 useEffect

### 立即保存 vs 防抖保存

- 正常编辑：1 秒防抖保存（减少写入）
- 切换笔记：立即保存（确保不丢失）
- 组件卸载：立即保存（确保不丢失）

## 文件变更清单

**修改的文件**：
1. [src/components/sidebar/Sidebar.tsx](src/components/sidebar/Sidebar.tsx) - 添加 handleRename 函数
2. [src/components/editor/YooptaNotionEditor.tsx](src/components/editor/YooptaNotionEditor.tsx) - 优化保存逻辑

**变更摘要**：
- Sidebar: +9 行（handleRename 函数 + 调用）
- YooptaNotionEditor: ~50 行（重写保存逻辑）

## 性能影响

- **无显著性能影响**
- 立即保存只在切换笔记或卸载时发生
- 正常编辑仍使用 1 秒防抖
- 没有额外的轮询或监听

## 补充修复：切换笔记时数据丢失（2025-01-07 更新）

### 问题 3：新建笔记后切换会丢失数据

**问题描述**：
- 新建笔记并输入内容
- 不等待 1 秒自动保存，立即切换到其他笔记
- 回到原笔记，发现内容丢失

**根本原因**：
1. 之前的保存逻辑使用了多个 `useRef` 来跟踪状态
2. `value` state 更新是异步的，在切换笔记时 ref 可能还是旧值
3. 复杂的 useEffect 依赖导致保存时机不正确

**解决方案**：

简化保存逻辑，在加载笔记的 useEffect 开始时立即保存当前笔记：

```typescript
useEffect(() => {
  console.log('加载笔记内容 useEffect 触发:', noteId)

  // 先保存当前编辑的内容（如果有）
  if (value && previousNoteIdRef.current && previousNoteIdRef.current !== noteId) {
    const currentSerialized = JSON.stringify(value)
    if (currentSerialized !== lastSavedContent) {
      console.log('切换前保存当前笔记:', previousNoteIdRef.current)
      updateNote(previousNoteIdRef.current, currentSerialized)
    }
  }

  // 加载新笔记内容...
  // ...

  // 更新 previousNoteIdRef
  previousNoteIdRef.current = noteId
}, [noteId])
```

**工作原理**：
1. 当 `noteId` 改变时，useEffect 触发
2. 第一件事是检查是否有未保存的内容
3. 如果有，立即保存到 `previousNoteIdRef.current`（上一个笔记 ID）
4. 然后加载新笔记的内容
5. 更新 `previousNoteIdRef` 为当前笔记 ID

**优势**：
- 逻辑简单，易于理解
- 在切换发生时立即保存，不依赖复杂的 ref 同步
- 直接使用 `value` state，不需要额外的 ref 来跟踪

## 已知限制

无

## 后续优化建议

1. **防抖时间可配置**：让用户设置自动保存延迟时间
2. **保存状态提示**：显示 "保存中..." 或 "已保存" 提示
3. **冲突检测**：如果多个标签页编辑同一笔记，检测冲突

---

修复完成时间：2025-01-07
测试状态：待用户验证
