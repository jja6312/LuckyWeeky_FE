import axiosInstance from "../axiosInstance";

export const handleRecording = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append("audioFile", audioBlob);
    formData.append("language", "Kor"); // Clova API가 요구하는 언어 설정

    console.log("audioFile:", audioBlob);

    const response = await axiosInstance.post("/stt", formData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    console.log("STT response:", response.data);
    return response.data.text; // 서버에서 변환된 텍스트 반환
  } catch (error) {
    console.error("STT failed:", error);
    alert("음성 인식 실패: 다시 시도해주세요."); // 사용자에게 에러 표시
  }
};
