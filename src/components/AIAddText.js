import React, { useEffect } from "react";
import useAiInputStore from "../stores/useAiInputStore";
import { handleAnalysis } from "../function/ai/handleAnalysis";
import useStore from "../stores/useStore";

const AIAddText = () => {
  // Zustand stores에서 필요한 상태와 메서드 가져오기
  const {
    formData = {},
    errors = {},
    setField,
    validateAll,
    resetForm,
  } = useAiInputStore();
  const { setSelectedIcon } = useStore();

  // 디버깅용 useEffect: formData 초기화 상태 확인
  useEffect(() => {
    if (!formData.startDateTime || !formData.endDateTime) {
      console.warn("formData is not fully initialized. Check Zustand store.");
    }
  }, [formData]);

  // 입력 필드 값 변경 핸들러
  const handleInputChange = (key, value) => {
    setField(key, value); // Zustand store의 setField 메서드 호출
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      {/* 시작 시간 */}
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1 text-left">
          시작 시간
        </label>
        <input
          type="datetime-local"
          className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 ${
            errors.startDateTime
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          value={formData.startDateTime || ""}
          onChange={(e) => handleInputChange("startDateTime", e.target.value)}
        />
        {errors.startDateTime && (
          <p className="mt-1 text-sm text-red-500">{errors.startDateTime}</p>
        )}
      </div>

      {/* 종료 시간 */}
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1 text-left">
          종료 시간
        </label>
        <input
          type="datetime-local"
          className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 ${
            errors.endDateTime
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          value={formData.endDateTime || ""}
          onChange={(e) => handleInputChange("endDateTime", e.target.value)}
        />
        {errors.endDateTime && (
          <p className="mt-1 text-sm text-red-500">{errors.endDateTime}</p>
        )}
      </div>

      {/* 해야 할 일 */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
          해야 할 일
        </label>
        <input
          type="text"
          className={`w-full border rounded p-2 focus:outline-none focus:ring-2 ${
            errors.task
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="예시) 헬스장 가기"
          value={formData.task || ""}
          onChange={(e) => handleInputChange("task", e.target.value)}
        />
        {errors.task && (
          <p className="mt-1 text-sm text-red-500">{errors.task}</p>
        )}
      </div>

      {/* 수행 가능 시간 */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
          수행 가능 시간
        </label>
        <input
          type="text"
          className={`w-full border rounded p-2 focus:outline-none focus:ring-2 ${
            errors.availableTime
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="예시) 매일 2시간"
          value={formData.availableTime || ""}
          onChange={(e) => handleInputChange("availableTime", e.target.value)}
        />
        {errors.availableTime && (
          <p className="mt-1 text-sm text-red-500">{errors.availableTime}</p>
        )}
      </div>

      {/* 추가 요청 사항 */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
          추가 요청 사항
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          placeholder="추가 요청 사항을 입력하세요."
          value={formData.additionalNotes || ""}
          onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
        />
      </div>

      {/* 제출 버튼 */}
      <button
        className="w-full bg-[#312a7a] text-white rounded p-2 hover:opacity-80 transition"
        onClick={() => {
          handleAnalysis({ formData, validateAll, resetForm, setSelectedIcon });
        }}
      >
        분석 시작
      </button>
    </div>
  );
};

export default AIAddText;
