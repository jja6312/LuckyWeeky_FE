export const handleAnalysis = ({ formData, validateAll, resetForm }) => {
  if (!validateAll()) {
    return;
  }

  alert(`AI 일정이 추가되었습니다! 🎉\n
      시작 시간: ${formData.startDateTime}\n
      종료 시간: ${formData.endDateTime}\n
      해야 할 일: ${formData.task}\n
      수행 가능 시간: ${formData.availableTime}\n
      추가 요청 사항: ${formData.additionalNotes}
    `);

  resetForm();
};
