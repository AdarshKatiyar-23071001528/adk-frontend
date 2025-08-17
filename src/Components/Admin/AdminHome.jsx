import { Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AddProduct from "./AddProduct";
// import "./AdminHome.css";
import Dashboard from "./Dashboard";
import AllProduct from "./AllProduct";
import Edit from "./Edit";
import Users from "./Users";
import { useEffect } from "react";
import axios from "../axios";
import { useState } from "react";
import AllOrders from "./AllOrders";
const AdminHome = () => {
  const [vaild, setVaild] = useState(false);

  useEffect(() => {
    const admin_Token = localStorage.getItem("admin-Token");
    if (!admin_Token) return;
    else {
      const checkVaildation = async () => {
        try {
          const res = await axios.get("/api/admin/vaild", {
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

  return (
    <>
      {vaild && (
        <div className="flex min-w-screen h-screen bg-blue-400 p-10">
          <div className="flex gap-2  rounded-xl w-full h-full ">
            <div className="flex flex-col p-10 justify-center font-bold border-2 rounded-xl min-h-full ">
              <div className="admin-dashboard hover:translate-x-2 transition-transform duration-300">
                <Link to={"/admin/home"}>
                  <span>Dashboard</span>
                </Link>
              </div>
              <div className="admin-product  hover:translate-x-2 transition-transform duration-300 ">
                <Link to={"/admin/home/products"}>
                  <span>Products</span>
                </Link>
              </div>
              <div className="admin-users  hover:translate-x-2 transition-transform duration-300">
                <Link to={"/admin/home/users"}>
                  <span>Users</span>
                </Link>
              </div>
              <div className="admin-orders  hover:translate-x-2 transition-transform duration-300">
                <Link to={"/admin/home/allOrders"}>
                  <span>Orders</span>
                </Link>
              </div>
            </div>
            {/* Dashboard view  */}
            <div className="h-full w-full  ">
              <Suspense fallback="Loading...">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="products/addProduct" element={<AddProduct />} />
                  <Route path="/products" element={<AllProduct />} />
                  <Route path="/products/edit/:id" element={<Edit />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/allOrders" element ={<AllOrders/>} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHome;
