import { useContext, useEffect, useState } from "react";
import AppContext from "../../Context/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Error from "../../Pages/Error";
import axios from "../axios";
import Loader from "../../Pages/Loader";
import ProductCard from "./ProductCard";

// replace " " from "-"
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

const ShowProduct = () => {
  const {
    setViewId,
    filterProduct,
    userToken,
    setCartLength,
    // product,
    cartItems,
  } = useContext(AppContext);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // ✅ error flag
  const [match, setMatch] = useState(true);
  const [cartItem, setcartItem] = useState([]);

  // ✅ product fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product/all");
        console.log(res);
        setAllProduct(res?.data?.product || []);
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
        if (res?.data?.cart?.items) {
          setcartItem(res?.data?.cart?.items);
        }
      } catch (err) {
        console.error("Cart fetch error:", err.message);
      }
    };

    fetchCart();
  }, [userToken, cartItems]);

  //for open login
  const location = useLocation();
  const navigate = useNavigate();
  const openLogin = () => {
    const currentUrl = new URLSearchParams(location.search);
    currentUrl.set("login", "open");
    navigate(`${location.pathname}?${currentUrl.toString()}`);
  };

  // filter Product
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

  const availInCart = (id) => {
    const item = cartItem?.find((c) => c.productId === id);
    return item ? item.productQty : 0;
  };

  const addCart = async (item) => {
    // e.stopPropagation();
    // e.preventDefault();
    console.log(item);
    if (!userToken) {
      openLogin();
      return;
    }
    try {
      const { _id, productPrice, productCategory, productTitle, productImg } =
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
          headers: {
            "Content-Type": "Application/json",
            userToken: userToken,
          },
          withCredentials: true,
        }
      );

      // if (res.data.message !== "Updated Item") {
      //   setCartLength(res?.data?.cart?.items?.length);
      // alert("Added to cart");

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
      console.log(res);
    } catch (error) {
      console.error("Decrease Error : ", error.message);
    }
  };

  if (loading || !allProduct) return <Loader />;
  if (error) return <Error />;

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">
        {allProduct.map((item) => (
     
            <ProductCard
              item={item}
              addCart={addCart}
              decrease_qty={decrease_qty}
              availInCart={availInCart}
              slugify={slugify}
            />
        ))}
      </section>
    </>
  );
};

export default ShowProduct;
