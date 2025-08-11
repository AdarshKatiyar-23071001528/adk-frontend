import axios from "../Components/axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Error from "./Error";
import Loading from "./Loading";
import UserLogin from "../Components/User/Userlogin";
import Cart from "./Cart";
import UserRegister from "../Components/User/UserRegister";

const ViewProduct = () => {
  let { id } = useParams();
  const [specificProduct, setSpecificProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchParams = new URLSearchParams(location.search);
  const isLoginOpen = fetchParams.get("login") === "open";
  const isCartOpen = fetchParams.get("cart") === "open";
  const isRegisterOpen = fetchParams.get("register") === "open";

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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key == "Escape") {
        closeLogin();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // find product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `/api/product/specificProduct/${id}`
        );

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

  if (loading) return <Loading />;
  if (!specificProduct) return <Error />;

  return (
    <>
  <div className="flex flex-col md:flex-row min-h-screen gap-10 pt-[100px]  pb-[100px] md:pt-[140px]  w-full">
    {/* LEFT SIDE - IMAGE + PRICE */}
    <div className="left-viewItem-container md:sticky top-[140px]  md:w-1/2 flex flex-col gap-6 items-center md:rounded-xl shadow-md w-full">
      <img
        src={specificProduct.productImg}
        alt="product"
        className="h-[320px] md:h-[400px]  w-full md:w-fit md:rounded-2xl object-contains"
      />

      <div className="w-full flex justify-around items-center border-t pt-5 p-3">
        <p className="text-2xl font-bold text-gray-800">
          ₹ {specificProduct.productPrice}
        </p>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition duration-300">
          Add to Cart
        </button>
      </div>
    </div>

    {/* RIGHT SIDE - DETAILS */}
    <div className="flex flex-col gap-4 md:w-1/2 bg-white  p-6 rounded-xl shadow-md ">
      <h2 className="text-xl font-bold text-gray-700 mb-2 border-b pb-2">
        Product Details
      </h2>

      {Object.entries(specificProduct).map(([key, value], index) => {
        if (["__v", "_id", "productImg", "createdAt"].includes(key)) return null;

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
                :  value}
            </span>
          </div>
        );
      })}
    </div>
  </div>


   

      {isLoginOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40  z-40"
            onClick={closeLogin}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="rounded shadow-lg w-full h-full md:w-[400px] md:Lh-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
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
            <div className="rounded shadow-lg w-full h-full md:w-[400px] md:h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <UserRegister />
            </div>
          </div>
        </>
      )}

      {isCartOpen && (
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
      )}
      
      
      </>
  );
};

export default ViewProduct;
