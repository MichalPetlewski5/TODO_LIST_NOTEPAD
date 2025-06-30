import React, { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'


interface LoginData {
  email: string,
  password: string,
  isRemember: boolean
}

interface AccountData {
  id: string,
  name: string
  email: string,
  password: string,

}


const Login: React.FC<{onLogin: () => void}> = ({ onLogin }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [LoginForm, setLoginForm] = useState<LoginData>({
    email: "",
    password: "",
    isRemember: false
  }) 
  const [accounts, setAccounts] = useState<AccountData[]>([])



  const handleToogle = (mode: string) => {
    if (mode === "VISIBILITY"){
      setVisible(!visible)
    } else if (mode === "REMEMBER"){
      setLoginForm({
        ...LoginForm,
        isRemember: !LoginForm.isRemember
      })
    }
    
  }

  const navigator = useNavigate()

  const changeValues = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const {name, value} = e.target
    setLoginForm({
      ...LoginForm,
      [name]: value
    })
  }

  const handleLogin = async () => {
    try{
      const response = await fetch("http://localhost:3004/accounts")
      if(!response.ok){
        throw new Error(`HTTP ERROR: ${response.status}`)
      }
      const data: AccountData[] = await response.json()
      setAccounts(data)
      console.log(accounts)
      const findAccount = data.find(
        (acc) => acc.email === LoginForm.email && acc.password === LoginForm.password
      )

      if(findAccount){
        if(LoginForm.isRemember){
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("accID", findAccount.id)
          sessionStorage.removeItem("isLoggedIn")
        } else{
          sessionStorage.setItem("isLoggedIn", "true")
          sessionStorage.setItem("accID", findAccount.id)
          localStorage.removeItem("isLoggedIn")
        }
        onLogin()
        navigator("/")
        console.log(localStorage.getItem("accID"))
      } else{
        alert("Invalid credentails.")
      }

    } catch(err: any){
      console.log('err: ' + err.message)
    }

    
  }

  return (
    <div className='w-[100vw] h-[100vh] px-4 py-48 flex flex-col items-center'>
      <div className='flex flex-col justify-center items-center gap-12'>
        <h1 className='text-4xl'>Login</h1>
        <form method='post'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col bg-gray-200 rounded-full px-8 py-3'>
              <label className='text-sm text-slate-500' htmlFor="email">Email</label>
              <input onChange={changeValues} value={LoginForm.email} className='text-xl input-text' type="email" name="email" id="email" placeholder='example@gmail.com' />
            </div>
            <div className='flex justify-center bg-gray-200 rounded-full py-3 '>
              <div className='flex flex-col'>
                <label className='text-sm text-slate-500' htmlFor="password">Password</label>
                <input onChange={changeValues} value={LoginForm.password} className='text-xl input-text' type={visible ? ('text') : ('password') } name="password" id="password"  />
              </div>
              <div onClick={() => handleToogle("VISIBILITY")} className='p-3 text-xl'>
                <i  className={`fa-solid fa-eye transition duration-200 ${!visible ?('text-gray-500'):('text-blue-400')}`}></i>
              </div>
            </div>
            <div className='px-8 py-3 '>
              <div className='flex items-center gap-2 text-lg'>
                <input onChange={() => handleToogle("REMEMBER")} type="checkbox" name="save" id="save" />
                <label htmlFor="save">Remember login</label>
                <a className='ml-6 text-blue-400 text-lg'>
                  <h2 >Forgot password?</h2>
                </a>
              </div>
              <div onClick={handleLogin} className='bg-blue-400 text-slate-100 px-4 py-3 mt-5 text-2xl text-center rounded-3xl'>
                <h1>Login</h1>
              </div>
            </div>
           </div>         
        </form>
      </div>

    </div>
  )
}

export default Login
