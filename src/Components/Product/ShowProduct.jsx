import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../Context/AppContext";
import "./ShowProduct.css";
import { Link } from "react-router-dom";
import Error from "../../Pages/Error";
import Loading from "../../Pages/Loading";
import axios from "../axios";

// replace " " from "-" 
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");



const ShowProduct = () => {
  const { setViewId, filterProduct, userToken, setCartLength } =
    useContext(AppContext);
  const [allProduct, setAllProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // ✅ error flag
  const [match, setMatch] = useState(true);

  useEffect(() => {
    try {
      // if filterProduct length is more than 0
      if (filterProduct && filterProduct.length > 0) {
        setAllProduct(filterProduct);
        setError(false);
        setMatch(true);
      } else {
        setMatch(false);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filterProduct]);

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

  if (loading) return <Loading />;
  if (error || !allProduct) return <Error />;
  // if (!match) return;
    

  return (
    <div className="productContainer ">
      {allProduct.map((item) => (
        <Link
          key={item._id}
          to={`/product/${slugify(item.productTitle)}/${item.productCategory}/${item._id}`}
        >
          <div
            className="product border border-gray-200 md:w-1/5"
            onClick={() => setViewId(item._id)}
          >
            <div className="productImg rounded-xl">
              <img src={item.productImg} alt={item.productTitle} className="rounded-xl" />
              <button
                type="submit"
                className="add-item-btn"
                onClick={(e) => addCart(e, item)}
              >
                ADD
              </button>
            </div>
            <div className="productDetails">
              <p>
                <span>₹ </span>
                {item.productPrice}
              </p>
              <p>1 Pair</p>
              <p>
                <strong className="text-clamp">{item.productTitle}</strong>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ShowProduct;