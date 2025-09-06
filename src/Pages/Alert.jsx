import React, { use } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const Alert = () => {
const location = useLocation();
const navigate = useNavigate();
const closeAlert = () =>{
    const currrentParams = new URLSearchParams(location.search);
    currrentParams.delete("alert");
    navigate(`${location.pathname}?${currrentParams.toString()}`);
}


const openLogin = () =>{
    const currentUrl = new URLSearchParams(location.search);
    currentUrl.delete("alert");
    currentUrl.set("login","open");
    navigate(`${location.pathname}?${currentUrl.toString()}`);
}
  return (
    <div className='flex flex-col gap-3'>
    <button className='close absolute right-3 top-1 text-red-600 text-pretty text-xl' onClick={closeAlert}>x</button>
      <h1 className='font-bold text-pretty'>Please Login first</h1>
      <button className='w-full p-2 bg-gray-50 rounded-xl font-bold'
      onClick={() => openLogin()}>Login</button>
    </div>
  )
}

export default Alert
