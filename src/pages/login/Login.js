import React from "react";
import Logo from "../../assets/logo/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col justify-center items-center
     w-screen h-screen
      gap-7 bg-white md:gap-10
    pb-20
      "
    >
      <div className="w-1/2 md:w-1/3 flex justify-center">
        <img src={Logo} alt="logo" />
      </div>
      <div className="w-1/2 md:w-1/3 flex flex-col gap-4">
        {/* 구글로그인 */}
        <button
          className="flex justify-center items-center 
          w-full p-4 h-12 border-2 border-blue-500 text-blue-500 bg-white rounded-md
          hover:bg-blue-500 hover:text-white transition-all duration-200"
          onClick={() => {
            navigate("/");
          }}
        >
          Google Login
        </button>
      </div>
      {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
    </div>
  );
};

export default Login;
