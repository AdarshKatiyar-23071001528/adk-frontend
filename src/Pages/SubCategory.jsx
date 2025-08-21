import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowProduct from "../Components/Product/ShowProduct";
import AppContext from "../Context/AppContext";

const SubCategory = () => {
  const { item } = useParams();
  // const {filterProduct} = useContext(AppContext);


  const [Active, setActive] = useState("");
  const [found, notFound] = useState(true);
  
  //product
  const {product} = useContext(AppContext);
  const [saman, setSaman] = useState([]);
  const [filtered, setFiltered] = useState([]);



  useEffect(() => {
  const catWise = product?.filter((items) =>
    items?.productMainCategory?.toLowerCase().includes(item.toLowerCase())
  );
  setSaman(catWise);
  setFiltered(catWise); // yaha saman ke bajaye catWise use karo
}, [product, item]);


    const filterProducts =(item,index) => {
      setActive(index)
      if(item == "All") return setFiltered(saman);
      try {
        const filterData = saman.filter((items)=> items.productCategory.toLowerCase().includes(item.toLowerCase()));
        setFiltered(filterData);
      } catch (error) {
        console.log(error.message);
      }
    } 




  return (
    <div className="pt-[150px] w-full h-full">
      <div className="border w-full relative flex justify-center items-center text-[16px] md:text-2xl mb-2">
        <h1 className="absolute bg-white font-bold">{item}</h1>
      </div>

      <section className="pt-2 flex w-full">

      {found &&  <div className="min-w-[100px] md:min-w-[15%] shadow-lg rounded-xl">
          <div className="w-full flex flex-col">
             <button
                type="button"
                onClick={() => filterProducts("All",-1)}
                className="relative w-full text-left p-3 rounded-xl  overflow-hidden cursor-pointer bg-white transition-[color] duration-300"
              >
                {/* Gradient overlay */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-xl pointer-events-none bg-category
                transition-opacity duration-700 ease-in-out
                ${Active === -1 ? "opacity-100" : "opacity-0"}`}
                />
                {/* Text */}
                <span className={`relative z-10 `}>All</span>
              </button>
            {[...new Set(saman.map((item) => item.productCategory))].map((cat, index) => (
              <button
                key={index}
                type="button"
                onClick={() => filterProducts(cat,index)}
                className="relative w-full text-left p-3 rounded-xl  overflow-hidden cursor-pointer bg-white transition-[color] duration-300"
              >
                {/* Gradient overlay */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-xl pointer-events-none bg-category
                transition-opacity duration-700 ease-in-out
                ${Active === index ? "opacity-100" : "opacity-0"}`}
                />
                {/* Text */}
                <span className={`relative z-10 `}>{cat}</span>
              </button>
            ))}
          </div>
        </div>}
       
        
        <div className="w-fit p-2">
           <div className="w-full flex flex-wrap">
            {filtered?.map((item,index)=>(
              <div key={index} className="w-fit flex flex-col p-2 items-center rounded-xl">
                <div className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] border rounded-xl">
                  <img src={item.productImg} className="w-full object-fill h-full rounded-xl" alt="" />
                </div>
                <div className="w-full pl-1 md:pl-2 pt-2 pb-2">
                  <p>₹{item.productPrice}</p>
                  <p className="truncate w-[100px] md:w-[200px]">{item.productTitle}</p>
                </div>

                <div className="w-full">
                  <button className="p-2 bg-pink-400 w-full rounded-xl">ADD</button>
                </div>
              </div>
            ))}
           </div>
        </div>


      </section>
    </div>
  );
};

export default SubCategory;
