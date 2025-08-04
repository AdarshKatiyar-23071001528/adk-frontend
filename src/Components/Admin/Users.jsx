import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import AppContext from "../../Context/AppContext";

const Users = () => {
  
  const {users, setUsers} = useContext(AppContext);
 

  console.log(users);

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr style={{ height: "50px" }}>
              <th style={{ width: "10%" }}>Image</th>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "25%" }}>Email</th>
              <th style={{ width: "25%" }}>Register Date</th>
              <th style={{ width: "15%" }}> Order</th>
            </tr>
          </thead>
          {users?.map((user) => (
            <tbody key={user._id}>
              <tr>
                <td className="imgContainer">
                  <img
                    src={user.profileImg}
                    alt=""
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </td>
                <td>{user.userName}</td>
                <td>{user.userEmail}</td>
                <td>{user.createdAt}</td>
                <th>00</th>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
};

export default Users;
