import React from "react";
import "./Admin.css";
import Bubble from "../../Common/Bubble";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  
  // for handle data
  const [formData, setFormData] = useState({
    adminEmail : "",
    adminPassword:""
  });

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setFormData((preData) =>({
      ...preData,[name]: value
  }))

  }

  const registered = async() =>{
    try {
      const res = await axios.post('http://localhost:2002/api/admin/register',formData,{
      headers:{
        "Content-Type" : "Application/json"
      },
      withCredentials:true,
    })
    console.log(res);
      
    } catch (error) {
      console.error("Admin register Error", error.message);
    }
  }





  return (
    <>
      <div className="admin_RegisterContainer relative overflow-hidden">

        <Bubble/>
        <div className="admin_Register border-2  shadow-xl">
          <div className="logo">
            <h1 className="text-red-400 font-bold">AdkMart</h1>
            <p>
              Grocery Delivery On EverySunday
            </p>
          </div>

          <div className="adminEmail border-2 border-gray-500 rounded-xl">
            {/* <span>Email</span> */}
            <input type="email" 
              value={formData.adminEmail}
              name ="adminEmail"
              onChange={(e)=>handleChange(e)}
            required placeholder="Enter Email"/>
          </div>
          <div className="adminPassword border-2 border-gray-500 rounded-xl">
            {/* <span>Password</span> */}
            <input type="password" 
            value={formData.adminPassword}
              name ="adminPassword"
              onChange={(e)=>handleChange(e)}
              className="w-full " required placeholder="Enter Password"/>
          </div>
          <div className="btn w-full">
            <button className="bg-blue-400"
            onClick={()=>registered()}>Register</button>
          </div>
          <p className="w-full"><span>Already Registerd </span><Link to={'/admin-first-secured/login'}>Login</Link> </p>
        </div>
      </div>
    </>
  );
};

export default Register;
