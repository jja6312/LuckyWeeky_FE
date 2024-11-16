import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(120);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer, step]);

  // 이메일 변경 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  // 인증번호 입력 핸들러
  const handleInputVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
    setError("");
  };

  // 새 비밀번호 변경 핸들러
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setError("");
  };

  // 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  // 인증번호 요청 핸들러
  const handleVerificationRequest = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 형식이 아닙니다.");
      return;
    }

    // 인증번호 발송 요청 처리 로직
    // 예시: 서버에서 랜덤한 인증번호 발송 후 상태 업데이트
    const generatedCode = "123456"; // 예시로 설정한 인증번호
    setVerificationCode(generatedCode);
    setStep(2);
    setTimer(120);
    setSuccessMessage("인증번호가 이메일로 전송되었습니다.");
  };

  // 인증번호 확인 핸들러
  const handleVerifyCode = () => {
    if (inputVerificationCode === verificationCode) {
      setIsCodeVerified(true);
      setError("");
      setSuccessMessage("인증번호가 확인되었습니다.");
    } else {
      setError("인증번호가 일치하지 않습니다.");
    }
  };

  // 비밀번호 재설정 요청 핸들러
  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (!isCodeVerified) {
      setError("인증번호를 먼저 확인해주세요.");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("새 비밀번호와 비밀번호 확인을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("비밀번호는 최소 8자, 문자와 숫자를 포함해야 합니다.");
      return;
    }

    // 비밀번호 재설정 요청 처리 로직
    setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 헤더 섹션 */}
      <Header />
      {/* 비밀번호 재설정 섹션 */}
      <div className="flex items-center justify-center flex-grow px-4 py-8">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">비밀번호 찾기</h2>

          {successMessage && step === 3 ? (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          ) : (
            <>
              {step === 1 ? (
                <form onSubmit={handleVerificationRequest} noValidate>
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="이메일"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500 text-left">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-white rounded bg-[#463198] hover:bg-[#2f216b] transition-colors duration-150"
                  >
                    인증번호 보내기
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordReset} noValidate>
                  <div className="mb-4">
                    {/* 이메일 입력 필드 (비활성화된 상태로 표시) */}
                    <input
                      type="email"
                      name="email"
                      value={email}
                      disabled
                      className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                    />
                  </div>
                  <div className="mb-2 flex items-center space-x-2">
                    <input
                      type="text"
                      name="verificationCode"
                      placeholder="인증번호"
                      value={inputVerificationCode}
                      onChange={handleInputVerificationCodeChange}
                      className={`flex-grow px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                        error && !isCodeVerified
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      className="px-4 py-2 text-white rounded bg-[#463198] hover:bg-[#2f216b] transition-colors duration-150"
                    >
                      확인
                    </button>
                  </div>
                  {timer > 0 && (
                    <p className="text-sm text-red-500 text-right mb-4">
                      인증 유효 시간 : {Math.floor(timer / 60)}분 {timer % 60}초
                    </p>
                  )}
                  <div className="mb-4">
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="비밀번호 확인"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-indigo-500 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500 text-left">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-white rounded bg-[#463198] hover:bg-[#2f216b] transition-colors duration-150"
                  >
                    비밀번호 재설정
                  </button>
                </form>
              )}
            </>
          )}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 mt-4 text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors duration-200"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
