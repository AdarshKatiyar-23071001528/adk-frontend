import React from "react";
import "./Dashboard.css";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import AppContext from "../../Context/AppContext";

const Dashboard = () => {
  const [vaild, setVaild] = useState(false);
  const [token, setToken] = useState('');
  const [payment, setPayments] =  useState([]);
  const {product,users,setOrders,orders} = useContext(AppContext);
//  console.log(users);

  useEffect(() => {
    const admin_Token = localStorage.getItem("admin-Token");
    setToken(admin_Token);
    if (!admin_Token) return;
    else {
      const checkVaildation = async () => {
        try {
          const res = await axios.get("http://localhost:2002/api/admin/vaild", {
            headers: {
              "Content-Type": "Application/json",
              adminToken: admin_Token,
            },
            withcredential: true,
          });

          if (res?.data?.success) {
            setVaild(!vaild);
          }
        } catch (error) {
          console.error("Vaildation Errror", error.message);
        }
      };
      checkVaildation();
    }
  }, []);

  useEffect(()=>{
  
    if(!token) return;
    else{
      const pay = async() =>{
        const res = await axios.get("http://localhost:2002/api/admin/payments",{
          headers:{
            "Content-Type" : "Application/json",
              adminToken : token,
          },
          withCredentials:true,
        })
        console.log(res?.data?.payment);
        const data = res?.data?.payment; 
        setPayments(data);
      }
      pay();
    }
  },[token]);


  

  
  const proQty = product.length; 
  const amount = payment.reduce((acc,item)=> acc+item.amount, 0);
  const items = payment.reduce((acc,item)=> acc+item.orderItems.length,0)
  const userQty= users.length;



  return (
    <>
      {vaild && (
        <div className="w-full h-full rounded-xl ">
          <div className="flex gap-2">
            <div className="order h-[140px] w-[15%] border rounded-xl flex flex-col justify-center items-center gap-5">
              <h1 className="font-bold text-3xl text-gray-500">Orders</h1>
              <p className="font-bold">{items}</p>
            </div>
            <div className="user h-[140px] w-[15%]  border rounded-xl flex flex-col justify-center items-center gap-5">
              <h1 className="font-bold text-3xl text-gray-500">Users</h1>
              <p className="font-bold">{userQty}</p>
            </div>
            <div className="product h-[140px] w-[15%] border rounded-xl flex flex-col justify-center items-center gap-5">
              <h1 className="font-bold text-3xl text-gray-500">Products</h1>
              <p className="font-bold">{proQty}</p>
            </div>
               <div className="user h-[140px] w-[15%]  border rounded-xl flex flex-col justify-center items-center gap-5">
              <h1 className="font-bold text-3xl text-gray-500">Payments</h1>
              <p className="font-bold">{amount}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
