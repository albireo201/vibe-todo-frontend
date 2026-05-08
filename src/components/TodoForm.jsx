import { useState } from 'react'

function TodoForm({ onAdd, disabled }) {
  const [value, setValue] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    try {
      await onAdd(trimmed)
      setValue('')
    } catch {
      // 에러는 상위에서 표시
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-form__input"
        placeholder="할 일을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="todo-form__btn"
        disabled={disabled || !value.trim()}
      >
        추가
      </button>
    </form>
  )
}

export default TodoForm
