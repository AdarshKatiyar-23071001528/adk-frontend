import React, { useEffect, useState } from "react";
import "./User.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";

const UserRegister = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const currentParams = new URLSearchParams(location.search);

  const alreadyUser = () => {
    currentParams.delete("register");
    navigate(`${location.pathname}?${currentParams.toString()}`);
  };

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const closeRegister = () => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.delete('register');
    navigate(`${location.pathname}?${currentParams.toString()}`);
  }

  const handleClick = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    register();
  };

  const register = async () => {
    try {
      const res = await axios.post("/api/user/register", formData, {
        headers: {
          "Content-Type": "Application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        alert(res.data.message);
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="userRegister h-full w-full  flex justify-center items-center bg-blue-400 rounded-xl">
      <div className="RegisterContainer h-full w-full justify-center items-center flex overflow-hidden relative">
        <div className="Register-logic-container z-10 flex items-center justify-center bg-white shadow-xl rounded-xl border h-full w-full relative">
          <div
            className="absolute top-3 right-3 cursor-pointer text-red-700"
            onClick={closeRegister}
          >
            <span class="material-symbols-outlined">close</span>
          </div>
          <form
            action="Post"
            onSubmit={(e) => formSubmit(e)}
            className="h-full w-full flex flex-col p-5 gap-5 justify-center"
          >
            <h1 className="w-full flex font-bold text-[24px] md:text-[40px] text-gray-700">
              Sign-In
            </h1>
            <div className="gap-3 flex flex-col">

              <div className="w-full border flex gap-3 p-4 rounded-3xl">
                {/* <span>Email</span> */}
                <input
                  id="email"
                  name="userEmail"
                  type="email"
                  className="setNone"
                  placeholder="Enter your Email"
                  onChange={(e) => handleClick(e)}
                  value={formData.userEmail}
                />
              </div>
              <div className="w-full border flex gap-3 p-4 rounded-3xl">
                {/* <span>Password</span> */}
                <input
                  className="setNone"
                  type="password"
                  name="userPassword"
                  id="password"
                  placeholder="Enter password"
                  onChange={handleClick}
                  value={formData.userPassword}
                />
              </div>

            </div>
            <div className="">
              <button
                type="submit"
                className="font-bold text-xl border-2 p-2 rounded-2xl bg-blue-300 hover:bg-blue-400 duration-300 ease-in w-full"
              >
                Sign-In
              </button>
              <div
                className="text-blue-300 w-full flex justify-end pr-4 cursor-pointer"
                onClick={alreadyUser}
              >
                Already User
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
