'use client'

import { Todo } from '@/types/todo'
import { DragControls } from 'framer-motion'
import { Check, GripVertical, Pencil, Trash, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void
  onUpdate: (id: number, newTitle: string) => void
  dragControls: DragControls
}

export default function TodoItem({ todo, onDelete, onUpdate, dragControls }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 10)
    }
  }, [isEditing])

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
    <div
      className="flex justify-between items-center border border-gray-300 dark:border-neutral-800 pl-2 pr-4 py-2 rounded bg-white dark:bg-neutral-900 shadow-sm"
      onDoubleClick={() => setIsEditing(true)}
    >
      <GripVertical
        className="text-gray-400 cursor-grab touch-none"
        onPointerDown={(e) => dragControls.start(e)}
        onTouchStart={(e) => {
          e.preventDefault()
          dragControls.start(e as unknown as PointerEvent)
        }}
      />
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className="flex-1 bg-transparent border-b border-gray-400 outline-none dark:text-white"
          />
          <button onClick={saveEdit} className="text-green-500 hover:text-green-600 cursor-pointer">
            <Check size={18} />
          </button>
          <button onClick={cancelEdit} className="text-red-500 hover:text-red-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1 mr-1">{todo.title}</span>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-200 cursor-pointer transition-all"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-red-500 hover:underline cursor-pointer"
            >
              <Trash size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}