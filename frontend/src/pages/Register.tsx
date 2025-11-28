import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { api } from "../utils/api"
import { setToken } from '../utils/auth'


interface RegisterData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

interface AccountData {
  id: string,
  name: string
  email: string,
  password: string,

}

const Register: React.FC<{onLogin: () => void}> = ({onLogin}) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [registerForm, setRegisterForm] = useState<RegisterData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const navigator = useNavigate()

    const handleToogle = () => {
        setVisible(!visible)
    }


    const changeValues = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const {name, value} = e.target
        setRegisterForm({
            ...registerForm,
            [name]: value
        })
    }




  const submitRegisterForm = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const { name, email, password, confirmPassword } = registerForm

    if (!name || !email || !password){
      alert("All fields must be filled");
      return;
    }

    if (password !== confirmPassword){
      alert('Passwords do not match!')
      return
    }

    try{
      const response = await api("/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        })
      })
      if (response.token) {
        setToken(response.token);
      }

      alert("Registration successful!");
      navigator('/');
    } catch(error: any){
      console.error(error);
      alert(error?.message || "Something went wrong")
    }

  };


  return (
    <div className='w-[100vw] h-[100vh] px-4 py-48 flex flex-col items-center'>
      <div className='flex flex-col justify-center items-center gap-12'>
        <h1 className='text-4xl'>Register</h1>
        <form method='post' onSubmit={submitRegisterForm}>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col bg-gray-200 rounded-full px-8 py-3'>
              <label className='text-sm text-slate-500' htmlFor="name">Name</label>
              <input onChange={changeValues} value={registerForm.name} className='text-xl input-text' type="text" name="name" id="name" placeholder='John Pork' />
            </div>
            <div className='flex flex-col bg-gray-200 rounded-full px-8 py-3'>
              <label className='text-sm text-slate-500' htmlFor="email">Email</label>
              <input onChange={changeValues} value={registerForm.email} className='text-xl input-text' type="email" name="email" id="email" placeholder='example@gmail.com' />
            </div>
            <div className='flex justify-center bg-gray-200 rounded-full py-3 '>
              <div className='flex flex-col'>
                <label className='text-sm text-slate-500' htmlFor="password">Password</label>
                <input 
                    onChange={changeValues} 
                    value={registerForm.password} 
                    className='text-xl input-text' 
                    type={visible ? ('text') : ('password') } 
                    name="password" 
                    id="password"  />
              </div>
              <div onClick={() => handleToogle()} className='p-3 text-xl'>
                <i  className={`fa-solid fa-eye transition duration-200 ${!visible ?('text-gray-500'):('text-blue-400')}`}></i>
              </div>
            </div>
            <div className={`flex justify-center bg-gray-200 rounded-full py-3 transition duration-300 
              ${!(registerForm.password === '') ? ('visible confirm-passwd-animation-in') : ('hidden confirm-passwd-animation-out')}
              ${registerForm.password === registerForm.confirmPassword ? (''): ('border border-solid border-red-600')}`}>
              <div className='flex flex-col'>
                <label className='text-sm text-slate-500' htmlFor="confirmPassword">Confirm Password</label>
                <input 
                    onChange={changeValues} 
                    value={registerForm.confirmPassword} 
                    className='text-xl input-text' 
                    type={visible ? ('text') : ('password') } 
                    name="confirmPassword" 
                    id="confirmPassword"  />
              </div>
              <div onClick={() => handleToogle()} className='p-3 text-xl'>
                <i  className={`fa-solid fa-eye transition duration-200 ${!visible ?('text-gray-500'):('text-blue-400')}`}></i>
              </div>
            </div>
            <h1 className={`text-xl text-center font-semibold text-red-600  ${registerForm.password === registerForm.confirmPassword ? ('hidden'): ('visible')}`}>Passwords are not matching!</h1>
            <div className='px-8 py-3 '>
              <div className='flex gap-3 text-center justify-center items-center text-lg w-[19rem]'>
                <h2 className=''>Do you have an account</h2>
                <a className=' text-blue-400 text-xl'>
                  Log in
                </a>
              </div>
              <button type="submit" className='bg-blue-400 text-slate-100 px-4 py-3 mt-5 text-2xl text-center rounded-3xl w-full'>
                Register
              </button>
            </div>
           </div>         
        </form>
      </div>
    </div>
  )
}

export default Register