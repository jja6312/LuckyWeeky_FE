import axiosInstance from "../axiosInstance";

// 로그아웃
export const logoutUser = async () => {
  const response = await axiosInstance.post("/aB12Xz/odsQk", null, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  sessionStorage.removeItem("accessToken");
  return response.data.result;
};
