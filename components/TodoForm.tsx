interface TodoFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function TodoForm({ value, onChange, onSubmit }: TodoFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 dark:border-neutral-700 px-4 py-2 w-full rounded bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
        placeholder="Add new todo"
      />
      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
      >
        Add
      </button>
    </div>
  )
}
