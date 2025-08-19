import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from '../Components/axios';

const Match = () => {
    
  const slugify = (text) => text.toLowerCase().replace("-", " ");
    const slugify2 = (text) => text.toLowerCase().replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
  let category = useParams().category;
  const id = useParams().id;
  const matchingCategory = slugify(category);
  const [matchProduct, setMatchProduct] = useState([]);
  const { product,userToken } = useContext(AppContext);

  useEffect(() => {
    // matching product from product title
    try {
      const fetchProduct = product?.filter((data) =>
        data?.productCategory?.toLowerCase()?.includes(matchingCategory)
      );
      setMatchProduct(fetchProduct);
    } catch (error) {
      console.error(error.message);
    }
  }, [product]);

  const gotoTop = () =>{
    window.scrollTo({
        top:0,
        behavior:"smooth",
    });
  }


    const addCart = async (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    if (!userToken) return alert("Login First");
    try {
      const { _id, productPrice, productTitle, productImg } = item;
      const res = await axios.post(
        "/api/cart/add",
        {
          productId: _id, 
          productQty: 1,
          productPrice,
          productTitle,
          productImg,
        },
        {
          headers: {
            "Content-Type": "Application/json",
            userToken: userToken,
          },
          withCredentials: true,
        }
      );
      if (res.data.message !== "Updated Item") {
        setCartLength(res.data.cart.items.length);
        alert("Added to cart");

        // cart reload
        window.location.reload();
      }
      else{
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return <>
  <div>
    <h1 className="font-bold text-xl md:text-2xl p-1">Related Product:</h1>
  </div>
  <div className="w-full h-[230px]  md:h-[300px] overflow-x-auto flex gap-3 items-center  md:justify-center ">
    {matchProduct.map((item,index)=>(
       
         <div key={index} className="h-full min-w-[130px]  md:w-[200px]  flex flex-col border border-gray-400 justify-around p-2 rounded-xl"
   >
              <Link
          key={item._id}
          to={`/product/${slugify2(item.productTitle)}/${item.productCategory}/${item._id}`}
        >
            <div className="imgContainer w-[100%] md:h-[180px] h-[100px] rounded-xl border" onClick={gotoTop}>
            <img src={item.productImg} className="object-fill h-full w-full rounded-xl" alt="" />
            </div></Link>
            
            <div className="p-2">
                <p>₹{item.productPrice}</p>
                <p>{item.prodcutQty}</p>
                <p className="truncate">{item.productTitle}</p>
            </div>
            
            <div className="w-full p-1 flex justify-center items-center bg-pink-400 rounded-xl z-100">
                <button onClick={(e)=>addCart(e,item)}>ADD</button>
            </div>
        </div> 

    ))}

  </div></>
};

export default Match;
