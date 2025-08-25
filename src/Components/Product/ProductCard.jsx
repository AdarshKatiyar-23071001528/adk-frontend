import React from "react";
import { Link } from "react-router-dom";


const ProductCard = ({ item, addCart, availInCart,decrease_qty ,slugify}) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // page reload prevent
    addCart(item); // add cart call
  };

  

  return (
    <form
      onSubmit={handleSubmit}
      className="product border border-gray-200 rounded-xl p-2 shadow-md"
    >
        
      <div className="productImg relative">
        <Link
              key={item._id}
              to={`/product/${slugify(item.productTitle)}/${
                item.productCategory
              }/${item._id}`}
            >
        <img
          src={item.productImg}
          alt={item.productTitle}
          className="rounded-xl w-full h-40 object-fill"
        /></Link>

        {availInCart(item._id) <= 0 ? (
          <button
            // type="submit"
            className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg"
            // onClick={() => addCart(item)}
          >
            ADD
          </button>
        ) : (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow">
            <button
              type="button"
              onClick={() => addCart(item)}
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
      <div className="productDetails mt-2">
        <p className="font-bold">₹{item.productPrice}</p>
        <p className="text-sm">{item.productTitle}</p>
      </div>
    </form>
  );
};

export default ProductCard;
