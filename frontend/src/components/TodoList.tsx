import React, { useEffect, useState } from 'react'
import TodoItem from './TodoItem'
import useUserAccount from '../hooks/useUserAccount'
import { api } from '../utils/api'

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
  const userAccount = useUserAccount()

  const fetchTodos = async () => {
    try{
      const data: Todo[] = await api("/todos");
      // Server already filters by user, but we filter by status
      setCompleted(data.filter(todo => todo.status === "COMPLETED"))
      setTodos(data.filter(todo => todo.status === "TODO"))
    } catch(err: any){
      console.error("Failed to fetch todos:", err.message || "Failed to fetch");
    } finally{
      setLoading(false);
    }
  }

  const toogleStatus = async (todo: Todo) => {
    const newStatus = todo.status === "TODO" ? "COMPLETED" : "TODO"
    const updated = {...todo, status: newStatus}
    try{
      await api(`/todos/${todo.id}`, {
        method: "PUT",
        body: JSON.stringify(updated)
      })
      if (newStatus === "COMPLETED"){
        setTodos(prev => prev.filter(t => t.id !== todo.id))
        setCompleted(prev => [...prev, updated])
      } else{
        setCompleted(prev => prev.filter(t => t.id !== todo.id))
        setTodos(prev => [...prev, updated])
      }
    } catch(err){
      console.log("Error updating status", err)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await api(`/todos/${id}`, {method: "DELETE"})
      setTodos(prev => prev.filter(t => t.id !== id))
      setCompleted(prev => prev.filter(t => t.id !== id))
    } catch (err){
      console.log('Error deleting Todo', err)
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
          <TodoItem key={`TODO-${i}`} 
          date={todo.date} 
          id={todo.id} 
          priority={todo.priority} 
          content={todo.content} 
          status={todo.status} 
          onStatusChange={() => toogleStatus(todo)}
          onDelete={() => deleteTodo(todo.id)}
          />
        ))}

      </div>
      )}
      <h1 className='font-semibold pb-4 px-3 text-xl'>COMPLETED</h1> 
      {completed.map((todo, i) => (
        <TodoItem key={`COMPLETED-${i}`}  
        date={todo.date} 
        id={todo.id} 
        priority={todo.priority} 
        content={todo.content} 
        status={todo.status} 
        onStatusChange={() => toogleStatus(todo)}
        onDelete={() => deleteTodo(todo.id)}
        />
      ))}
    </div>
  )
}

export default TodoList