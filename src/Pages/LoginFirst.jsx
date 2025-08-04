import { useState } from "react";
import Userlogin from "../Components/User/Userlogin";
import { useNavigate, useLocation } from "react-router-dom";

const LoginFirst = () => {
  const [login, setLogin] = useState(false);
  // inside your Cart component
  const navigate = useNavigate();
  const location = useLocation();

  const openLogin = () => {
    const params = new URLSearchParams(location.search);
    params.set("login", "open");
    params.set("cart", "open");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <>
      {login ? (
        <div className="absolute left-[50%]" onClick={() => openLogin()}>
          <Userlogin />
        </div>
      ) : (
        <div className="fixed h-full w-[400px] flex flex-col justify-center items-center gap-5 right-0 top-0 bottom-0 bg-blue-300  p-10">
          <p className="font-bold">Please Login</p>
          <button
            className="bg-pink-700 w-full pt-3 pb-3 rounded-xl"
            onClick={() => setLogin(true)}
          >
            Login
          </button>
        </div>
      )}
    </>
  );
};

export default LoginFirst;
