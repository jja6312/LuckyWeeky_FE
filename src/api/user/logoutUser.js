import axiosInstance from "../axiosInstance";

// 로그아웃
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
