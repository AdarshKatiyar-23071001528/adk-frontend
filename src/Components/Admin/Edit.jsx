import axios from "../axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    productTitle: "",
    productPrice: "",
    productDesc: "",
    productCategory: "",
    productImg: "",
    productQty: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/api/product/specificProduct/${id}`);
      setProduct(res.data.product);

      // 👇 FormData ko product se set karo jab data aaye
      setFormData({
        productTitle: res.data.product.productTitle || "",
        productPrice: res.data.product.productPrice || "",
        productDesc: res.data.product.productDesc || "",
        productCategory: res.data.product.productCategory || "",
        productImg: res.data.product.productImg || "",
        productQty: res.data.product.productQty || "",
      });
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateData = async () => {
    try {
      if (
        formData.productTitle === "" ||
        formData.productDesc == "" ||
        formData.productCategory === "" ||
        formData.productImg == "" ||
        formData.productPrice == "" ||
        formData.productQty == ""
      ) {
        alert("Please Fill all field");
      } else {
        const url = "/api/product/update";
        await axios.put(`${url}/${id}`, formData);
        alert("Product updated successfully");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product">
        <div className="left_Part">
          <div className="pro_title">
            <span>Title :</span>
            <input
              type="text"
              name="productTitle"
              onChange={handleChange}
              value={formData.productTitle}
              required
              placeholder="Enter Product Title"
            />
          </div>

          <div className="pro_price">
            <span>Price :</span>
            <input
              type="number"
              name="productPrice"
              onChange={handleChange}
              value={formData.productPrice}
              required
              placeholder="Enter Product price"
            />
          </div>

          <div className="pro_qty">
            <span>Quantity :</span>
            <input
              type="number"
              name="productQty"
              onChange={handleChange}
              value={formData.productQty}
              required
              placeholder="Enter Product Qty"
            />
          </div>

          <div className="pro_category">
            <span>Category :</span>
            <input
              type="text"
              name="productCategory"
              onChange={handleChange}
              value={formData.productCategory}
              required
              placeholder="Enter Product category"
            />
          </div>

          <div className="pro_desc">
            <span>Description : </span>
            <textarea
              name="productDesc"
              onChange={handleChange}
              value={formData.productDesc}
              required
              placeholder="Enter Product Description"
            />
          </div>
        </div>

        <div className="right_Part">
          <div className="img-Container">
            <div className="demo-Image">
              {formData.productImg ? (
                <img src={formData.productImg} alt="Product" />
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
              onChange={handleChange}
              value={formData.productImg}
              required
              placeholder="Enter Image Url"
            />
          </div>

          <div className="btn-container">
            <button onClick={updateData}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
