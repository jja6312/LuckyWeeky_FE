import React, { useEffect, useState } from "react";
import useScheduleStore from "../stores/useScheduleStore";
import { format, addMinutes } from "date-fns";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

import SlideTitle from "./SlideTitle";
import useStore from "../stores/useStore";

const EditSchedule = () => {
  const {
    mainSchedules,
    subschedules,
    saveSubSchedule,
    setSelectedSchedule,
    addMainSchedule,
  } = useScheduleStore();
  const { setSelectedIcon, closeSidebar } = useStore();
  const selectedSchedule = useScheduleStore((state) => state.selectedSchedule);

  // 필터링된 메인 일정

  const [modalState, setModalState] = useState({
    mainScheduleTitle: selectedSchedule?.mainScheduleTitle || "기본일정",
    customInput: selectedSchedule?.customInput || "",
    subScheduleTitle: selectedSchedule?.subScheduleTitle || "",
    startTime: selectedSchedule?.start_time || new Date(),
    endTime: selectedSchedule?.end_time || addMinutes(new Date(), 30),
    color: selectedSchedule?.color || "#FF5733",
    description: selectedSchedule?.description || "",
    colorPickerVisible: false,
    showPastSchedules: true,
  });

  const filteredMainSchedules = mainSchedules.filter((mainSchedule) => {
    const relatedSubSchedules = subschedules.filter(
      (sub) => sub.mainScheduleTitle === mainSchedule.title
    );

    // 진행 중인지 여부 판단
    const isInProgress = relatedSubSchedules.some(
      (sub) => sub.end_time >= new Date()
    );

    if (modalState.showPastSchedules) {
      return true; // 모든 일정 표시
    }

    return isInProgress; // 진행 중인 일정만 표시
  });

  const handleSave = () => {
    const isCustomInput = modalState.mainScheduleTitle === "목표 추가";
    const scheduleToSave = {
      mainScheduleTitle: isCustomInput
        ? modalState.customInput
        : modalState.mainScheduleTitle,
      subScheduleTitle: modalState.subScheduleTitle,
      start_time: modalState.startTime,
      end_time: modalState.endTime,
      description: modalState.description,
      color: modalState.color,
      status: modalState.endTime < new Date() ? "지난 일정" : "진행중",
    };

    if (isCustomInput && modalState.customInput) {
      const newMainSchedule = {
        main_schedule_id: mainSchedules.length + 1,
        user_id: 101,
        title: modalState.customInput,
        start_time: modalState.startTime,
        end_time: modalState.endTime,
        color: modalState.color,
        created_at: new Date(),
        updated_at: new Date(),
      };

      addMainSchedule(newMainSchedule);
    }

    saveSubSchedule(scheduleToSave);
    setSelectedSchedule(scheduleToSave);
    console.log("저장 완료:", scheduleToSave);

    closeSidebar();
  };

  const updateModalState = (key, value) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  const formatLocalDateTime = (date) => {
    return format(date, "yyyy-MM-dd HH:mm");
  };

  useEffect(() => {
    // modalState
    console.log("modalState:", modalState);
  }, [modalState]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex w-full justify-between mb-3">
        <SlideTitle title="📋일정 수정" />
      </div>

      {/* 메인 일정 선택 */}
      <div className="mb-4 flex justify-between items-center">
        <select
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
          value={modalState.mainScheduleTitle}
          onChange={(e) =>
            updateModalState("mainScheduleTitle", e.target.value)
          }
        >
          <option value="기본일정">기본일정</option>
          {filteredMainSchedules.map((sched) => (
            <option key={sched.main_schedule_id} value={sched.title}>
              {sched.title}
            </option>
          ))}
        </select>

        {/* 지난 목표 보기 체크박스 */}
        <label className="flex items-center space-x-1 cursor-pointer ml-2">
          {modalState.showPastSchedules ? (
            <FaCheckSquare
              className="text-[#312a7a] cursor-pointer"
              onClick={() =>
                updateModalState(
                  "showPastSchedules",
                  !modalState.showPastSchedules
                )
              }
            />
          ) : (
            <FaRegSquare
              className="text-gray-400"
              onClick={() =>
                updateModalState(
                  "showPastSchedules",
                  !modalState.showPastSchedules
                )
              }
            />
          )}
          <span
            className="text-sm text-gray-700"
            onClick={() =>
              updateModalState(
                "showPastSchedules",
                !modalState.showPastSchedules
              )
            }
          >
            지난 목표 보기
          </span>
        </label>
      </div>

      {/* 제목 수정 */}
      <div className="mb-4 flex flex-col items-start">
        <label className="block text-sm text-gray-600 mb-1">제목</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
          value={modalState.subScheduleTitle}
          onChange={(e) => updateModalState("subScheduleTitle", e.target.value)}
        />
      </div>

      {/* 날짜 수정 */}
      <div className="mb-4 flex flex-col items-start">
        <label className="block text-sm text-gray-600 mb-1">시작 시간</label>
        <input
          type="datetime-local"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
          value={formatLocalDateTime(modalState.startTime)}
          onChange={(e) =>
            updateModalState("startTime", new Date(e.target.value))
          }
        />
        <label className="block text-sm text-gray-600 mb-1 mt-2">
          종료 시간
        </label>
        <input
          type="datetime-local"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
          value={formatLocalDateTime(modalState.endTime)}
          onChange={(e) =>
            updateModalState("endTime", new Date(e.target.value))
          }
        />
      </div>

      {/* 설명 수정 */}
      <div className="mb-4 flex flex-col items-start">
        <label className="block text-sm text-gray-600 mb-1">설명</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded focus:outline-none resize-none focus:ring-2 focus:ring-[#312a7a]"
          rows={12}
          value={modalState.description}
          onChange={(e) => updateModalState("description", e.target.value)}
        />
      </div>

      {/* 버튼 */}
      <div className="flex space-x-2 mt-4 w-full">
        <button
          className="w-1/3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400 transition duration-150"
          onClick={() => setSelectedIcon("detailSchedule")}
        >
          취소
        </button>
        <button
          className="w-2/3 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-500 transition duration-150"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default EditSchedule;
