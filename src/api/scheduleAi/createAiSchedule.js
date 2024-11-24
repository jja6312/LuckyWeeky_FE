import axiosInstance from "../axiosInstance";

// 일정 생성 요청
export const createAiSchedule = async (scheduleData) => {
  try {
    const response = await axiosInstance.post("/qwDioSA/SmdBid", scheduleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Schedule response:", response.data);
    return response.data.schedule; // 서버에서 반환된 AI 생성 결과 반환
  } catch (error) {
    console.error("Failed to create schedule:", error);
    alert("일정 생성 실패:다시 시도해주세요.");
    throw error;
  }
};
