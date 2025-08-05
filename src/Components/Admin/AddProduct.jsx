import React, { useEffect, useState } from "react";
import "./AddProduct.css";
<<<<<<< HEAD
import axios from '../axios';
=======
import axois from "../axios";
>>>>>>> b1426b7b961068bb24e6e37fa4227782010847f6
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const [formData, setFormData] = useState({
    productTitle: "",
    productPrice: "",
    productDesc: "",
    productCategory: "",
    productImg: "",
    productQty: "",
  });



  let navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const sendData = async () => {
    try {
      if (
        formData.productTitle === "" ||
        formData.productDesc == "" ||
        formData.productCategory === "" ||
        formData.productImg == "" ||
        formData.productPrice == "" ||
        formData.productQty == ""
      ){
        alert("Please Fill all field");
      }
      else {
        const url = "/api/product/add";
        await axios.post(`${url}`, formData);
        alert("product add successfully");
        navigate("/admin/home/products");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <>
      <div className="add-product-container">
        <div className="add-product">
          <div className="left_Part">
            <div className="pro_title">
              <span>Title :</span>
              <input
                type="text"
                name="productTitle"
                onChange={(e) => handleChange(e)}
                value={FormData.productTitle}
                required
                placeholder="Enter Product Title"
              />
            </div>
            <>
              <div className="pro_price">
                <span>Price :</span>
                <input
                  type="Number"
                  name="productPrice"
                  onChange={(e) => handleChange(e)}
                  value={FormData.productPrice}
                  required
                  placeholder="Enter Product price"
                />
              </div>

              <div className="pro_qty">
                <span>Quantity :</span>
                <input
                  type="Number"
                  name="productQty"
                  onChange={(e) => handleChange(e)}
                  value={FormData.productQty}
                  required
                  placeholder="Enter Product Qty"
                />
              </div>

              <div className="pro_category">
                <span>Categrory :</span>
                <input
                  type="text"
                  name="productCategory"
                  onChange={(e) => handleChange(e)}
                  value={FormData.productCategory}
                  required
                  placeholder="Enter Product category"
                />
              </div>
            </>

            <div className="pro_desc">
              <span>Description : </span>
              <textarea
                type="text"
                name="productDesc"
                onChange={(e) => handleChange(e)}
                value={FormData.Desc}
                required
                placeholder="Enter Product Description"
              />
            </div>
          </div>
          <div className="right_Part">
            <div className="img-Container">
              <div className="demo-Image">
                {formData.productImg ? (
                  <img src={formData.productImg} alt="Product Image" />
                ) : (
                  "+"
                )}
              </div>
            </div>

            <div className="pro_img">
              <span>Image :</span>
              <input
                type="text"
                name="productImg"
                onChange={(e) => handleChange(e)}
                value={FormData.productImg}
                required
                placeholder="Enter Image Url"
              />
            </div>

            <div className="btn-container">
              <button onClick={() => sendData()}>ADD</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
