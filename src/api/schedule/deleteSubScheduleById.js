import axiosInstance from "../axiosInstance";

export const deleteSubScheduleById = (subScheduleTitle) => {
  try {
    axiosInstance
      .post("/UAKRPCjN/SHVLC", {
        subScheduleTitle,
      })
      .then((response) => {
        console.log("deleteSubScheduleById response:", response.data);
      });
  } catch (error) {
    console.error("Failed to delete sub schedule:", error);
    alert("서브 일정 삭제 실패: 다시 시도해주세요.");
    throw error;
  }
};
