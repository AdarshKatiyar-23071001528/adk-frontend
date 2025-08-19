import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import spice from'./../../assets/spice.png';

const CategorySection = () => {
  const Category = [
    "Spice",
    "Biscuits",
    "Namkeen",
    "Soap",
    "Shampoo",
    "Tofee",
    "Choclate",
    "Stationary",
    "Washing Powder",
    "ToothPaste",
    "Brush",
  ];
  const  scrollRef = useRef(null);


  const scrollLeft = () => {

    if(scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -400,
        behavior : "smooth",
      });
    }
 }
   const scrollRight = () => {
    if(scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 400,
        behavior : "smooth",
      });
    }
 }



  return (

    <section className="relative w-full h-[100px] md:h-[200px] flex items-center ">
      <div className="absolute left-2 md:left-4 h-[20px] w-[20px] md:h-[40px] md:w-[40px] rounded-full  flex text-[13px] md:text-xl p-1"
       onClick={scrollLeft}>
        <button className="m-auto p-auto"><FaChevronLeft /></button>
      </div>

      {/* Scrollable Container */}
      <div 
      ref={scrollRef}
      className="flex gap-2 items-center overflow-x-auto p-2 w-full scrollbar-hide scroll-smooth" >
        {Category.map((item, index) => (
          <div
            key={index}
            className=" min-w-[120px] md:min-w-[200px] h-full flex flex-col border rounded-xl p-2"
          >
            <div className="w-full h-[90%] rounded-xl">
              <img
                src={spice}
                className="object-fill h-full w-full rounded-xl"
                alt=""
              />
            </div>
            <p className="w-full pl-2">{item}</p>
          </div>
        ))}
      </div>


        <div className="absolute  right-2 md:right-4 w-[20px] h-[20px] md:h-[40px] md:w-[40px] rounded-full flex text-[13px] md:text-xl p-1" onClick={scrollRight}>
        <button className="m-auto p-auto"><FaChevronRight /></button>
      </div>
    </section>
  );
};

export default CategorySection;
