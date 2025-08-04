import React, { useEffect, useState } from "react";

const Geolocation = () => {
  const [locaion, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [err, setErr] = useState(null);
  const [address,setAddress] = useState('');

  useEffect(() => {
    const handleGetLocation = () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const long = position.coords.longitude;
              setLocation({latitude:lat,longitude:long});
              getAddressfromCoords(lat,long);
            },
            (err) => setErr("Location access Denied or not available")
          );
        } else {
          setErr("Geolocation is not supported by this browser");
        }
      } catch (error) {
        setErr("GeoLocation Error", error.message);
      }
    };
    handleGetLocation();
  }, []);

  const getAddressfromCoords = async(lat,long) =>{
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`);
        const data = await res.json();
        console.log(data);
        if(data && data.display_name) {
            setAddress(data.display_name);
        }
        else{
            setErr("Address not found")
        }
    } catch (error) {
        setErr('fetching error');
    }
  };
  return (
    <>
      <div>
        <p>
          {locaion.latitude},{locaion.longitude}
        </p>
        <h1>{address ? address : 'not found'}</h1>
      </div>
    </>
  );
};

export default Geolocation;
