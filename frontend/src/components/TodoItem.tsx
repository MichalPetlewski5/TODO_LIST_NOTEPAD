import React from 'react'

interface TodoElement {
    id: string,
    content: string,
    priority: Number,
    date: string,
    status: string,
    onStatusChange: () => void,
    onDelete: () => void
}

const TodoItem: React.FC<TodoElement> = ({ id ,content, priority, date, status, onStatusChange, onDelete}) => {
  return (
    <>
    {status === "TODO" ? (
        <div className='px-3 py-5 border-solid border-gray-400 border-2 rounded-xl shadow-lg bg-slate-50 flex items-center justify-between'>
        <div className='flex justify-center items-center gap-4'>
            <div className='w-8 h-8 border-2 border-solid border-gray-400 rounded-full' onClick={onStatusChange} />
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
    ) : (
    <div className='px-3 py-5 flex items-center justify-between'>
      <div className='flex justify-center items-center gap-4'>
        <div onClick={onStatusChange} className='w-8 h-8 bg-green-300 rounded-full flex justify-center items-center text-xl'>
            <i className="fa-solid fa-check"></i>
        </div>
        <h1 className=' text-gray-400  text-xl my-1 line-through'>{content}</h1>
        <button onClick={onDelete} className='text-xl text-red-400'>
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
    </>
  )
}

export default TodoItem
