import React, { useEffect, useState } from 'react'
import TodoListElement from './TodoListElement'
import TodoListElementCompleted from './TodoListElementCompleted'
import useUserAccount from '../hooks/useUserAccount'

interface Todo{
  id: string,
  content: string,
  date: string
  status: string,
  priority: Number,
  accountID: string
}




const TodoList:React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [completed, setCompleted] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const userAccount = useUserAccount()

  const fetchTodos = async () => {
    try{
      const response = await fetch('http://localhost:3004/todos');
      if (!response.ok){
        throw new Error(`HTTP ERROR! ${response.status}`);
      }

      const data: Todo[] = await response.json();
      const filterByUser = data.filter(todo => todo.accountID === userAccount?.id)
      setCompleted(filterByUser.filter(todo => todo.status === "COMPLETED"))
      setTodos(filterByUser.filter(todo => todo.status === "TODO"))
    } catch(err: any){
      setError(err.message || "Failed to fetch");
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
   if (userAccount){
    fetchTodos()
   }
  }, [userAccount])


  return (
    <div className='px-5 text-gray-600 bg-slate-100'>
      <h1 className='font-semibold py-4 px-3 text-xl'>TO DO</h1>
      {loading ? (<h1>Loading todos</h1>) : (
      <div className='flex flex-col-reverse justify-center gap-5 pb-6'>
        {todos.map((todo, i) => (
          <TodoListElement key={`ID${i}`} date={todo.date} id={todo.id} priority={todo.priority} content={todo.content} status={todo.status} />
        ))}
      </div>
      )}
      <h1 className='font-semibold pb-4 px-3 text-xl'>COMPLETED</h1> 
      {completed.map((todo, i) => (
        <div key={`ID${i}`} className='flex flex-col-reverse justify-center pb-6'>
          <TodoListElementCompleted  date={todo.date} id={todo.id} priority={todo.priority} content={todo.content} status={todo.status} />
        </div>
      ))}
    </div>
  )
}

export default TodoList