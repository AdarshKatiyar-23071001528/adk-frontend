import axios from "../Components/axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import Geolocation from "./Geolocation";

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpenNewAddress, setIsOpenNewAddress] = useState(false);
  const [isCurrenLocation,setIsCurrentLocation] = useState(false);
  const { userToken } = useContext(AppContext);


  // for close address window from any where
  const closeAddress  =() =>{
    const currentParams = new URLSearchParams(location.search);
    currentParams.delete("shipping");
    navigate(`${location.pathname}?${currentParams.toString()}`);
    // forcely refresh for changes in cart address
    window.location.reload();
  }

  // for current locaion
 

  const [addressData, setAddressData] = useState({
    userFullName: "",
    userCity: "",
    userState: "",
    userAddress: "",
    userPhone: "",
    userPincode: "",
  });

  const setData = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchAllAddress = async () => {
      try {
        const res = await axios.get("/api/address/allAddress", {
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          withCredentials: true,
        });
        console.log(res);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAllAddress();
  }, []);

  const addAddress = async () => {
    try {
      const res = await axios.post(
        "/api/address/add",
        addressData,
        {
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          withCredentials: true,
        }
      );
      const latestIndex = res?.data?.address?.fullAddress?.length - 1;
      localStorage.setItem(
        "latestAdd",
        res.data.address.fullAddress[latestIndex]._id
      );

    } catch (error) {
      console.error(error.message);
    }
    closeAddress();
  };

  return (
    <div className="flex  h-full w-full bg-gray-100 rounded-xl">
      <div className="w-full h-full border rounded-xl shadow-md p-4 flex flex-col justify-between gap-4 bg-white">
        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            onClick={() => {alert("Fetching current location..."); setIsCurrentLocation(true)}}
          >
            Use Current Location
          </button>
          <button
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
            onClick={() => setIsOpenNewAddress(true)}
          >
            Add New Address
          </button>
        </div>

        {/* Form */}
        {isOpenNewAddress && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addAddress();
            }}
            className="overflow-y-auto h-full mt-4"
          >
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="userFullName"
                value={addressData.userFullName}
                onChange={setData}
                placeholder="Full Name"
                required
                className="p-2 border rounded-md"
              />
              <input
                type="tel"
                name="userPhone"
                value={addressData.userPhone}
                onChange={setData}
                placeholder="Phone Number"
                required
                className="p-2 border rounded-md"
              />
              <textarea
                name="userAddress"
                value={addressData.userAddress}
                onChange={setData}
                placeholder="Address"
                rows="2"
                required
                className="p-2 border rounded-md resize-none"
              ></textarea>
              <input
                type="text"
                name="userCity"
                value={addressData.userCity}
                onChange={setData}
                placeholder="City"
                required
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="userState"
                value={addressData.userState}
                onChange={setData}
                placeholder="State"
                required
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="userPincode"
                value={addressData.userPincode}
                onChange={setData}
                placeholder="Pincode"
                required
                className="p-2 border rounded-md"
              />
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mr-2"
                  id="agree"
                />
                <label htmlFor="agree" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {
          isCurrenLocation && (<Geolocation/>)
        }

      </div>
    </div>
  );
};

export default Address;
