import React, { useContext, useEffect, useRef, useState } from "react";
import "./Nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";

const Nav = () => {
  const [profileImg, setProfileImg] = useState();
  const [admin, setAdmin] = useState();
  const [login, setLogin] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [isOptionOpen, setIsOption] = useState(false);
  const { userToken, setFilterProduct, product, cartLength, setCartLength } =
    useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userToken) {
      setLogin(true);
    }
  }, [userToken]);

  useEffect(() => {
    try {
      console.log(product);
      const filtered = product.filter((data) =>
        data?.productTitle?.toLowerCase().includes(searchBar.toLowerCase())
      );
      setFilterProduct(filtered);
    } catch (err) {
      console.log(err.message);
    }
  }, [searchBar]);

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
         console.log(dropdownRef,dropdownRef.current.contains(event.target));
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
     
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
    if (admin < 1) {
      navigate("/admin-protected/register");
    } else {
      navigate("/admin-first-secured/login");
    }
  };

  return (
    <div>
      <div className="NavContainer z-10">
        <div className="firstPart">
          <div className="logoContainer">
            <Link to="/">
              <h1>
                Adk<span>Mart</span>
              </h1>
            </Link>
          </div>
        </div>
        <div className="secondPart">
          <div className="searchContainer">
            <input
              type="text"
              onChange={(e) => setSearchBar(e.target.value)}
              value={searchBar}
              name="searchBar"
            />
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
        <div className="thirdPart">
          <div className="otherContainer ">
            <div className="menuContainer bg-blue-200">


              <div className="cartContainer relative" ref={dropdownRef} onClick={openCart}>
                <span className="material-symbols-outlined ">
                  shopping_cart
                </span>
                {cartLength > 0 && (
                  <p className="absolute set-cart-length font-bold">
                    {cartLength}
                  </p>
                )}
                {/* Cart */}
              </div>

              <div className="loginContainer transition duration-300 delay-100 ease-in-out">
                {!login ? (
                  <div
                    className="onLogin flex flex-col gap-[3px] items-center"
                    onClick={onlogin}
                  >
                    <span class="material-symbols-outlined">
                      account_circle
                    </span>
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

              {/* dropdown */}
              {isOptionOpen && (
                <div className="absolute top-[-90px] left md:top-[45px] cursor-pointer bg-blue-300 text-center w-full md:w-[100px] rounded-xl">
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
      </div>
    </div>
  );
};

export default Nav;
