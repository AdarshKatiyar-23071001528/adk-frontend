import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";
import ProductCard from ".././Components/Product/ProductCard";

const Match = ({ proCategory }) => {
  const slugify2 = (text) => text.toLowerCase().replace(/-/g, " ");
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  let category = useParams().category;
  const { userToken, cartItems } = useContext(AppContext);

  const matchingCategory = slugify2(category === "cn" ? proCategory : category);
  const [matchProduct, setMatchProduct] = useState([]);
  const [cartItem, setcartItem] = useState([]);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product/all");
        setProduct(res?.data?.product || []);
      } catch (err) {
        console.error("Product fetch error:", err.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    try {
      const fetchProduct = product?.filter((data) =>
        data?.productCategory?.toLowerCase()?.includes(matchingCategory)
      );
      setMatchProduct(fetchProduct);
    } catch (error) {
      console.error(error.message);
    }
  }, [product]);

  // fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!userToken) return;
      try {
        const res = await axios.get("/api/cart/show", {
          headers: { userToken },
          withCredentials: true,
        });
        if (res?.data?.cart?.items) {
          setcartItem(res?.data?.cart?.items);
        }
      } catch (err) {
        console.error("Cart fetch error:", err.message);
      }
    };

    fetchCart();
  }, [userToken, cartItems]);

  const gotoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const availInCart = (id) => {
    const item = cartItem?.find((item) => item.productId === id);
    return item ? item.productQty : 0;
  };
  const addCart = async (item) => {
    // e.stopPropagation();
    // e.preventDefault();
    if (!userToken) return alert("Login First");
    try {
      const { _id, productPrice, productTitle, productImg, productCategory } =
        item;
      const res = await axios.post(
        "/api/cart/add",
        {
          productId: _id,
          productQty: 1,
          productPrice,
          productTitle,
          productImg,
          productCategory,
        },
        {
          headers: { "Content-Type": "Application/json", userToken },
          withCredentials: true,
        }
      );

      if (res?.data?.cart?.items) {
        setcartItem(res.data.cart.items);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const decrease_qty = async (id) => {
    console.log(id);
    try {
      const res = await axios.get(`/api/cart/decreaseQty/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          userToken: userToken,
        },
        withCredentials: true,
      });
      if (res?.data?.cart?.items) {
        setcartItem(res.data.cart.items);
      }
      console.log(res);
    } catch (error) {
      console.error("Decrease Error : ", error.message);
    }
  };

  const handleSubmit = (e, item) => {
    e.preventDefault();
    addCart(item);
  };

  return (
    <div className="my-6">
      <h1 className="font-bold text-2xl text-gray-800 px-2 mb-4">
        Related Products
      </h1>

      <div className="w-full overflow-x-auto flex gap-4 py-2 px-2 scrollbar-hide justify-between md:grid md:grid-cols-5">
        {matchProduct.slice(0, 5).map((item, index) => (
          <form
            key={index}
            className="min-w-[160px] md:min-w-[220px] bg-white shadow-md hover:shadow-xl transition-all duration-300 border rounded-2xl flex flex-col"
            onSubmit={(e) => handleSubmit(e, item)}
          >
            <Link
              key={item._id}
              to={`/product/${slugify2(item.productTitle)}/${
                item.productCategory
              }/${item._id}`}
              onClick={gotoTop}
              className="relative w-full h-[150px] md:h-[200px] overflow-hidden rounded-t-2xl"
            >
              <img
                src={item.productImg}
                alt={item.productTitle}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-lg">
                {item.productCategory}
              </span>
            </Link>

            <div className="p-3 flex flex-col flex-grow">
              <p className="text-lg font-semibold text-gray-800 truncate">
                ₹{item.productPrice}
              </p>
              <p className="text-sm text-gray-600 truncate mb-2">
                {item.productTitle}
              </p>
              {availInCart(item._id) <= 0 ? (
                <button
                  type="submit"
                  className=" bg-pink-500 text-white px-3 py-1 rounded-lg"
                  // onClick={() => addCart(item)}
                >
                  ADD
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow w-full justify-around">
                  <button
                    type="submit"
                    // onClick={() => addCart(item)}
                    className="text-green-500 text-xl"
                  >
                    +
                  </button>
                  <p>{availInCart(item._id)}</p>
                  <button
                    type="button"
                    className="text-red-500 text-xl"
                    onClick={() => decrease_qty(item._id)}
                  >
                    -
                  </button>
                </div>
              )}
            </div>
          </form>
        ))}

        {matchProduct.length === 0 && (
          <p className="text-gray-500 italic">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default Match;
