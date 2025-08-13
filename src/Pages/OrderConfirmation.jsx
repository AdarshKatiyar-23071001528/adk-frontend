import { useLocation, useNavigate } from "react-router-dom";
import axios from "../Components/axios";
import React, { useEffect, useState } from "react";

const OrderConfirmation = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [order_DId, setOrder_DId] = useState("");


  // close confirmation
  const navigate = useNavigate();
  const location = useLocation();
  const closeConfirmation = () =>{
    const currentUrl = new URLSearchParams(location.search);
    currentUrl.delete('orderconfirm');
    navigate(`${location.pathname}?${currentUrl.toString()}`);
  }

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
      <div className="flex h-full w-full justify-center items-center relative bg-linear rounded-xl">
        <div className="flex flex-col h-full w-full shadow-xl md:rounded-xl p-5 gap-2 justify-around">

          <div className="absolute right-4 top-3 text-red-600 h-[20px] w-[20px] rounded-full bg-gray-300 hover:bg-gray-400 items-center justify-center flex p-3 font-bold cursor-pointer" onClick={closeConfirmation}>
            X
          </div>


          {/* heading */}
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-[13px] md:text-[20px] md:text-2xl ">
              Order Confirmed
            </h1>
          </div>

          {/* items container */}
          <div>
            <div className="flex flex-col gap-2">
              
              
              {/*status + id  */}
              <div className="flex justify-between">

                <div className="flex gap-3 font-bold text-[11px] md:text-[13px]">
                  <span>Status: </span>
                  <p className="text-green-400">{orders.payStatus}</p>
                </div>


                <div className="text-[11px] md:text-[13px]">
                  <p>{order_DId}</p>
                </div>


              </div>


               {/* product  */}
              <div className="h-[150px] overflow-y-auto">
                 {orders?.orderItems?.map((item, index) => (
                <div key={index} className="text-gray-500 font-bold  text-[10px]">
                  <table border={2} className="w-full table-fixed text-[13px]">
                    <tbody>
                      <tr className="text-center w-full p-10 ">
                        <td className="w-[5%]">
                          <img
                            src={item.productImg}
                            className="w-full object-cover"
                          />
                        </td>
                        <td className="w-[15%] truncate">{item.productTitle}</td>
                        <td className="w-[15%]">₹{item.productPrice}</td>
                        <td className="w-[15%]">{item.productQty}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
              </div>
             
            </div>
          </div>

          {/* address */}
          <div>
            <p className="font-bold text-[13px]">Delivery Address</p>
            {orders?.userShipping?.map((address, index) => (
              <div key={index} className="text-[12px]">
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
