import React, { useEffect, useState } from 'react'
import TodoListElement from './TodoListElement'
import TodoListElementCompleted from './TodoListElementCompleted'

interface Todo{
  id: string,
  content: string,
  date: string
  status: string,
  priority: Number
}



const TodoList:React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [completed, setCompleted] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = async () => {
    try{
      const response = await fetch('http://localhost:3004/todos');
      if (!response.ok){
        throw new Error(`HTTP ERROR! ${response.status}`);
      }

      const data: Todo[] = await response.json();
      const filterByStatus = data.filter((x) => (x.status == "COMPLETED"))
      setCompleted(filterByStatus)
      setTodos(data.filter((x) => (x.status == "TODO")));
    } catch(err: any){
      setError(err.message || "Failed to fetch");
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [])

  return (
    <div className='px-5 text-gray-600 bg-slate-100'>
      <h1 className='font-semibold py-4 px-3 text-xl'>TO DO</h1>
      {loading ? (<h1>Loading todos</h1>) : (
      <div className='flex flex-col-reverse justify-center gap-5 pb-6'>
        {todos.map((todo) => (
          <TodoListElement date={todo.date} id={todo.id} priority={todo.priority} content={todo.content} status={todo.status} />
        ))}
      </div>
      )}
      <h1 className='font-semibold pb-4 px-3 text-xl'>COMPLETED</h1> 
      {completed.map((todo, i) => (
        <div className='flex flex-col-reverse justify-center pb-6'>
          <TodoListElementCompleted key={`ID${i}`} date={todo.date} id={todo.id} priority={todo.priority} content={todo.content} status={todo.status} />
        </div>
      ))}
    </div>
  )
}

export default TodoList