// src/api/schedules/getSchedulesByDate.js
import axiosInstance from "../axiosInstance";

export const getSchedulesByDate = async (date) => {
  try {
    const response = await axiosInstance.post(
      "/UAKRPCjN/lCSZB",
      { date },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.schedules; // API에서 반환된 일정 데이터
  } catch (error) {
    console.error("일정 조회 실패:", error);
    throw error;
  }
};
