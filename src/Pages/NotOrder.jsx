import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotOrder = () => {

    const navigate = useNavigate();
  return (
    <div className='w-full justify-center flex items-center h-full flex-col'>
      <h1 className='text-wrap'>No Any Order</h1>
      <button onClick={() =>navigate('/')} className='bg-blue-400 p-2 rounded-xl mt-2'>Order Now</button>
    </div>
  )
}

export default NotOrder
