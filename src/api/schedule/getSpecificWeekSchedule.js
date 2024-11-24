import axiosInstance from "../axiosInstance";

// 특정 주차 일정 조회
export const getSpecificWeekSchedule = async (date) => {
  const response = await axiosInstance.post("/UAKRPCjN/WJsdDo", date, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const schedules = response.data.schedules;
  console.log("Schedule response:", schedules);
  return schedules;
};
