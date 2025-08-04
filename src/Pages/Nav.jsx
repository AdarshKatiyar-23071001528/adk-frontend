import React, { useContext, useEffect, useState } from "react";
import "./Nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";

const Nav = () => {
  const [profileImg, setProfileImg] = useState();
  const [admin, setAdmin] = useState();
  const [login, setLogin] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [isOptionOpen,setIsOption] = useState(false);
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

  // for only one admin can be operate
  useEffect(()=>{
    const admin = async()=>{
      const res = await axios.get('/api/admin/length');
      setAdmin(res?.data?.length);
    }
    admin();
  },[])
  const handleAdmin = () =>{
    if(admin<1){
      navigate('/admin-protected/register');
    }
    else{
      navigate('/admin-first-secured/login');
    }

  }

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
          <div className="otherContainer">
            <div className="menuContainer">
              <div className="cartContainer relative" onClick={openCart}>
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
                className="flex flex-col gap-1 items-center justify-center relative"
                onClick={() => setIsOption(!isOptionOpen)}
              >
                <span class="material-symbols-outlined">menu</span>


                {isOptionOpen && (
                  <div className="absolute top-[30px] cursor-pointer bg-blue-300  text-center ">
                    <option value="Logout" className="hover:bg-blue-400 p-2 w-[100px]" onClick={()=>handleLogout()}>Logout</option>
                <option value="Admin"  className="hover:bg-blue-400 p-2 w-[100px]" onClick={()=>handleAdmin()}>Admin</option>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
