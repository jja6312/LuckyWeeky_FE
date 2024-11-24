import axiosInstance from "../axiosInstance";

// 회원가입 요청
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/aB12Xz/RClmJ", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const email = response.data.email;
  sessionStorage.setItem("email",email);
  return email?true:false;
};
