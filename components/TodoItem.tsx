'use client'

import { Todo } from '@/types/todo'
import { DragControls } from 'framer-motion'
import { GripVertical, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void
  dragControls: DragControls
}

export default function TodoItem({ todo, onDelete, dragControls }: TodoItemProps) {
  const [newTitle, setNewTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNewTitle(todo.title)
  }, [todo.title])

  return (
    <div
      className="flex justify-between items-center border border-gray-300 dark:border-neutral-800 pl-2 pr-4 py-2 rounded bg-white dark:bg-neutral-900 shadow-sm"
    >
      <GripVertical
        className="text-gray-400 cursor-grab touch-none"
        onPointerDown={(e) => dragControls.start(e)}
        onTouchStart={(e) => {
          e.preventDefault()
          dragControls.start(e as unknown as PointerEvent)
        }}
      />

      <>
        <span className="flex-1 mr-1">
          {todo.title}
        </span>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:underline cursor-pointer"
        >
          <Trash size={18} />
        </button>
      </>
    </div>
  )
}
