import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";

const Footer = () => {
  const [Admin, setAdmin] = useState();
  const [login, setLogin] = useState(false);

  const [isOptionOpen, setIsOption] = useState(false);
  const { userToken, cartLength, setCartLength } = useContext(AppContext);
// console.log(orderlength);
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
    setIsOption(false);
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
    setIsOption(false);
  };

  //handle Order Summary
  const handleOrderSummary = () => {
    const currentUrl = new URLSearchParams(location.search);
    currentUrl.set("summary", "open");
    navigate(`${location.pathname}?${currentUrl.toString()}`);
  };

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full md:relative md:w-[150px]">
      <div
        className="thirdPart md:w-[150px] w-full md:relative"
        ref={dropdownRef}
      >
        <div className="otherContainer md:w-[150px] w-full">
          <div className="menuContainer bg-blue-200  flex md:w-[150px]  w-full p-4 justify-around  rounded-xl items-center md:bg-transparent h-full">
            {/* cart */}
            <div
              className="cartContainer relative cursor-pointer"
              onClick={openCart}
            >
              <span className="material-symbols-outlined ">shopping_cart</span>
              {cartLength > 0 && (
                <div className="md:h-[20px] h-[10px] w-[10px] md:w-[20px] flex items-center justify-center rounded-full text-[10px] md:text-[13px] absolute top-[-10px] right-[-5px] bg-gray-300">
                  {" "}
                  <p>{cartLength}</p>
                </div>
              )}
            </div>

            {/* login */}
            <div className="loginContainer transition duration-300 delay-100 ease-in-out cursor-pointer">
              {!login && (
                <div
                  className="onLogin flex flex-col gap-[3px] items-center"
                  onClick={onlogin}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                </div>
              )}
            </div>

            {/* menu */}
            <div
              className="flex flex-col gap-1 items-center justify-center cursor-pointer "
              onClick={() => setIsOption(!isOptionOpen)}
            >
              <span class="material-symbols-outlined">menu</span>
            </div>

            {/* options */}
            {isOptionOpen && (
              <div className="md:h-[200px] h-fit absolute top-[-80px] md:top-12 right-0 w-[50%] md:w-full ">
                <div className=" cursor-pointer bg-blue-300 text-center w-full h-full">
                  <div
                    className="hover:bg-blue-400 p-2 w-full  "
                    onClick={handleLogout}
                  >
                    Logout
                  </div>

                  <div
                    className="hover:bg-blue-400 p-2 w-full "
                    onClick={handleAdmin}
                  >
                    Admin
                  </div>

                  {login &&( 
                    <div
                      className="hover:bg-blue-400 p-2 w-full"
                      onClick={handleOrderSummary}
                    >
                      OrderSummary
                    </div>
                  )}
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
