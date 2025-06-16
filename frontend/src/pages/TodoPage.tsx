import React from 'react'
import Header from '../components/Header'
import TodoList from '../components/TodoList'

const TodoPage:React.FC = () => {
  return (
    <div className='bg-slate-100'>
        <Header />
        <TodoList />
    </div>
  )
}

export default TodoPage
