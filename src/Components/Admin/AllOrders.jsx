import React from "react";
import { useContext } from "react";
import AppContext from "../../Context/AppContext";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const token = localStorage.getItem("admin-Token");
  const [payment, setPayments] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);

  useEffect(() => {
    if (!token) return;
    else {
      const pay = async () => {
        const res = await axios.get(
          "http://localhost:2002/api/admin/payments",
          {
            headers: {
              "Content-Type": "Application/json",
              adminToken: token,
            },
            withCredentials: true,
          }
        );
        // console.log(res?.data?.payment);
        const data = res?.data?.payment;
        setPayments(data);
      };
      pay();
    }
  }, [token]);

  useEffect(() => {
    const orders = payment.flatMap((item) => item.orderItems || []);
    setAllOrders(orders);
  }, [payment]);
  console.log(AllOrders);

 return (
  <div className="w-full h-full p-4">
    <h1 className="font-bold text-4xl mb-4">Order List</h1>

    {/* Scrollable Table Container */}
    <div className="h-[500px] overflow-y-auto border rounded-md">
      <table className="table-fixed w-full border-collapse">
        {/* Table Header */}
        <thead className="sticky top-0 bg-blue-500  text-center">
          <tr>
            <th className="w-[5%] p-2">Image</th>
            <th className="w-[35%] p-2">Title</th>
            <th className="w-[25%] p-2">Quantity</th>
            <th className="w-[25%] p-2">Price</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {AllOrders.map((item, index) => (
            <tr key={index} className="text-center border-b">
              <td className="p-2">
                <img src={item.productImg} alt="" className="w-10 h-10 object-cover mx-auto" />
              </td>
              <td className="p-2">{item.productTitle}</td>
              <td className="p-2">{item.productQty}</td>
              <td className="p-2">{item.productPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default AllOrders;
