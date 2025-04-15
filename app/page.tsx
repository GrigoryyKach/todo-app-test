'use client'

import DraggableTodoItem from '@/components/DragggableTodoItem'
import { useTodos } from '@/hooks/useTodos'
import { AnimatePresence, Reorder } from 'framer-motion'
import { useState } from 'react'
import TodoForm from '../components/TodoForm'

export default function Home() {
  const [newTodo, setNewTodo] = useState('')
  const { todos, isLoading, addTodo, deleteTodo, reorderTodos } = useTodos()

  return (
    <main className="max-w-xl mx-auto my-10 px-4">
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
        <Reorder.Group
          as="ul"
          axis="y"
          values={todos}
          onReorder={reorderTodos}
          className="space-y-2 mt-4"
        >
          <AnimatePresence>
            {todos.map((todo) => (
              <DraggableTodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </main>
  )
}
