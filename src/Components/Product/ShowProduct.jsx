import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../Context/AppContext";
import "./ShowProduct.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Error from "../../Pages/Error";
import Loading from "../../Pages/Loading";
import axios from "../axios";
import UserLogin from "../User/Userlogin";
import Loader from "../../Pages/Loader";
import CategorySection from "./CategorySection";
import Banner from "./Banner";

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

  const location = useLocation();
  const navigate = useNavigate();
  const openLogin = () => {
    const currentUrl = new URLSearchParams(location.search);
    currentUrl.set("login", "open");
    navigate(`${location.pathname}?${currentUrl.toString()}`);
  };
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
    if (!userToken) {
      openLogin();
    }
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
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading || !allProduct) return <Loader />;
  if (error) return <Error />;
  // if (!match) return;



  // const Category = ['Spice', 'Biscuits' , "Namkeen" , "Soap" , "Shampoo","Tofee","Choclate","Stationary","Washing Powder", "ToothPaste","Brush"];

  return (
    <>
      <section className="pt-[180px] md:pt-[150px] w-full ">
        {/* Product category */}
       {/* Product category */}
{/* <section className="w-full h-[130px] md:h-[220px] flex items-center overflow-x-auto bg-red-400 p-1">
  <div className="flex gap-2 items-center overflow-x-auto p-2 w-full">
    {Category.map((item, index) => (
      <div
        key={index}
        className="min-w-[200px] h-full flex flex-col border rounded-xl p-2"
      >
        <div className="w-full h-[90%] bg-gray-400 rounded-xl">
          <img
            src="data:image/jpeg;base64,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"
            className="object-fill h-full w-full rounded-xl"
            alt=""
          />
        </div>
        <p className="w-full pl-2">{item}</p>
      </div>
    ))}
  </div>
</section> */}

  <CategorySection/>
  <Banner/>


        {/* All prioduct */}
        <div className="productContainer ">
          {allProduct.map((item) => (
            <Link
              key={item._id}
              to={`/product/${slugify(item.productTitle)}/${
                item.productCategory
              }/${item._id}`}
            >
              <div
                className="product border border-gray-200 md:w-1/5"
                onClick={() => setViewId(item._id)}
              >
                <div className="productImg rounded-xl">
                  <img
                    src={item.productImg}
                    alt={item.productTitle}
                    className="rounded-xl"
                  />
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
      </section>
    </>
  );
};

export default ShowProduct;
