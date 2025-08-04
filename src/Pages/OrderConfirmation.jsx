import axios from "../Components/axios";
import React, { useEffect, useState } from "react";

const OrderConfirmation = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [order_DId, setOrder_DId] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(
          "/api/payment/allOrder",
          {
            headers: {
              "Content-Type": "Application/json",
              userToken: token,
            },
            withCredentials: true,
          }
        );
        console.log(res?.data?.order[0]);
        setOrders(res?.data?.order[0]);
      } catch (error) {
        console.error("OrderConfirmed fetch error", error.message);
      }
    };
    fetchOrderDetails();
  }, []);

  useEffect(() => {
    let original_id = orders?.orderId;
    let cleanId = original_id?.startsWith("order_")
      ? original_id.replace("order_", "")
      : original_id;
    setOrder_DId(cleanId);
  }, [orders]);

  return (
    <>
      <div className="flex h-full w-full justify-center items-center">
        <div className="flex flex-col h-full w-full shadow-xl border-2 rounded-xl p-10 gap-6 justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl text-blue-400">
              Order Confirmed
            </h1>
          </div>

          {/* items */}
          <div className="gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 justify-between">
                <div className="flex gap-3 font-bold">
                  <span>Status: </span>
                  <p className="text-green-400">{orders.payStatus}</p>
                </div>
                <div>
                  <p>{order_DId}</p>
                </div>
              </div>
              {orders?.orderItems?.map((item, index) => (
                <div key={index} className="text-gray-500 font-bold">
                  <table border={2} className="w-full table-fixed">
                    <tbody>
                      <tr className="text-center w-full p-10 ">
                        <td className="w-[5%]">
                          <img
                            src={item.productImg}
                            className="w-full object-cover"
                          />
                        </td>
                        <td className="w-[15%]">{item.productTitle}</td>
                        <td className="w-[15%]">₹{item.productPrice}</td>
                        <td className="w-[15%]">{item.productQty}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>

          {/* address */}
          <div>
            <p className="font-bold">Delivery Address</p>
            {orders?.userShipping?.map((address, index) => (
              <div key={index}>
                <p>{address.userAddress}</p>
                <p>{address.userFullName}</p>
                <p>{address.userPincode}</p>
                <p>{address.userPhone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {}
    </>
  );
};

export default OrderConfirmation;
