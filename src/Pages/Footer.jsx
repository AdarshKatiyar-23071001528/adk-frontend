import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";

const Footer = () => {
  const [Admin, setAdmin] = useState();
  const [login, setLogin] = useState(false);

  const [isOptionOpen, setIsOption] = useState(false);
  const { userToken, cartLength, setCartLength } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userToken) {
      setLogin(true);
    }
  }, [userToken]);
  // on userLogout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogin(false);
  };

  const openCart = () => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("cart", "open");
    navigate(`${location.pathname}?${currentParams.toString()}`);
  };

  const onlogin = () => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("login", "open");
    navigate(`${location.pathname}?${currentParams.toString()}`);
  };

  const dropdownRef = useRef(null); // 🔹 Step 1

  // 🔹 Step 2: Detect outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // or "click"
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // for only one admin can be operate
  useEffect(() => {
    const admin = async () => {
      const res = await axios.get("/api/admin/length");
      setAdmin(res?.data?.length);
    };
    admin();
  }, []);

  // handle admin login
  const handleAdmin = () => {
    if (Admin < 1) {
      navigate("/admin-protected/register");
    } else {
      navigate("/admin-first-secured/login");
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-white md:relative md:w-[150px]">
      {/* tumhara baaki ka footer ka code yaha rahega */}

      <div
        className="thirdPart md:w-[150px] w-full md:relative "
        ref={dropdownRef}
      >
        <div className="otherContainer md:w-[150px] w-full">
          <div className="menuContainer bg-blue-200  flex md:w-[150px]  w-full p-4 justify-between items-center md:bg-transparent ">
            <div
              className="cartContainer relative cursor-pointer"
              onClick={openCart}
            >
              <span className="material-symbols-outlined ">shopping_cart</span>
              {cartLength > 0 && (
                <p className="absolute set-cart-length font-bold">
                  {cartLength}
                </p>
              )}
            </div>

            <div className="loginContainer transition duration-300 delay-100 ease-in-out cursor-pointer">
              {!login ? (
                <div
                  className="onLogin flex flex-col gap-[3px] items-center"
                  onClick={onlogin}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                </div>
              ) : (
                <div className="profile">
                  <div className="flex flex-col gap-1 items-center">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex flex-col gap-1 items-center justify-center cursor-pointer "
              onClick={() => setIsOption(!isOptionOpen)}
            >
              <span class="material-symbols-outlined">menu</span>
            </div>

            {isOptionOpen && (
              <div className="absolute top-[-90px] left-[0px] md:top-[45px] cursor-pointer bg-blue-300 text-center w-full md:w-[100px] md:rounded-xl">
                <div
                  className="hover:bg-blue-400 p-2 w-full md:w-[100px] rounded-tl-xl rounded-tr-xl"
                  onClick={handleLogout}
                >
                  Logout
                </div>
                <div
                  className="hover:bg-blue-400 p-2 w-full md:w-[100px] rounded-bl-xl rounded-br-xl"
                  onClick={handleAdmin}
                >
                  Admin
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
