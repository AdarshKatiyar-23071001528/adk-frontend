import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userToken, setCartLength,userId,setUserId } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAllAdress] = useState(false);
  const latestAddress = localStorage.getItem("userAddress");
  const currentUrl = new URLSearchParams(location.search);

  const openAddress = () => {
    const fetchParams = new URLSearchParams(location.search);
    fetchParams.set("shipping", "open");
    navigate(`${location.pathname}?${fetchParams.toString()}`);
  };
  const openLogin = () => {
    const params = new URLSearchParams(location.search);
    params.set("login", "open");
    params.set("cart", "open");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const confirmOrder = () =>{
    const fetchAddress = new URLSearchParams(location.search);
    fetchAddress.set('orderconfirm', 'open');
    navigate(`${location.pathname}?${fetchAddress.toString()}`);
  } 

  const addCart = async (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    const { productId, productPrice, productTitle, productImg } = item;
    try {
      await axios.post(
        "http://localhost:2002/api/cart/add",
        { productId, productQty: 1, productPrice, productTitle, productImg },
        {
          headers: {
            "Content-Type": "Application/json",
            userToken: userToken,
          },
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (err) {}
  };

  const delete_item = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:2002/api/cart/delete/${id}`,
        {
          headers: {
            "Content-Type": "Application/json",
            userToken: userToken,
          },
          withCredentials: true,
        }
      );
      alert(res.data.message);
      fetchCart();
    } catch (error) {
      console.error("error : ", error.message);
    }
  };

  const decrease_qty = async (id) => {
    try {
      await axios.get(`http://localhost:2002/api/cart/decreaseQty/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          userToken: userToken,
        },
        withCredentials: true,
      });
      fetchCart();
    } catch (error) {
      console.error("Decrease Error : ", error.message);
    }
  };

  const fetchCart = async () => {
    if (!userToken) return;
    try {
      const res = await axios.get("http://localhost:2002/api/cart/show", {
        headers: {
          "Content-Type": "Application/json",
          userToken: userToken,
        },
        withCredentials: true,
      });
      const cartItems = res?.data?.cart?.items || [];
      setCart(cartItems);
      setCartLength(cartItems.length);
    } catch (error) {
      console.error("Fetch Cart Error : ", error.message);
    }
  };

  //clear cart
  const clearCart = async () => {
    await axios.delete("http://localhost:2002/api/cart/clear", {
      headers: {
        "Content-Type": "Application/json",
        userToken,
      },
      withCredentials: true,
    });
  };

  useEffect(() => {
    fetchCart();
  }, [userToken]);

  // fetch saved latest address from userid and store it on address
  useEffect(() => {
    const fetchAddress = async () => {
      if (!userToken) return;
      try {
        const res = await axios.get(
          "http://localhost:2002/api/address/allAddress",
          {
            headers: {
              "Content-Type": "Application/json",
              userToken,
            },
            withCredentialsL: true,
          }
        );

        setUserId(res?.data?.address?.userID);
        const allAddress = res?.data?.address?.fullAddress;
        const latestIndex = allAddress?.length;
        setAddress(
          allAddress[latestIndex - 1] ? [allAddress[latestIndex - 1]] : []
        );
      } catch (error) {
        console.error("Fetch latest address Error : ", error.message);
      }
    };
    if (userToken) {
      fetchAddress();
    }
  }, [userToken]);

  // jb user koi new address dalega tb vo address cart me show hoga
  useEffect(() => {
    const fetchAddress = async () => {
      if (!latestAddress || !userToken) return;
      try {
        const res = await axios.get(
          `http://localhost:2002/api/address/specificAddress/${latestAddress}`,
          {
            headers: {
              "Content-Type": "Application/json",
              userToken,
            },
            withCredentials: true,
          }
        );

        setAddress(res?.data?.specificAdd ? [res.data.specificAdd] : []);
      } catch (error) {
        console.error("Fetch Address Error : ", error.message);
      }
    };

    fetchAddress();
  }, [latestAddress, userToken]);

  // total price calculate from reduce function
  const totalPrice = cart.reduce((acc, item) => acc + item.productPrice, 0);
  // total Qty calculate from reduce function
  const totalQty = cart.reduce((acc, item) => acc + item.productQty, 0);

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(
        `http://localhost:2002/api/payment/checkout`,
        {
          amount: totalPrice,
          cartItems: cart,
          userShipping: address,
          userId: userId,
        }
      );
      console.log(orderResponse);
      const { orderId, amount: orderAmount } = orderResponse.data;
      const options = {
        key: "rzp_test_Ry94xZg0gc9Zqj", // Enter the Key ID generated from the Dashboard
        amount: orderAmount * 100, // Amount is in currency subunits.
        currency: "INR",
        name: "ADK Mart", //your business name
        description: "Test Transaction",
        order_id: orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        handler: async function (response) {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: orderAmount,
            orderItems: cart,
            userId: userId,
            userShipping: address,
          };
        
          const api = await axios.post(
            `http://localhost:2002/api/payment/verify`,
            paymentData
          );
          
          // if order confirm
          if (api?.data?.success) {
            alert('Order Successful');
            confirmOrder();
            clearCart();
          }
          else{
            alert("Payment is Failed");
            return;
          }
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          name: address?.userFullName, //your customer's name
          email: "adarshkatiyar73@gmail.com",
          contact: address?.userPhone, //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzpl = new window.Razorpay(options);
      rzpl.open();
    } catch (error) {
      console.error("Payment Error..");
    }
  };

  return (
    <>
      {!userToken ? (
        <div className="relative w-[400px] h-screen bg-black-10 flex justify-center items-center flex-col p-10 gap-6">
          <p className="font-bold">Please Login first</p>
          <button
            onClick={openLogin}
            className="w-full bg-pink-500 rounded-xl pt-3 pb-3"
          >
            Login
          </button>
        </div>
      ) : (
        <>
          <div className="table-container min-h-screen w-[400px] flex">
            <div className="h-full bg-blue-300 w-[400px]  flex flex-col p-5 h-screen justify-between overflow-auto fixed top-0 right-0 bottom-0">
              
              
              {/* cart content and arrow */}
              <div className="flex items-center">
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                <h1 className="font-bold text-[24px]">Cart</h1>
              </div>

              {/* items */}
              <div>
                <h1 className="font-bold text-xl">Your items</h1>

                <div className="overflow-x-auto pt-5">
                  <table className="w-full">
                    {/* <thead>
                      <tr className="bg-gray-200 h-12 text-center">
                        <th className="w-[10%]">Image</th>
                        <th className=" w-[5%]">Items</th>
                        <th className=" w-[5%]">Quantity</th>
                        <th className="w-[5%]">Price</th>
                        <th className="w-[5%]">Remove</th>
                      </tr>
                    </thead> */}

                    <tbody className="max-h-[300px] overflow-auto">
                      {cart?.map((item, index) => (
                        <tr
                          key={index}
                          className="text-center  flex items-center justify-around"
                        >
                          <td className="imgContainer flex justify-center mb-1 mt-1">
                            <img
                              src={item.productImg}
                              alt="product Image"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          </td>
                          <td className="text-center">{item.productTitle}</td>
                          <td className="flex text-center items-center justify-center">
                            <button
                              className="pr-2 font-bold text-xl text-green-500"
                              onClick={(e) => addCart(e, item)}
                            >
                              +
                            </button>
                            {item.productQty}
                            <button
                              className="pl-2 font-bold text-2xl text-red-500"
                              onClick={() => decrease_qty(item.productId)}
                            >
                              -
                            </button>
                          </td>
                          <td className="text-center">₹{item.productPrice}</td>
                          <td className="text-center">
                            <button
                              onClick={() => delete_item(item.productId)}
                              className="text-red-600 text-center flex items-center justify-center"
                            >
                              <span class="material-symbols-outlined del">
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


              {/* //address */}
              <div>
                <h1 className="font-bold text-xl">Shipping Address</h1>
                {address.length > 0 ? (
                  address?.map((item, index) => (
                    <div key={index}>
                      <p className="text-gray-600">{item.userFullName}</p>
                      <p className="text-gray-600">{item.userAddress}</p>
                      <p className="text-gray-600">{item.userPhone}</p>
                    </div>
                  ))
                ) : (
                  <div>
                    <p>Address Not Found</p>
                  </div>
                )}
              </div>

              <div>Order Summary</div>


              {/* buttons */}
              <div className="gap-2 flex flex-col">
                <button
                  style={{ backgroundColor: "yellow" }}
                  className="hover:bg-blue-600 border-2 w-full font-bold rounded py-2"
                  onClick={openAddress}
                >
                  Add New Address
                </button>
                <button
                  style={{ backgroundColor: "#3498db" }}
                  className="hover:bg-blue-600 border-2 w-full font-bold rounded py-2"
                  onClick={handlePayment}
                >
                  {" "}
                  <p>
                    Proceed to Pay{" "}
                    <span className="text-red-600">{totalPrice}</span>
                  </p>
                </button>
              </div>


            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
