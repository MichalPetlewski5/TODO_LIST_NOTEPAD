import React from 'react'

const Error404:React.FC = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-5 text-4xl">
        <h1>404, No Content</h1>
        <i className="fa-solid fa-ban fa-spin text-8xl text-red-600"></i>
    </div>
  )
}

export default Error404