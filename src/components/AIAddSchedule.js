import React, { useState } from "react";
import useScheduleStore from "../stores/useScheduleStore";
import { format, addDays } from "date-fns";
import SlideTitle from "./SlideTitle";
import useStore from "../stores/useStore";

const AIAddSchedule = () => {
  const today = new Date();
  const oneWeekLater = addDays(today, 7);
  const { setSelectedIcon } = useStore();

  const [formData, setFormData] = useState({
    startDateTime: format(today, "yyyy-MM-dd'T'HH:mm"),
    endDateTime: format(oneWeekLater, "yyyy-MM-dd'T'HH:mm"),
    task: "",
    availableTime: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({
    startDateTime: "",
    endDateTime: "",
    task: "",
    availableTime: "",
  });

  // 입력 필드 변경 핸들러
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    validateField(key, value);
  };

  // 필드별 유효성 검사
  const validateField = (key, value) => {
    let error = "";

    if (key === "startDateTime" && !value.trim()) {
      error = "시작 시간을 입력해주세요.";
    }

    if (key === "endDateTime") {
      if (!value.trim()) {
        error = "종료 시간을 입력해주세요.";
      } else if (new Date(value) <= new Date(formData.startDateTime)) {
        error = "종료 시간은 시작 시간보다 나중이어야 합니다.";
      }
    }

    if (key === "task" && !value.trim()) {
      error = "해야 할 일을 입력해주세요.";
    }

    if (key === "availableTime" && !value.trim()) {
      error = "수행 가능 시간을 입력해주세요.";
    }

    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  // 전체 유효성 검사
  const validateAll = () => {
    const newErrors = {
      startDateTime: "",
      endDateTime: "",
      task: "",
      availableTime: "",
    };

    if (!formData.startDateTime.trim()) {
      newErrors.startDateTime = "시작 시간을 입력해주세요.";
    }

    if (!formData.endDateTime.trim()) {
      newErrors.endDateTime = "종료 시간을 입력해주세요.";
    } else if (
      new Date(formData.endDateTime) <= new Date(formData.startDateTime)
    ) {
      newErrors.endDateTime = "종료 시간은 시작 시간보다 나중이어야 합니다.";
    }

    if (!formData.task.trim()) {
      newErrors.task = "해야 할 일을 입력해주세요.";
    }

    if (!formData.availableTime.trim()) {
      newErrors.availableTime = "수행 가능 시간을 입력해주세요.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    if (!validateAll()) {
      return;
    }

    // const newSchedule = {
    //   title: formData.task,
    //   start_time: new Date(formData.startDateTime),
    //   end_time: new Date(formData.endDateTime),
    //   available_time: formData.availableTime,
    //   color: "#FF5733", // 기본 색상
    // };

    // setFormData({
    //   startDateTime: format(today, "yyyy-MM-dd'T'HH:mm"),
    //   endDateTime: format(oneWeekLater, "yyyy-MM-dd'T'HH:mm"),
    //   task: "",
    //   availableTime: "",
    //   additionalNotes: "",
    // });

    setSelectedIcon("detailSchedule");
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <div className="flex w-full justify-between mb-3">
        <SlideTitle title="🤖AI 일정 추가" />
      </div>

      {/* 시작 날짜와 종료 날짜 */}
      <div className="mb-3">
        <div className="flex flex-col space-y-2">
          <div className="w-full">
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
              value={formData.startDateTime}
              onChange={(e) =>
                handleInputChange("startDateTime", e.target.value)
              }
            />
            {errors.startDateTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDateTime}
              </p>
            )}
          </div>
          <div className="w-full">
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
              value={formData.endDateTime}
              onChange={(e) => handleInputChange("endDateTime", e.target.value)}
            />
            {errors.endDateTime && (
              <p className="mt-1 text-sm text-red-500">{errors.endDateTime}</p>
            )}
          </div>
        </div>
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
          value={formData.task}
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
          value={formData.availableTime}
          onChange={(e) => handleInputChange("availableTime", e.target.value)}
        />
        {errors.availableTime && (
          <p className="mt-1 text-sm text-red-500">{errors.availableTime}</p>
        )}
      </div>

      {/* 추가 요구 사항 */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
          추가 요구 사항
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          placeholder="추가 요청 사항을 입력하세요."
          value={formData.additionalNotes}
          onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
        />
      </div>

      {/* 제출 버튼 */}
      <button
        className="w-full bg-[#312a7a] text-white rounded p-2 hover:opacity-80 transition"
        onClick={handleSubmit}
      >
        분석 시작
      </button>
    </div>
  );
};

export default AIAddSchedule;
