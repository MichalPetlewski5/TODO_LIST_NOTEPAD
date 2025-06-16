import React, { useState, type FormEvent } from 'react'

interface TodoElement {
    id: string,
    content: string,
    priority: Number,
    date: string,
    status: string
}

const TodoListElement:React.FC<TodoElement> = ({ id ,content, priority, date, status}) => {
  const [todo, setTodo] = useState<TodoElement>({
    id: id,
    content: content,
    priority: priority,
    date: date,
    status: status
  })
 
  const changeStatus = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (todo.status === "COMPLETED"){
      location.reload();
      return;
    }
    try{
      const updatedTodo: TodoElement = {
          ...todo,
          status: "COMPLETED"
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

  return (
    <div className='px-3 py-5 border-solid border-gray-400 border-2 rounded-xl shadow-lg bg-slate-50 flex items-center justify-between'>
      <div className='flex justify-center items-center gap-4'>
        <div className='w-8 h-8 border-2 border-solid border-gray-400 rounded-full' onClick={changeStatus} />
        <div className='flex flex-col'>
            <div className='flex items-center gap-2 text-sm'>
                <h2 className='font-semibold'>Priority</h2>
                {priority == 0 && (<h1 className='font-bold text-green-400'>LOW</h1>)}
                {priority == 1 && (<h1 className='font-bold text-yellow-500'>MEDIUM</h1>)}
                {priority == 2 && (<h1 className='font-bold text-red-600'>HIGH!</h1>)}
            </div>
            <h1 className='font-semibold  text-lg my-1'>{content}</h1>
            
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <i className="fa-solid fa-calendar text-xl"></i>
        <h2 className='font-semibold '>{date}</h2>
      </div>

    </div>
  )
}

export default TodoListElement
