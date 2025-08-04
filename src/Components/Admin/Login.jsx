import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import "./Admin.css";
import Bubble from "../../Common/Bubble";
import axios from "axios";

const Login = () => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
  });

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleLogin = async() =>{
    if(!formData.adminEmail || !formData.adminPassword){
      alert("Fill all field");
      return;
    }
    else{
      try {
        const res = await axios.post('http://localhost:2002/api/admin/login',formData);
        localStorage.setItem('admin-Token',res?.data?.adminToken);
        if(res?.data?.success){
          navigate('/admin/home');
        }
        } catch (error) {
        console.error("Admin login Error",error.message);
      }
    }
    

  }
  return (
    <>
      <div className="admin_LoginContainer relative overflow-hidden">
        <Bubble/>
        <div className="admin_Login border-2 shadow-xl bg-blue-400">
          <div className="logo">
            <h1 className="text-red-400 font-bold">AdkMart</h1>
            <p>Grocery Delivery On EverySunday</p>
          </div>

          <div className="adminEmail">
            {/* <span>Email</span> */}
            <input
              type="text"
              required
              placeholder="Enter Email"
              onChange={(e) => onHandleChange(e)}
              value={formData.adminEmail}
              name="adminEmail"
            />
          </div>
          <div className="adminPassword">
            {/* <span>Password</span> */}
            <input
              type="text"
              name="adminPassword"
              required
              placeholder="Enter Password"
              onChange={(e) => onHandleChange(e)}
              value={formData.adminPassword}
            />
          </div>
          <div className="btn">
            <button onClick={()=> handleLogin()}>Continue</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
