'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Todo } from '@/types/todo'

const LOCAL_STORAGE_KEY = 'todos'

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      setTodos(JSON.parse(stored))
      setIsLoading(false)
    } else {
      axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=10')
        .then(res => {
          setTodos(res.data)
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data))
        })
        .finally(() => setIsLoading(false))
    }
  }, [])

  const syncLocal = (updated: Todo[]) => {
    setTodos(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const addTodo = async (title: string) => {
    const tempId = Math.floor(Math.random() * 1000000)
    const newTodo: Todo = {
      id: tempId,
      title,
      completed: false,
    }

    const optimistic = [newTodo, ...todos]
    syncLocal(optimistic)

    try {
      const res = await axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', newTodo)
      const confirmed = optimistic.map(todo =>
        todo.id === tempId ? { ...res.data, id: tempId } : todo
      )
      syncLocal(confirmed)
    } catch {
      syncLocal(todos)
    }
  }

  const deleteTodo = async (id: number) => {
    const optimistic = todos.filter(todo => todo.id !== id)
    syncLocal(optimistic)

    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    } catch {
      syncLocal(todos)
    }
  }

  const updateTodo = (id: number, newTitle: string) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    )
    syncLocal(updated)
  }
  

  return { todos, isLoading, addTodo, deleteTodo, updateTodo }
}
