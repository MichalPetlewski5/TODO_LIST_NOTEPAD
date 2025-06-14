import { useState } from 'react'
import Header from './components/Header'
import TodoList from './components/TodoList'



function App() {


  return (
    <div className='bg-slate-100'>
      <Header />
      <TodoList />
    </div>
  )
}

export default App
