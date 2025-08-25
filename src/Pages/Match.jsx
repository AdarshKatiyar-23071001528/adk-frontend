import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";

const Match = ({ proCategory }) => {
  const slugify = (text) => text.toLowerCase().replace(/-/g, " ");
  const slugify2 = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  let category = useParams().category;
  const { product, userToken } = useContext(AppContext);

  const matchingCategory = slugify(category === "cn" ? proCategory : category);
  const [matchProduct, setMatchProduct] = useState([]);

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

  const gotoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addCart = async (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    if (!userToken) return alert("Login First");
    try {
      const { _id, productPrice, productTitle, productImg } = item;
      const res = await axios.post(
        "/api/cart/add",
        { productId: _id, productQty: 1, productPrice, productTitle, productImg },
        {
          headers: { "Content-Type": "Application/json", userToken },
          withCredentials: true,
        }
      );
      if (res.data.message !== "Updated Item") {
        alert("✅ Added to cart");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="my-6">
      <h1 className="font-bold text-2xl text-gray-800 px-2 mb-4">
        Related Products
      </h1>

      <div className="w-full overflow-x-auto flex gap-4 py-2 px-2 scrollbar-hide justify-between md:grid md:grid-cols-5">
        {matchProduct.slice(0,5).map((item, index) => (
          <div
            key={index}
            className="min-w-[160px] md:min-w-[220px] bg-white shadow-md hover:shadow-xl transition-all duration-300 border rounded-2xl flex flex-col"
          >
            <Link
              key={item._id}
              to={`/product/${slugify2(item.productTitle)}/${item.productCategory}/${item._id}`}
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

              <button
                onClick={(e) => addCart(e, item)}
                className="mt-auto w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-xl transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

        {matchProduct.length === 0 && (
          <p className="text-gray-500 italic">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default Match;
