import React, { useContext, useState } from "react";
import "./User.css";
import Bubble from "../../Common/Bubble";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../../Context/AppContext";

const UserLogin = () => {
   
  let navigate = useNavigate();
  const location = useLocation();
  let {setUserToken} = useContext(AppContext);
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const handleLogin = (e) => {
    const {name, value} = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };
  const onLogin = (e) => {
    e.preventDefault();
    fetchLogin();
  };

  const fetchLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:2002/api/user/login",
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
          },
          withCredentials: true,
        }
      );
      

      if (res.data.message) {
        setUserToken(res.data.userToken);
        localStorage.setItem('token',res.data.userToken);
        alert(res.data.message);
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const isRegister = () =>{
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('register','open');
    navigate(`${location.pathname}?${urlParams.toString()}`);
  }
  return (
    <div className="h-[400px] w-[400px] flex justify-center items-center bg-blue-400 rounded-xl">
        {/* <Bubble/> */}
        <div className=" z-10 flex items-center justify-center bg-white shadow-xl rounded-xl border h-[400px] w-[400px]">
          <form
            action="post"
            className="flex flex-col justify-around h-full w-full p-4"
            onSubmit={(e) => onLogin(e)}
          >
            <h2 className="text-xl font-bold text-gray-700 text-[16px] font-bold md:text-[40px]">
              Login
            </h2>
            <div className="flex flex-col gap-3">
              <div className="border-2 p-4 rounded-3xl">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="setNone w-full"
                  value={formData.userEmail}
                  onChange={handleLogin}
                  name="userEmail"
                />
              </div>
              <div className="border-2 p-4 rounded-3xl">
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="setNone w-full"
                  value={formData.userPassword}
                  onChange={handleLogin}
                  name="userPassword"
                />
              </div>
            </div>
            <div className="">
              <button
                type="submit"
                className="border-2 w-full p-3 rounded-2xl text-xl font-bold bg-blue-300 hover:bg-blue-400"
              >
                Login
              </button>
                <div 
                className="text-blue-300 w-full flex justify-end pr-4 cursor-pointer"
                onClick={isRegister}
              >
                New User
              </div>
            </div>
          </form>
        </div>
    </div>
   
  );
};

export default UserLogin;
