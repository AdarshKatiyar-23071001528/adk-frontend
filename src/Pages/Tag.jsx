import React from 'react'
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { GiReturnArrow } from "react-icons/gi"; 
import {IoIosPricetags}from "react-icons/io"

const Tag = () => {
  return (
    <div>
        <div className="w-full p-2">
                  <div className="flex justify-around gap-1 w-full">
                    <h1 className="p-2 md:p-4 flex flex-col items-center font-bold bg-blue-200 rounded-xl gap-2  justify-center w-[25%]">
                      <p className="text-green-400 text-[10px] md:text-[24px]  w-full flex items-center justify-center">
                        <FaMoneyBill1Wave />
                      </p>
                      <p className="text-center text-[10px] md:text-[20px] text-pretty">Cash On delivery</p>
                    </h1>
      
                    <h1 className="p-2 md:p-4 flex flex-col items-center font-bold bg-blue-200 rounded-xl gap-2  justify-center w-[25%]">
                      <p className="text-green-400 text-[13px] md:text-[24px]  w-full flex items-center justify-center">
                        <GiReturnArrow />
                      </p>
                      <p className="text-center text-[10px] md:text-[20px] text-pretty">7 Days Return</p>
                    </h1>
      
                    <h1 className="p-2 md:p-4 flex flex-col items-center font-bold bg-blue-200 rounded-xl gap-2  justify-center w-[25%]">
                      <p className="text-green-400 text-[13px] md:text-[24px]  w-full flex items-center justify-center">
                        <IoIosPricetags />
                      </p>
                      <p className="text-center text-[10px] md:text-[20px] text-pretty">Lowest Price</p>
                    </h1>
                  </div>
                </div>
    </div>
  )
}

export default Tag
