import { useState } from 'react'

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.content)
  const [busy, setBusy] = useState(false)

  const startEdit = () => {
    setEditValue(todo.content)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditValue(todo.content)
  }

  const saveEdit = async () => {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === todo.content) {
      cancelEdit()
      return
    }
    try {
      setBusy(true)
      await onUpdate(todo._id, trimmed)
      setIsEditing(false)
    } catch {
      // 상위에서 처리
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 할 일을 삭제하시겠어요?')) return
    try {
      setBusy(true)
      await onDelete(todo._id)
    } finally {
      setBusy(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit()
    else if (e.key === 'Escape') cancelEdit()
  }

  return (
    <li className={`todo-item ${busy ? 'is-busy' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          className="todo-item__input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={busy}
        />
      ) : (
        <span className="todo-item__text">{todo.content}</span>
      )}

      <div className="todo-item__actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={saveEdit}
              disabled={busy}
            >
              저장
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={cancelEdit}
              disabled={busy}
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={startEdit}
              disabled={busy}
            >
              수정
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={busy}
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
