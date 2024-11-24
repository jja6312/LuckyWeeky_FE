import axiosInstance from "../axiosInstance";

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/aB12Xz/RClmJ", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    const email = response.data.email;
    sessionStorage.setItem("email", email);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
