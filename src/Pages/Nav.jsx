import React, { useContext, useEffect, useRef, useState } from "react";
import "./Nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";
import Footer from "./Footer";

const Nav = () => {

  const [searchBar, setSearchBar] = useState("");
  const {product,setFilterProduct} = useContext(AppContext);

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


  // from here handle shrink
  const [shrink, setShrink] = useState(0);
  const windowWidth = window.innerWidth;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop <= 50) {
        setShrink(false);
      } else {
        setShrink(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-300 ease-in ${
          shrink ? "translate-y-[-30px]" : "translate-y-0"
        }`}
      >
        <div
          className={`flex md:flex-row flex-col items-center justify-between px-4 py-1 transition-all duration-300  `}
        >
          <div
            className={`
        ${shrink ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
          >
            <div className="logoContainer">
              <Link to="/">
                <h1 className="font-bold text-red-600 text-2xl md:text-3xl">
                  Adk<span className="text-blue-300">Mart</span>
                </h1>
              </Link>
            </div>
          </div>

          <div className="secondPart p-2 md:w-[40%] w-full md:relative ">
            <div className="searchContainer flex rounded-md  items-center text-center bg-white border-2 border-gray-400">
              <input
                type="text"
                onChange={(e) => setSearchBar(e.target.value)}
                value={searchBar}
                name="searchBar"
                className="w-[90%] rounded-md pt-1 pb-1 none pl-1"
              />
              <div className="flex items-center justify-center w-[40px]">
                <span className="material-symbols-outlined">search</span>
              </div>
            </div>
          </div>
          {windowWidth > 400 && (
           <Footer/>
          )}
        </div>
      </nav>
      {windowWidth < 400 && (
          <Footer/>
      )}
    </>
  );
};

export default Nav;
