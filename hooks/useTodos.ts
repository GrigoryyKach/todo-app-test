'use client'

import { Todo } from '@/types/todo'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'

const TODOS_KEY = ['todos']
const LOCAL_STORAGE_KEY = 'todos'

export const useTodos = () => {
  const [localTodos, setLocalTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      setLocalTodos(JSON.parse(stored))
      setIsLoading(false)
    }
  }, [])

  useQuery<Todo[], Error>({
    queryKey: TODOS_KEY,
    queryFn: async () => {
      const res = await axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=10')
      return res.data
    },
    enabled: localTodos.length === 0,
    // @ts-ignore
    onSuccess: (data: any) => {
      const withIds = data.map((todo: any) => ({
        ...todo,
        id: Date.now() + Math.random(),
      }))
      setLocalTodos(withIds)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(withIds))
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const syncLocal = (todos: Todo[]) => {
    setLocalTodos(todos)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }

  const addMutation = useMutation({
    mutationFn: (title: string) =>
      axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', {
        title,
        completed: false,
      }),
    onMutate: async (title) => {
      const tempId = Math.floor(Math.random() * 1000000)
      const newTodo = { id: tempId, title, completed: false }
      const optimistic = [newTodo, ...localTodos]
      syncLocal(optimistic)
      return { optimistic, tempId }
    },
    onSuccess: (res, title, context) => {
      const confirmed = localTodos.map(todo =>
        todo.id === context?.tempId ? { ...res.data, id: context.tempId } : todo
      )
      syncLocal(confirmed)
    },
    onError: (_err, _title, context) => {
      syncLocal(context?.optimistic || localTodos)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`),
    onMutate: async (id) => {
      const optimistic = localTodos.filter(todo => todo.id !== id)
      syncLocal(optimistic)
      return { optimistic }
    },
    onError: (_err, _id, context) => {
      syncLocal(context?.optimistic || localTodos)
    }
  })

  const updateTodo = (id: number, newTitle: string) => {
    const updated = localTodos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    )
    syncLocal(updated)
  }

  const reorderTodos = (newOrder: Todo[]) => {
    syncLocal(newOrder)
  }

  return {
    todos: localTodos,
    isLoading,
    addTodo: addMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    updateTodo,
    reorderTodos
  }
}
