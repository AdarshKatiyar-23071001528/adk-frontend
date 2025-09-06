import axios from "../Components/axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Error from "./Error";
import Loading from "./Loading";
import UserLogin from "../Components/User/Userlogin";
import Cart from "./Cart";
import UserRegister from "../Components/User/UserRegister";
import AppContext from "../Context/AppContext";
import Match from "./Match";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdShare, IoIosPricetags } from "react-icons/io";

import Loader from "./Loader";
import Alert from "./Alert";
import Tag from "./Tag";

const ViewProduct = () => {
  //from context api
  const { setCartLength, userToken, cartItems } = useContext(AppContext);

  let { id } = useParams();
  const [specificProduct, setSpecificProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchParams = new URLSearchParams(location.search);
  const isLoginOpen = fetchParams.get("login") === "open";
  const isCartOpen = fetchParams.get("cart") === "open";
  const isRegisterOpen = fetchParams.get("register") === "open";
  const [like, setLike] = useState(false);
  const [product, setProduct] = useState([]);
  const [cartItem, setcartItem] = useState([]);

  const closeLogin = () => {
    fetchParams.delete("login");
    navigate(`${location.pathname}?${fetchParams.toString()}`);
  };
  const closeCart = () => {
    fetchParams.delete("cart");
    navigate(`${location.pathname}?${fetchParams.toString()}`);
  };
  const closeRegister = () => {
    fetchParams.delete("register");
    navigate(`${location.pathname}?${fetchParams.toString()}`);
  };
  const isOpenAlert = fetchParams.get("alert") === "open";
  const openAlert = () => {
    fetchParams.set("alert", "open");
    navigate(`${location.pathname}?${fetchParams.toString()}`);
  };

  const closeAlert = () => {
    fetchParams.delete("alert");
    navigate(`${location.pathname}?${fetchParams.toString()}`);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key == "Escape") {
        closeLogin();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  //add cart
  const addCart = async (product) => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      openAlert();
      return;
    }
    const { _id, productPrice, productCategory, productImg, productTitle } =
      product;
    try {
      const res = await axios.post(
        "/api/cart/add",
        {
          productId: _id,
          productPrice,
          productTitle,
          productImg,
          productQty: 1,
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
      //   setCartLength(res.data.cart.items.length);
      //   window.location.reload();
      // } else {
      //   alert(res.data.message);
      // }
    } catch (error) {
      console.log(error);
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

  const availInCart = (id) => {
    const item = cartItem?.find((item) => item.productId === id);
    return item ? item.productQty : 0;
  };
  // find product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/specificProduct/${id}`);

        if (res.data.success && res.data.product) {
          setSpecificProduct(res.data.product);
        } else {
          setSpecificProduct(null);
        }
      } catch (error) {
        setSpecificProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  if (loading) return <Loader />;
  if (!specificProduct) return <Loader />;

  //Native share api
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Adk Mart",
          text: "Check out this amazing website",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Native Share Error :", err.message);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied! Share it anywhere.");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-fit gap-4 pt-[150px] pb-[100px] md:pt-[170px] w-full">
        {/* LEFT SIDE - IMAGE + PRICE */}
        <form
          className=" md:sticky top-[150px]  md:w-1/2 flex flex-col gap-6 items-center md:rounded-xl shadow-md w-full"
          onSubmit={(e) => handleSubmit(e, specificProduct)}
        >
          <img
            src={specificProduct.productImg}
            alt="product"
            className="h-[320px] md:h-[400px]  w-full md:w-fit md:rounded-2xl object-contains"
          />

          <div className="w-full flex justify-around items-center border-t pt-5 p-3">
            <p className="text-2xl font-bold text-gray-800">
              ₹ {specificProduct.productPrice}
            </p>
            {availInCart(specificProduct._id) <= 0 ? (
              <button
                type="submit"
                className=" bg-pink-500 text-white px-5 py-2 rounded-lg w-full md:relative fixed bottom-0 left-0 md:w-1/4 z-60"
                // onClick={() => addCart(item)}
              >
                Add To cart
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white rounded-lg w-full md:relative fixed bottom-0 left-0 md:w-1/4 z-60 px-5 py-2 shadow  justify-around">
                <button
                  type="submit"
                  // onClick={() => addCart(item)}
                  className="text-green-500 text-xl"
                >
                  +
                </button>
                <p>{availInCart(specificProduct._id)}</p>
                <button
                  type="button"
                  className="text-red-500 text-xl"
                  onClick={() => decrease_qty(specificProduct._id)}
                >
                  -
                </button>
              </div>
            )}
          </div>
        </form>

        {/* RIGHT SIDE - DETAILS */}
        <div className="flex flex-col gap-4 md:w-1/2 bg-whtie  p-6 rounded-xl shadow-md ">
          <div className="flex gap-2 w-full justify-between  pt-2 border-b">
            <h2 className="text-xl font-bold text-gray-700 pb-2">
              Product Details
            </h2>
            {/* like and share button */}
            <div className="flex gap-2">
              <p
                className="text-[16px] md:text-[24px] cursor-pointer"
                onClick={handleShare}
              >
                <IoMdShare />
              </p>
              <p
                className="text-[16px] md:text-[24px]"
                onClick={() => setLike(true)}
              >
                {like ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </p>
            </div>
          </div>

          {Object.entries(specificProduct).map(([key, value], index) => {
            if (["__v", "_id", "productImg", "createdAt"].includes(key))
              return null;

            const formattedKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (char) => char.toUpperCase());

            return (
              <div key={index} className="flex flex-col text-gray-800">
                <span className="font-semibold">{formattedKey}:</span>
                <span className="pl-2">
                  {typeof value === "string" && value.length > 100
                    ? value.split(/[.]/).map((line, i) => (
                        <li key={i} className="ml-5 list-disc text-sm">
                          {line.trim()}
                        </li>
                      ))
                    : value}
                </span>
              </div>
            );
          })}

          {/* tag static */}
          <div className="w-full p-2">
            {/* <div className="flex justify-around gap-1 w-full">
              <h1 className="p-2 md:p-4 flex flex-col items-center font-bold bg-blue-200 rounded-xl gap-2  justify-center w-[25%]">
                <p className="text-green-400 text-[10px] md:text-[24px]  w-full flex items-center justify-center">
                  <FaMoneyBill1Wave />
                </p>
                <p className="text-center text-[10px] md:text-[20px] text-pretty">Cash On delivery</p>
              </h1>

              <h1 className="p-2 md:p-4 flex flex-col items-center font-bold bg-blue-200 rounded-xl gap-2  justify-center w-[25%]">
                <p className="text-green-400 text-[13px] md:text-[24px]  w-full flex items-center justify-center">
                  <GiReturnArrow />
                </p>
                <p className="text-center text-[10px] md:text-[20px] text-pretty">7 Days Return</p>
              </h1>

              <h1 className="p-2 md:p-4 flex flex-col items-center font-bold bg-blue-200 rounded-xl gap-2  justify-center w-[25%]">
                <p className="text-green-400 text-[13px] md:text-[24px]  w-full flex items-center justify-center">
                  <IoIosPricetags />
                </p>
                <p className="text-center text-[10px] md:text-[20px] text-pretty">Lowest Price</p>
              </h1>
            </div> */}

             <Tag/>
          </div>
         
        </div>
      </div>

      <div className="w-full">
        <Match proCategory={specificProduct?.productCategory} />
      </div>
      {isLoginOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40  z-40"
            onClick={closeLogin}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="shadow-lg w-full h-[400px] md:w-[400px] md:h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <UserLogin />
            </div>
          </div>
        </>
      )}
      {isRegisterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40  z-40"
            onClick={closeRegister}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-linear shadow-lg w-full md:w-[400px] h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <UserRegister />
            </div>
          </div>
        </>
      )}
      {/* {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={closeCart}
          ></div>

          <div
            className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-blue-300 z-50 transition-transform duration-300 ease-in-out overflow-y-hidden shadow-lg ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Cart />
          </div>
        </>
      )} */}

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

      {isOpenAlert && (
        <>
          <div
            className="inset-0 fixed bg-black/40 z-50"
            onClick={closeAlert}
          />
          <div className="fixed inset-0 z-50 pointer-events-none flex justify-center items-center">
            <div className="shadow-lg w-full md:w-[400px]  h-[200px] pointer-events-auto flex justify-center items-center rounded-xl bg-linear relative">
              <Alert />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewProduct;
