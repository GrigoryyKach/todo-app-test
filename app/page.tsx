'use client'

import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'

export default function Home() {
  const [newTodo, setNewTodo] = useState('')
  const { todos, isLoading, addTodo, deleteTodo, updateTodo } = useTodos()

  return (
    <main className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Todo App</h1>

      <TodoForm
        value={newTodo}
        onChange={setNewTodo}
        onSubmit={() => {
          if (newTodo.trim()) {
            addTodo(newTodo)
            setNewTodo('')
          }
        }}
      />

      {isLoading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
