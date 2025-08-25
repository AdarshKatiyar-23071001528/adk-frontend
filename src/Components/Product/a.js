import React, { useContext, useEffect, useState } from "react";
import axios from "../axios";
import ProductCard from "./ProductCard";
import AppContext from "../../Context/AppContext";

const ShowProduct = () => {
  const userToken = localStorage.getItem('token');
  const {filterProduct} = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);


  const openLogin = () =>{
    alert("Login please");
  }

  // ✅ product fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product/all");
        console.log(res);
        setProducts(res?.data?.product || []);
      } catch (err) {
        console.error("Product fetch error:", err.message);
      }
    };

    fetchProducts();
  }, []);

  // ✅ cart fetch
  useEffect(() => {
    const fetchCart = async () => {
      if (!userToken) return;
      try {
        const res = await axios.get("/api/cart/show", {
          headers: { userToken },
          withCredentials: true,
        });
        if (res?.data?.cart?.items) setCartItems(res?.data?.cart?.items);
      } catch (err) {
        console.error("Cart fetch error:", err.message);
      }
    };

    fetchCart();
  }, [userToken]);

 

  // ✅ check product qty in cart
  const availInCart = (id) => {
    const product = cartItems?.find((c) => c.productId === id);
    return product ? product.productQty : 0;
  };

  // ✅ add to cart
  const addCart = async (item) => {
    if (!userToken) {
      openLogin();
      return;
    }

    try {
      const res = await axios.post(
        "/api/cart/add",
        {
          productId: item._id,
          productQty: 1,
          productPrice: item.productPrice,
          productTitle: item.productTitle,
          productImg: item.productImg,
          productCategory: item.productCategory,
        },
        {
          headers: { "Content-Type": "application/json", userToken },
          withCredentials: true,
        }
      );

      if (res?.data?.cart?.items) {
        setCartItems(res.data.cart.items);
      }
    } catch (err) {
      console.error("Add Cart Error:", err.message);
    }
  };

   console.log(cartItems,products)
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map((item) => (
        <ProductCard
          key={item._id}
          item={item}
          addCart={addCart}
          availInCart={availInCart}
        />
      ))}
    </section>
  );
};




export default ShowProduct;
