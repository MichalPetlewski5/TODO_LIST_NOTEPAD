import React, { useState, type FormEvent } from 'react'

interface TodoElement {
    id: string,
    content: string,
    priority: Number,
    date: string,
    status: string
}

const TodoListElementCompleted:React.FC<TodoElement> = ({ id, content, priority, date, status}) => {
  const [todo, setTodo] = useState<TodoElement>({
    id: id,
    content: content,
    priority: priority,
    date: date,
    status: status
  })

   const changeStatus = async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      if (todo.status === "TODO"){
        location.reload();
        return;
      }
      try{
        const updatedTodo: TodoElement = {
            ...todo,
            status: "TODO"
          }
        
        console.log(updatedTodo)
  
        const response = await fetch(`http://localhost:3004/todos/${id}`, {
          method: "PUT",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        });
  
        if (!response.ok){
          throw new Error("Failed to change status");
        }
  
    
  
        const data = await response.json()
        setTodo(data)
        location.reload()
      } catch(err: any){
        console.log("Error: " + err)
      }
    }

  const handleDelete = async (id: string) => {
    try{
        const response = await fetch(`http://localhost:3004/todos/${id}`, {
            "method": "DELETE",
        });
        if(!response.ok){
            throw new Error(`Failed to delete page: ${response.status}`)
        }
        location.reload()
    } catch(err: any){
        console.log(`Error: ${err.message}`)
    }
  }

  return (
    <div className='px-3 py-5 flex items-center justify-between'>
      <div className='flex justify-center items-center gap-4'>
        <div onClick={changeStatus} className='w-8 h-8 bg-green-300 rounded-full flex justify-center items-center text-xl'>
            <i className="fa-solid fa-check"></i>
        </div>
        <h1 className=' text-gray-400  text-xl my-1 line-through'>{content}</h1>
        <button onClick={() => handleDelete(id)} className='text-xl text-red-400'>
            <i className="fa-solid fa-trash"></i>
        </button>   
      </div>
      <div className='flex flex-col justify-center items-center text-gray-400'>
        <i className="fa-solid fa-calendar text-xl"></i>
        <h2 className='font-semibold'>{date}</h2>
      </div>

    </div>
  )
}

export default TodoListElementCompleted
