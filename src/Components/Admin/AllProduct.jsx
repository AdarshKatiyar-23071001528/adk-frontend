import { useContext, useEffect, useState } from "react";
import AppContext from "../../Context/AppContext";
import "./AllProduct.css";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const AllProduct = () => {
  const { product } = useContext(AppContext);

  const [productList, setProductList] = useState([]);
  let navigate = useNavigate();


  useEffect(() => {
    setProductList(product);
  }, [product]);
  


  const del = async (id) => {
    const url = "/api/product/delete";
    await axios.delete(`${url}/${id}`);
    setProductList((pre) => pre.filter((item) => item._id !== id));
  };


  const updateItem = (id) => {
    navigate(`edit/${id}/`);
  };
  const addItem = () =>{
    navigate("addProduct/");
  }

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr style={{ height: "50px" }}>
              <th style={{ width: "10%" }}>Image</th>
              <th style={{ width: "25%" }}>Title</th>
              <th style={{ width: "15%" }}>Price</th>
              <th style={{ width: "15%" }}>Quantity</th>
              <th style={{ width: "25%" }}>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          {productList?.map((item) => (
            <tbody key={item._id}>
              <tr>
                <td className="imgContainer">
                  <img
                    src={item.productImg}
                    alt=""
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </td>
                <td>{item.productTitle}</td>
                <td>{item.productPrice}</td>
                <td>{item.productQty}</td>
                <td>{item.productCategory}</td>
                <td className="btnContainer">
                  <button onClick={() => updateItem(item._id)}>
                    <span class="material-symbols-outlined edit">edit</span>
                  </button>{" "}
                  <button onClick={() => del(item._id)}>
                    <span class="material-symbols-outlined del">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>

        <div className="btn-container">
          <button onClick={()=>addItem()}>Add More</button>
        </div>
      </div>
    </>
  );
};

export default AllProduct;
