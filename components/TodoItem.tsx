'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { Pencil, X, Check } from 'lucide-react'

interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void
  onUpdate: (id: number, newTitle: string) => void
}

export default function TodoItem({ todo, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(todo.title)

  const saveEdit = () => {
    if (newTitle.trim()) {
      onUpdate(todo.id, newTitle.trim())
      setIsEditing(false)
    }
  }

  const cancelEdit = () => {
    setNewTitle(todo.title)
    setIsEditing(false)
  }

  return (
    <li
      className="flex justify-between items-center border border-gray-300 dark:border-neutral-800 px-4 py-2 rounded bg-white dark:bg-neutral-900 shadow-sm"
    >
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className="flex-1 bg-transparent border-b border-gray-400 outline-none dark:text-white"
          />
          <button onClick={saveEdit} className="text-green-500 hover:text-green-600">
            <Check size={18} />
          </button>
          <button onClick={cancelEdit} className="text-red-500 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="flex justify-between items-center w-full"
        >
          <span className="flex-1">{todo.title}</span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-red-500 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
