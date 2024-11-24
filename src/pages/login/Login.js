import React, { useState } from "react";
import Logo from "../../assets/logo/logo.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: sessionStorage.getItem("email")
      ? sessionStorage.getItem("email")
      : "", // sessionStorage에 email 값이 있으면 초기화
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /\S+@\S+\.\S+/;

    if (name === "email") {
      if (!value.trim()) {
        error = "이메일을 입력해주세요.";
      } else if (!emailRegex.test(value)) {
        error = "유효한 이메일 형식이 아닙니다.";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        error = "비밀번호를 입력해주세요.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateAll = () => {
    const newErrors = { email: "", password: "" };
    const emailRegex = /\S+@\S+\.\S+/;

    if (!credentials.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다.";
    }

    if (!credentials.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      navigate("/main");
    }
    const url = "/aB12Xz/LWyAtd";

    const user = JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    });

    const response = await axiosInstance.post(url, user, {
      headers: {
        "Content-Type": "application/json", // FormData 전송 시 Content-Type 지정
      },
    });
    console.log("loginResponse", response);

    const accessToken = response.data.accessToken;
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.removeItem("email");
      navigate("/main");
    } else {
      Swal.fire({
        title: "로그인 다시시도해주세요",
        icon: "error",
        timer: 1200, // 0.5초 후 자동 닫힘
        timerProgressBar: true,
        showConfirmButton: false,
        background: "linear-gradient(145deg, #f0f0f0, #e0e0e0)",
        position: "top",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-xl font-bold text-indigo-700",
          htmlContainer: "text-gray-100",
        },
      });
    }
  };

  const handleGoogleLogin = () => {
    // 구글 OAuth 로그인 로직 구현
    // 예시:
    // window.location.href = "구글 OAuth URL";

    navigate("/main");
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-white">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="logo" className="w-40" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-3 mb-4 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-6 h-6 mr-2"
          />
          Google로 로그인
        </button>
        <form onSubmit={handleLogin} noValidate>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={credentials.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 mb-2 border rounded focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex">
            {errors.email && (
              <p className="mb-2 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={credentials.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 mb-2 border rounded focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex">
            {errors.password && (
              <p className="mb-4 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 mb-4 text-white rounded bg-[#463198]
             hover:bg-[#2f216b] transition-all duration-150"
          >
            로그인
          </button>
        </form>
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/signup")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            회원가입
          </button>
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
