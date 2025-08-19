import React, { useContext, useEffect, useRef, useState } from "react";
import "./Nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";
import Footer from "./Footer";

const Nav = () => {
  const [searchBar, setSearchBar] = useState("");
  const { product, setFilterProduct } = useContext(AppContext);

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

  // array
  const navCategory = ["local_mall", "footprint", "steps", "podiatry"];
  const name = ["All", "Slipper", "Shoes", "Sandal"];
  const navColor = ["bg-linear","bg-linear-red","bg-linear-pink","bg-linear-green"];
  const [nColor, setNavColor] = useState('bg-linear');

  // from here handle shrink
  const [shrink, setShrink] = useState(0);
  const windowWidth = window.innerWidth;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop <= 50 || windowWidth >= 430) {
        setShrink(false);
      } else {
        setShrink(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // works on click on category section
  const handleProduct = (item,index) => {
    try {
      if (item == "All") {
        setFilterProduct(product);
      }

      else{
        const fitered = product.filter((data) =>
        data?.productTitle?.toLowerCase().includes(item.toLowerCase())
      )
      setFilterProduct(fitered);
      }
      setNavColor(navColor[index])
    } catch (error) {
      console.log(error.message);
    }
  };

  
  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-500 ease-in ${nColor} flex flex-col shadow-[0_4px_4px_rgba(0,0,0,0.2)] border-b ${
          shrink ? "translate-y-[-30px]" : "translate-y-0"
        }`}
      >
        <div
          className={`flex md:flex-row flex-col items-center justify-between px-4 py-1 transition-all duration-300  w-full`}
        >
          <div
            className={`
        ${shrink ? "opacity-0 scale-0" : "opacity-500 scale-500"}`}
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

          {windowWidth > 430 && <Footer />}
        </div>
        

        {/* category Nav */}
        <div className="w-full overflow-x-auto scrollbar-hide cursor-pointer">
          <div className="flex" style={{ minWidth: "max-content" }}>
            {navCategory.map((items, index) => (
              <p
                key={index}
                className="p-2 text-[13px] md:text-[16px] md:p-4  text-center flex justify-center items-center"
                onClick={() => handleProduct(name[index],index)}
              >
                <span class="material-symbols-outlined">{items}</span>
                <span>{name[index]}</span>
              </p>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
