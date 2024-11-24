import axiosInstance from "../axiosInstance";

// 금주 일정 조회
export const getThisWeekSchedule = async () => {
  const response = await axiosInstance.post("/UAKRPCjN/WJsdDo", null,{
    headers: {
      "Content-Type": "application/json",
    },
  });
  const schedules = response.data.schedules;
  console.log("Schedule response:", schedules);
  return schedules;
};
