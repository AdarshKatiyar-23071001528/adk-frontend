import axios from "../Components/axios";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useLocation, useNavigate } from "react-router-dom";

const All_order = () => {
  const userToken = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
const navigate = useNavigate();
const location = useLocation();
const closeSummary = () =>{
    const currentUrl = new URLSearchParams(location.search);
    currentUrl.delete('summary');
    navigate(`${location.pathname}?${currentUrl.toString()}`);
}




  useEffect(() => {
    const fetchAdd = async () => {
      try {
        setLoad(true);
        const res = await axios.get("/api/payment/allOrder", {
          headers: {
            "Content-Type": "Application/json",
            userToken,
          },
          withCredentials: true,
        });
        setData(res?.data?.order);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoad(false);
      }
    };
    fetchAdd();
  }, [userToken]);
  console.log(data);

  if (load) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="h-full w-full bg-linear flex justify-center items-center flex-col rounded-xl relative">
        <div className="absolute top-3 right-3 text-red-500 cursor-pointer"

            onClick={closeSummary}
          >
            <span class="material-symbols-outlined">close</span>
          </div>

    
      <h1 className="font-bold text-[16px] md:text-2xl w-full p-3">
        Order Summary
      </h1>
      <div className="w-full h-[300px] overflow-y-auto p-3 ">
        {data?.map((item, index) => (
          <div
            key={index}
            className="w-full border border-gray-300 rounded-xl mb-2 shadow-lg"
          >
            <div className="flex justify-between text-[10px] md:text-[13px] p-2">
              <p>{"OrderDate"}</p>
              <p>{item?.orderDate?.split("T")[0]}</p>
            </div>

            <div className="w-full h-fit">
              <table className="table-fixed w-full border-collapse text-sm">
                <tbody>
                  {item?.orderItems?.map((item, index) => (
                    <tr key={index} className="text-center border-b">
                      <td className="w-[20%] p-2">
                        <img
                          src={item.productImg}
                          alt="product"
                          className="w-10 h-10 object-cover rounded mx-auto"
                        />
                      </td>

                      <td className="w-[25%] p-2 truncate">
                        {item.productTitle}
                      </td>

                      <td className="w-[25%] p-2">₹{item.productPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default All_order;
