import React from 'react'
import Bubble from '../../Common/Bubble';

const Banner = () => {
  return (
    <div className='w-full h-[200px] md:h-[330px] flex items-center justify-center p-6 relative'>
      <div className='w-full h-full p-2 flex items-center justify-center rounded-xl relative'>
            {/* <img src="https://www.shutterstock.com/image-vector/25-rupee-off-sale-discount-260nw-2142090371.jpg" className='w-full h-full object-contains rounded-xl' alt="" /> */}
            <div className='w-full h-full bg-linear rounded-xl flex text-pretty flex-col p-3 shadow-b-lg border relative overflow-hidden'>
               
                <h1 className='font-bold text-center text-xl md:text-6xl p-2 md:p-3'>Big Deal</h1>
                <h2 className='text-center font-bold text-xl md:text-3xl p-2 md:p-3 text-'>Only 25</h2>
                <h3 className='text-center font-bold text-xl md:text-3xl p-2 md:p-3 text-gray-600'>150 <span className='text-red-600'>%</span> Earning</h3>
                <button className='md:p-2 p-1 bg-blue-400 w-[10%] rounded-xl font-bold'>Order Now</button>
                  <Bubble/>
            </div>
      </div>
    </div>
  )
}

export default Banner;
