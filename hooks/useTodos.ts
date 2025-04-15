'use client'

import { Todo } from '@/types/todo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback } from 'react'

const TODOS_KEY = ['todos']

export function useTodos() {
  const queryClient = useQueryClient()

  const { data = [], isLoading } = useQuery<Todo[]>({
    queryKey: TODOS_KEY,
    queryFn: async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10')
      return res.data
    },
  })

  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', {
        title,
        completed: false,
      })
      return res.data
    },
    onSuccess: (todo) => {
      const uniqueTodo = {
        ...todo,
        id: Date.now() + Math.floor(Math.random() * 1000),
      }
      queryClient.setQueryData<Todo[]>(TODOS_KEY, (prev = []) => [
        uniqueTodo,
        ...prev,
      ])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Todo[]>(TODOS_KEY, (prev = []) =>
        prev.filter((todo) => todo.id !== id)
      )
    },
  })

  const reorderTodos = useCallback((newOrder: Todo[]) => {
    queryClient.setQueryData<Todo[]>(TODOS_KEY, newOrder)
  }, [queryClient])

  return {
    todos: data,
    isLoading,
    addTodo: addMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    reorderTodos,
  }
}
