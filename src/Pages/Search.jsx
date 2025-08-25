import React from 'react'
import ShowProduct from '../Components/Product/ShowProduct'
import Cart from './Cart'
import { useLocation, useNavigate } from 'react-router-dom';

const Search = () => {

  const location = useLocation();
  const navigate = useNavigate();
 const queryParams = new URLSearchParams(location.search);

  const isCartOpen = queryParams.get("cart") === "open";
   const closeCart = () => {
    queryParams.delete("cart");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  return (<>
    <div className='pt-[150px]'>
      <ShowProduct/>
    </div>
        {isCartOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={closeCart}
            ></div>
          )}
    
          <div
            className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-blue-300 z-50 transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Cart />
          </div>
  </>)
}

export default Search
