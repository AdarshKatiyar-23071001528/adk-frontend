import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/AppContext";
import axios from "../Components/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShowProduct from "../Components/Product/ShowProduct";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    userToken,
    setCartLength,
    userId,
    setUserId,
    setCartItems,
    cartItems,
  } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState([]);
  const latestAddress = localStorage.getItem("userAddress");
  const currentUrl = new URLSearchParams(location.search);

  // for item quantity
  const [qty, setQty] = useState();

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

  const confirmOrder = () => {
    const fetchAddress = new URLSearchParams(location.search);
    fetchAddress.set("orderconfirm", "open");
    navigate(`${location.pathname}?${fetchAddress.toString()}`);
  };

  const closeCart = () => {
    const fetchUrl = new URLSearchParams(location.search);
    fetchUrl.delete("cart");
    navigate(`${location.pathname}?${fetchUrl.toString()}`);
  };

  // add cart
  const addCart = async (item) => {
    const prevCart = [...cart];

    // frontend update
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.productId === item.productId
          ? {
              ...i,
              productQty: i.productQty + 1,
              productPrice: i.productPrice + item.productPrice / i.productQty,
            }
          : i
      )
    );

    const {
      productId,
      productPrice,
      productTitle,
      productImg,
      productCategory,
    } = item;
    try {
      const res = await axios.post(
        "/api/cart/add",
        {
          productId,
          productQty: 1,
          productPrice,
          productTitle,
          productImg,
          productCategory,
        },
        {
          headers: {
            "Content-Type": "Application/json",
            userToken: userToken,
          },
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (err) {
      setCart(prevCart);
    }
  };

  const decrease_qty = async (id) => {
    const prevCart = [...cart];

    // frontend update
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.productId === id
          ? {
              ...i,
              productQty: Math.max(i.productQty - 1, 0),
              productPrice:
                (i.productPrice / i.productQty) * (i.productQty - 1),
            }
          : i
      )
    );

    try {
      await axios.get(`/api/cart/decreaseQty/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          userToken: userToken,
        },
        withCredentials: true,
      });
      fetchCart();
    } catch (error) {
      console.error("Decrease Error : ", error.message);
      setCart(prevCart);
    }
  };

  const delete_item = async (id) => {
    try {
      const res = await axios.delete(`/api/cart/delete/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          userToken: userToken,
        },
        withCredentials: true,
      });
      alert(res.data.message);
      fetchCart();
    } catch (error) {
      console.error("error : ", error.message);
    }
  };
  const fetchCart = async () => {
    if (!userToken) return;
    try {
      const res = await axios.get("/api/cart/show", {
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
    await axios.delete("/api/cart/clear", {
      headers: {
        "Content-Type": "Application/json",
        userToken,
      },
      withCredentials: true,
    });
  };

  useEffect(() => {
    fetchCart();
  }, [userToken,cartItems]);

  // fetch saved latest address from userid and store it on address
  useEffect(() => {
    const fetchAddress = async () => {
      if (!userToken) return;
      try {
        const res = await axios.get("/api/address/allAddress", {
          headers: {
            "Content-Type": "Application/json",
            userToken,
          },
          withCredentialsL: true,
        });

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
          `/api/address/specificAddress/${latestAddress}`,
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
      const orderResponse = await axios.post(`/api/payment/checkout`, {
        amount: totalPrice,
        cartItems: cart,
        userShipping: address,
        userId: userId,
      });
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

          const api = await axios.post(`/api/payment/verify`, paymentData);

          // if order confirm
          if (api?.data?.success) {
            alert("Order Successful");
            confirmOrder();
            clearCart();
          } else {
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

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");

  setCartItems(cart);
  return (
    <>
      {!userToken ? (
        <div className="relative w-full h-screen bg-black-10 flex items-center justify-center flex-col p-10 gap-6 overflow-hidden">
          <div
            className="flex items-center absolute top-4  w-full  pl-5"
            onClick={closeCart}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <h1 className="font-bold text-[16px] md:text-[24px]">Cart</h1>
          </div>

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
          <div className=" h-full w-full flex">
            <div className="h-full bg-blue-300 w-full  flex flex-col p-5  justify-between  fixed top-0 left-0 ">
              {/* cart content and arrow */}

              <div className="flex items-center" onClick={closeCart}>
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                <h1 className="font-bold text-[16px] md:text-[24px]">Cart</h1>
              </div>

              {/* items */}
              <div>
                <h1 className="font-bold text-xl">Your items</h1>

                <div className="overflow-x-auto max-h-[150px] md:max-h-[200px] overflow-y-auto w-full">
                  {cart.length < 1 && (
                    <div className="text-center w-full  flex justify-center items-center flex-col ">
                      <p className="font-bold text-xl text-red-500">
                        Cart is Empty
                      </p>
                      <button
                        className="border p-2 bg-blue-400 rounded-xl mt-2"
                        onClick={closeCart}
                      >
                        Add Items
                      </button>
                    </div>
                  )}

                  <table className="table-fixed w-full border-collapse text-sm">
                    <tbody>
                      {cart?.map((item, index) => (
                        <tr className="text-center border-b">
                          <td
                            className="w-[20%] p-2 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/product/${slugify(item.productTitle)}/${
                                  item.productCategory
                                }/${item.productId}`
                              )
                            }
                          >
                            <img
                              src={item.productImg}
                              alt="product"
                              className="w-10 h-10 object-cover rounded mx-auto"
                            />
                          </td>

                          <td
                            className="w-[25%] p-2 truncate cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/product/${slugify(item.productTitle)}/${
                                  item.productCategory
                                }/${item.productId}`
                              )
                            }
                          >
                            {item.productTitle}
                          </td>

                          <td className="w-[25%] p-2">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="font-bold text-xl text-green-500"
                                onClick={() => addCart(item)}
                              >
                                +
                              </button>
                              <span>{item.productQty}</span>
                              <button
                                className="font-bold text-2xl text-red-500"
                                onClick={() => decrease_qty(item.productId)}
                              >
                                -
                              </button>
                            </div>
                          </td>

                          <td
                            className="w-[25%] p-2 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/product/${slugify(item.productTitle)}/${
                                  item.productCategory
                                }/${item.productId}`
                              )
                            }
                          >
                            ₹{item.productPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clearification of payment  */}

              {cart.length >= 1 && (
                <div className="w-full">
                  <h1 className="font-bold text-[13px] md:text-xl">Estimate</h1>
                  <p className="w-full flex justify-between items-center text-gray-500 text-[13px] md:text-[16px]">
                    <span>Items</span>
                    <span>{totalQty}</span>
                    <span>₹{totalPrice}.00</span>
                  </p>
                  <p className="w-full flex justify-between items-center text-gray-500 text-[13px] md:text-[16px]">
                    <span>Delivery</span>
                    <span>₹00.00</span>
                  </p>
                </div>
              )}

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

              {/* <div>Order Summary</div> */}

              {/* buttons */}
              <div className="gap-2 flex flex-col pd-12 md:pb-0">
                <button
                  style={{ backgroundColor: "yellow" }}
                  className="hover:bg-blue-600  w-full font-bold rounded py-2"
                  onClick={openAddress}
                >
                  Add New Address
                </button>
                <button
                  style={{ backgroundColor: "#3498db" }}
                  className="hover:bg-blue-600  w-full font-bold rounded py-2"
                  onClick={handlePayment}
                >
                  {" "}
                  <p>
                    Proceed to Pay{" "}
                    <span className="text-red-600">₹{totalPrice}</span>
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
