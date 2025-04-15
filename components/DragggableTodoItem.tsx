import { Todo } from '@/types/todo'
import { Reorder, useDragControls } from 'framer-motion'
import TodoItem from './TodoItem'

export default function DraggableTodoItem({
  todo,
  onDelete,
}: {
  todo: Todo,
  onDelete: (id: number) => void,
}) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      key={todo.id}
      value={todo}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="cursor-default active:cursor-grabbing"
    >
      <TodoItem
        todo={todo}
        onDelete={onDelete}
        dragControls={controls}
      />
    </Reorder.Item>
  )
}