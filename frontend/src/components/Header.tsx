import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import useUserAccount from '../hooks/useUserAccount'

interface FormData {
    content: string,
    priority: Number,
    date: string,
    status: string,
    accountID : string 
}


const Header:React.FC = () => {
    const [priority, setPriority] = useState<Number>(0)
    const userAccount = useUserAccount()
    const [formData, setFormData] = useState<FormData>({
        content: "",
        priority: priority,
        date: new Date().toJSON().slice(0, 10),
        status: "TODO",
        accountID: ""
    })

    const handleValueChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })

    }

    const changePriority = (priority: Number) => {
        setPriority(priority)
        setFormData({
            ...formData,
            priority: priority
        })
    }
    
    useEffect(() => {
        if(userAccount){
            setFormData({
                ...formData,
                accountID: userAccount.id
            })
        }
    }, [userAccount])

   
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (!formData.content){
            alert("TODO CANT BE EMPTY!!")
            return;
        }

        try{
            const response = await fetch('http://localhost:3004/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok){
                throw new Error("Failed to create todo")
            }

            const data = await response.json()
        } catch(err: any){
            console.log("ERROR: " + err)
            alert("ERROR: " + err.message)
        } finally {
            location.reload()
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        location.reload()
    }

  return (
    <header className='bg-slate-100 border-solid border-2 border-b-gray-400 px-2 py-3 flex flex-col gap-4 text-gray-600 shadow-xl'>
        <div className='flex items-center justify-between'>
            <div onClick={handleLogout} className="text-4xl font-semibold">
                <i className="fa-solid fa-grip-lines"></i>
            </div>
            <h2 className='text-4xl'>{userAccount?.name}</h2>
        </div>
        <form method='post'>
            <div className="flex items-center justify-between px-5 py-2 bg-gray-200 mx-2 rounded-full">
                <input placeholder='Add item' name='content' value={formData.content} onChange={handleValueChange} className='text-2xl input-text' type="text" />
                <div onClick={handleSubmit} className='bg-blue-400 text-slate-100 rounded-full text-2xl w-10 h-10 flex justify-center items-center active:bg-blue-600'>
                    <i className="fa-solid fa-plus"></i>
                </div>
            </div>
            <div className='flex justify-center items-center flex-col'>
                <h1 className='text-3xl'>Priority</h1>
                <ul className='text-xl'>
                    <li className={`flex items-center gap-2 ${
                        priority == 2
                        ? 'text-blue-600'
                        : ''
                        }`}
                        onClick={() => changePriority(2)}
                        >
                       <div className='w-3 h-3 bg-red-600 rounded-full'></div> 
                       <h2>High</h2>
                    </li>
                    <li className={`flex items-center gap-2 ${
                        priority == 1
                        ? 'text-blue-600'
                        : ''
                        }`}
                        onClick={() => changePriority(1)}
                        >
                       <div className='w-3 h-3 bg-yellow-500 rounded-full'></div> 
                       <h2>Medium </h2>
                    </li>
                    <li className={`flex items-center gap-2 ${
                        priority == 0
                        ? 'text-blue-600'
                        : ''
                        }`}
                        onClick={() => changePriority(0)}
                        >
                       <div className='w-3 h-3 bg-green-400 rounded-full'></div> 
                       <h2>Low</h2>
                    </li>
                </ul>
            </div>
        </form>
    </header>
  )
}

export default Header

