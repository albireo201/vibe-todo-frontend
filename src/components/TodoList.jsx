import TodoItem from './TodoItem'

function TodoList({ todos, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return (
      <p className="todo-empty">아직 할 일이 없어요. 첫 번째 할 일을 추가해 보세요 ✨</p>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
