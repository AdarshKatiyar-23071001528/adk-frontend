import axios from "../Components/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SpecificOrder = () => {
  let { orderId } = useParams();
  const [orderData, setOrderData] = useState({});
  const [product, setProduct] = useState([]);
  const [address, setAddress] = useState({});

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/payment/specificOrder/${orderId}`);
        console.log(res?.data?.order[0].orderItems);
        setOrderData(res?.data?.order[0]);
        setProduct(res?.data?.order[0].orderItems || []);
        setAddress(res?.data?.order[0].userShipping[0] || {});
      } catch (error) {
        console.log("Specific Order error :", error.message);
      }
    };
    fetchOrder();
  }, [orderId]);

  const skipKeys = ["createdAt", "_id", "userPincode"];

  return (
    <div className="w-full min-h-screen pt-[150px] px-4 md:px-12 bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Order Details
      </h1>

      {/* Order Items */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Products
        </h2>
        <div className="flex flex-col">
          {product.map((item, index) => (
            <Link
              key={item._id}
              to={`/product/${slugify(item.productTitle)}/cn/${item.productId}`}
            >
              <div
                key={index}
                className="p-1 flex  shadow-sm hover:shadow-md transition bg-gray-50 w-full justify-around"
              >
                <img
                  src={item.productImg}
                  alt={item.productTitle}
                  className="w-10 h-10 object-fill mb-1 rounded-lg bg-white md:w-20"
                />
                <h3 className=" text-[13px] md:text-lg font-medium text-gray-800 md:w-40 w-20">
                  {item.productTitle}
                </h3>
                <p className="text-gray-600  text-[10px] md:text-sm mt-1 md:w-20 w-10">
                  Qty:{" "}
                  <span className="font-semibold text-gray-800 w-full">
                    {item.productQty}
                  </span>
                </p>
                <p className="text-gray-800 font-medium md:font-semibold  w-10">
                  ₹{item.productPrice}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Payment Details
        </h2>
        <div className="w-full flex flex-col">
          <div className="flex justify-between pl-3 pr-3">
            <p>Payment </p>
            <p>{orderData.payStatus}</p>
          </div>
          <div className="flex justify-between pl-3 pr-3">
            <p>Amount </p>
            <p>{orderData.amount}</p>
          </div>
          <div className="flex justify-between pl-3 pr-3">
            <p>Delivery Fee</p>
            <p>00</p>
          </div>

          <div className="flex justify-between pl-3 pr-3">
            <p>Total Payment</p>
            <p>{orderData.amount}</p>
          </div>
        </div>
      </div>
      {/* Shipping Address */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Shipping Address
        </h2>
        <div className="space-y-3">
          {Object.entries(address)
            .filter(([key]) => !skipKeys.includes(key))
            .map(([key, value]) => (
              <p key={key} className="text-gray-700 text-base">
                <span className="font-medium capitalize">{key}:</span>{" "}
                <span className="text-gray-900">{value}</span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpecificOrder;
