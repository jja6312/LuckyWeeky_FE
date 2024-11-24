// src/api/scheduleAi/saveAiSchedule.js
import axiosInstance from "../axiosInstance";

export const saveAiSchedule = async (scheduleData) => {
  try {
    const response = await axiosInstance.post("/UAKRPCjN/BDSdE", scheduleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // 서버에서 반환된 결과
  } catch (error) {
    console.error("Failed to save AI schedule:", error);
    throw error;
  }
};
