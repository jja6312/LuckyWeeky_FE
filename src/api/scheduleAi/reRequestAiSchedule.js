import axiosInstance from "../axiosInstance";

// 일정 재요청 API
export const reRequestAiSchedule = async (reRequestData) => {
  try {
    const response = await axiosInstance.post(
      "/qwDioSA/LdslbEd",
      reRequestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Re-request response:", response.data);
    return response.data.schedule; // 서버에서 반환된 AI 재생성 결과 반환
  } catch (error) {
    console.error("Failed to re-request schedule:", error);
    alert("재요청 실패: 다시 시도해주세요.");
    throw error;
  }
};
