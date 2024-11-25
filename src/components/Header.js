import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo/logo.png";
import { logoutUser } from "../api/user/logoutUser";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보를 가져옴

  const handleButtonClick = async () => {
    if (location.pathname === "/main") {
      // 로그아웃 로직
      const result = await logoutUser();
      alert("로그아웃되었습니다."); // 로그아웃 처리 로직 추가
      navigate("/"); // 로그아웃 후 메인 페이지로 이동
    } else {
      navigate("/login"); // 로그인/회원가입 페이지로 이동
    }
  };

  return (
    <div className="flex justify-between items-center px-4 bg-white shadow-md sticky top-0 z-30">
      <img
        src={Logo}
        alt="logo"
        className="h-12 md:h-16 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 text-[16px] border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {location.pathname === "/main" ? "로그아웃" : "로그인/회원가입"}
      </button>
    </div>
  );
};

export default Header;
