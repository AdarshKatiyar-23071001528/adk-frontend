import React from 'react'
import Bubble from '../../Common/Bubble';

const Banner = () => {
  return (
    <div className='w-full h-fit md:h-[330px] flex items-center justify-center p-4 relative'>
      <div className='w-full h-full  p-1 md:p-2 flex items-center justify-center rounded-xl relative'>
            {/* <img src="https://www.shutterstock.com/image-vector/25-rupee-off-sale-discount-260nw-2142090371.jpg" className='w-full h-full object-contains rounded-xl' alt="" /> */}
            <div className='w-full h-full bg-linear rounded-xl flex text-pretty flex-col p-1 md:p-3 shadow-b-lg border relative overflow-hidden'>
               
                <h1 className='font-bold text-center text-[16px] md:text-6xl p-1 md:p-3'>Big Deal</h1>
                <h2 className='text-center font-bold text-[13px] md:text-3xl p-1 md:p-3 text-'>Only 25</h2>
                <h3 className='text-center font-bold text-[13px] md:text-3xl p-1 md:p-3 text-gray-600'>150 <span className='text-red-600'>%</span> Earning</h3>
                <button className='p-1 md:p-2 text-[10px] bg-blue-400 w-fit rounded-xl font-bold shadow-xl absolute bottom-2 left-2 md:text-[20px] border-b-2'>Order Now</button>
                  <Bubble/>
            </div>
      </div>
    </div>
  )
}

export default Banner;
