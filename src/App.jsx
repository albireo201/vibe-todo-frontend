import { useEffect, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import './App.css'

const BASE_URL = import.meta.env.VITE_API_URL || '/todos'

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = '요청에 실패했습니다.'
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await request(BASE_URL)
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || '할 일을 불러오지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAdd = async (content) => {
    try {
      setError('')
      const newTodo = await request(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      setTodos((prev) => [newTodo, ...prev])
    } catch (err) {
      setError(err.message || '추가에 실패했어요.')
      throw err
    }
  }

  const handleUpdate = async (id, content) => {
    try {
      setError('')
      const updated = await request(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      })
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (err) {
      setError(err.message || '수정에 실패했어요.')
      throw err
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await request(`${BASE_URL}/${id}`, { method: 'DELETE' })
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message || '삭제에 실패했어요.')
      throw err
    }
  }

  return (
    <div className="app">
      <div className="app__card">
        <header className="app__header">
          <h1 className="app__title">할 일 목록</h1>
          <p className="app__subtitle">오늘의 할 일을 관리해 보세요.</p>
        </header>

        <TodoForm onAdd={handleAdd} disabled={loading} />

        {error && <div className="app__error">{error}</div>}

        {loading ? (
          <p className="app__loading">불러오는 중…</p>
        ) : (
          <TodoList
            todos={todos}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}

        <footer className="app__footer">
          전체 {todos.length}개
        </footer>
      </div>
    </div>
  )
}

export default App
