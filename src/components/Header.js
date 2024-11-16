import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center py-2 px-4 bg-white shadow-md sticky top-0 z-10">
      <img
        src={Logo}
        alt="logo"
        className="h-12 md:h-20 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 text-[16px]  border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        로그인/회원가입
      </button>
    </div>
  );
};

export default Header;
