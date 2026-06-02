import { useState, useEffect } from 'react'

type Todo = {
  id: string
  text: string
  completed: boolean
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
    }
    setTodos([...todos, newTodo])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Todos</h1>

        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-700"
          />
          <button
            onClick={addTodo}
            className="bg-white text-black px-6 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex gap-1 mb-4">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-sm rounded-lg capitalize transition-colors ${filter === f ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          {filteredTodos.length === 0 && (
            <div className="text-center py-8 text-zinc-500">No tasks</div>
          )}
          {filteredTodos.map(todo => (
            <div key={todo.id} className="flex items-center gap-3 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 accent-white"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-zinc-500' : ''}`}>{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-zinc-500 hover:text-red-400 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {todos.length > 0 && (
          <div className="mt-4 text-sm text-zinc-500 text-center">
            {todos.filter(t => !t.completed).length} remaining
          </div>
        )}
      </div>
    </div>
  )
}