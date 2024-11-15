import React, { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo/logo.png";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/defaultProfile.png"; // 기본 프로필 이미지 추가

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(defaultProfile);

  // 이미지 미리보기 관리
  useEffect(() => {
    if (formData.profileImage) {
      const objectUrl = URL.createObjectURL(formData.profileImage);
      setPreview(objectUrl);

      // 메모리 누수 방지를 위해 정리 함수 추가
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(defaultProfile);
    }
  }, [formData.profileImage]);

  // 입력 필드 유효성 검사
  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (name === "name") {
      if (!value.trim()) {
        error = "이름을 입력해주세요.";
      }
    }

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
      } else if (!passwordRegex.test(value)) {
        error = "비밀번호는 최소 8자, 문자와 숫자를 포함해야 합니다.";
      } else if (
        formData.confirmPassword &&
        value !== formData.confirmPassword
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "비밀번호가 일치하지 않습니다.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "",
        }));
      }
    }

    if (name === "confirmPassword") {
      if (!value.trim()) {
        error = "비밀번호 확인을 입력해주세요.";
      } else if (value !== formData.password) {
        error = "비밀번호가 일치하지 않습니다.";
      }
    }

    if (name === "birthDate") {
      if (!value.trim()) {
        error = "생년월일을 입력해주세요.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      if (files && files[0]) {
        setFormData((prevData) => ({ ...prevData, profileImage: files[0] }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // 전체 유효성 검사
  const validateAll = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
    };
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "비밀번호는 최소 8자, 문자와 숫자를 포함해야 합니다.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = "생년월일을 입력해주세요.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  // 회원가입 제출 핸들러
  const handleSignup = (e) => {
    e.preventDefault();
    if (validateAll()) {
      navigate("/login");
    }
  };

  // 구글 OAuth 회원가입 핸들러
  const handleGoogleSignup = () => {
    navigate("/main");
  };

  // 프로필 이미지 클릭 시 파일 선택 창 열기
  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {/* 로고 및 프로필 이미지 */}
        <div className="flex flex-col items-center mb-4">
          <img src={Logo} alt="logo" className="w-32 mb-4" />
          <div className="relative cursor-pointer" onClick={handleProfileClick}>
            <img
              src={preview}
              alt="프로필 이미지"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300
              hover:opacity-70 transition-opacity duration-150"
            />
            <div className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3a2 2 0 012-2h8a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V3z" />
              </svg>
            </div>
            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>

        {/* 구글로 회원가입 버튼 */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full py-2 mb-4 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Google로 회원가입
        </button>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSignup} noValidate>
          {/* 이름 입력 */}
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 text-left">
                {errors.name}
              </p>
            )}
          </div>

          {/* 이메일 입력 */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 text-left">
                {errors.email}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 text-left">
                {errors.password}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500 text-left">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* 생년월일 입력 */}
          <div className="mb-3">
            <input
              type="date"
              name="birthDate"
              placeholder="생년월일"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                errors.birthDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-500 text-left">
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full py-2 text-white rounded bg-[#463198]
                     hover:bg-[#2f216b] transition-colors duration-150"
          >
            회원가입
          </button>
        </form>

        {/* 취소 버튼 */}
        <button
          onClick={() => navigate("/login")}
          className="w-full py-2 mt-2 text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors duration-200"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default Signup;
