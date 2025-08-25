import React, { use, useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "../Components/axios";

const AppState = (props) => {
  const url = "/api";
  const [product, setProduct] = useState([]);
  const [viewId, setViewId] = useState();
  const [specificProduct, setSpecificProduct] = useState([]);
  const [userToken, setUserToken] = useState(null);
  let [filterProduct, setFilterProduct] = useState([]);
  let [isAuthenticate, setIsAuthenticate] = useState(false);
  const [cartLength, setCartLength] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // for admin
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      const findUser = await axios.get(
        "/api/user/allUser"
      );

      setUsers(findUser?.data?.users);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const api = await axios.get(`${url}/product/all`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setProduct(api.data.product);
        setFilterProduct(api.data.product);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserToken(token);
      setIsAuthenticate(true);
    }
  }, []);
  // useEffect(()=>{
  //   const getData = async() =>{
  //     const api = 'https://dummyjson.com/users';
  //     const data = await fetch(api);
  //     const users = await data.json();
  //     console.log(users);
  //   }
  //   getData();
  // },[])

  useEffect(() => {
    const getSpecificProduct = async () => {
      try {
        const api = await axios.get(
          `${url}/product/specificProduct/${viewId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSpecificProduct(api.data.product);
      } catch (error) {
        console.log(error.message);
      }
    };
    getSpecificProduct();
  }, [viewId]);

  return (
    <AppContext.Provider
      value={{
        cartLength,
        setCartLength,
        product,
        setViewId,
        specificProduct,
        userToken,
        setUserToken,
        filterProduct,
        setProduct,
        setFilterProduct,
        userId,
        setUserId,
        users,
        setUsers,
        cartItems,
        setCartItems,
      
  
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
