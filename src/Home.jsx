// import ShowProduct from "../Components/Product/ShowProduct";
// import Cart from "../Pages/Cart";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ShowProduct from "./Components/Product/ShowProduct";
import Cart from "./Pages/Cart";
import UserLogin from "./Components/User/Userlogin";
import UserRegister from "./Components/User/UserRegister";
import Address from "./Pages/Address";
import OrderConfirmation from "./Pages/OrderConfirmation";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isCartOpen = queryParams.get("cart") === "open";
  const isLoginOpen = queryParams.get("login") === "open";
  const isRegisterOpen = queryParams.get("register") === "open";
  const isAddressOpen = queryParams.get("shipping") === "open";
  const isConfirmationOpen = queryParams.get("orderconfirm") === "open";

  const closeLogin = () => {
    queryParams.delete("login");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  const closeAddress = () => {
    queryParams.delete("shipping");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const closeRegister = () => {
    queryParams.delete("register");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  const closeConfirmation = () => {
    queryParams.delete("orderconfirm");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const closeCart = () => {
    queryParams.delete("cart");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="">
      <ShowProduct />

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

      {isLoginOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 "
            onClick={closeLogin}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="p-6 rounded shadow-lg w-full h-[600px] md:w-[400px] md:h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <UserLogin />
            </div>
          </div>
        </>
      )}

      {isAddressOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50"
            onClick={closeAddress}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="p-6 rounded shadow-lg w-[400px] h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <Address />
            </div>
          </div>
        </>
      )}

      {isConfirmationOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50"
            onClick={closeConfirmation}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white border rounded shadow-xl w-full md:w-[400px] h-[600px] md:h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <OrderConfirmation />
            </div>
          </div>
        </>
      )}

      {isRegisterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40  z-50"
            onClick={closeRegister}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="p-6 rounded shadow-lg w-[400px] h-[400px] pointer-events-auto  flex justify-center items-center rounded-xl">
              <UserRegister />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
