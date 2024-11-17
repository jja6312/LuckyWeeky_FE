import React, { useState } from "react";
import useScheduleStore from "../stores/useScheduleStore";
import { format, parse, addMinutes, subMinutes } from "date-fns";

import { FaEdit } from "react-icons/fa";
import SlideTitle from "./SlideTitle";
import useStore from "../stores/useStore";

const DetailSchedule = () => {
  const { setSelectedIcon } = useStore();
  const { subschedules } = useScheduleStore();
  const selectedSchedule = useScheduleStore((state) => state.selectedSchedule);
  const mainSchedules = useScheduleStore((state) => state.mainSchedules);

  // 상태를 객체로 묶기
  const [modalState, setModalState] = useState({
    mainScheduleTitle: "기본일정",
    customInput: "",
    subScheduleTitle: "",
    startTime: selectedSchedule?.start_time || new Date(),
    endTime: selectedSchedule?.end_time || addMinutes(new Date(), 30),
    color: selectedSchedule?.color || "#FF5733",
    description: "",
    colorPickerVisible: false,
    showPastSchedules: true,
  });

  const formatLocalDateTime = (date) => {
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // 상태 업데이트 함수
  const updateModalState = (key, value) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  // 필터링된 메인 일정
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

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {selectedSchedule === null ? (
        <p className="text-gray-800 text-center">일정을 선택해주세요.</p>
      ) : (
        <>
          {/* Main Schedule Title */}
          <div className="flex w-full justify-between mb-3">
            <SlideTitle title="📋상세 일정" />
            <FaEdit
              className="text-2xl text-[#463198] cursor-pointer hover:opacity-60 transition-all duration-150"
              onClick={() => setSelectedIcon("editSchedule")}
            />
          </div>
          {/* <div className="flex">
            <span className="block text-sm text-gray-600 mb-1">목표</span>
          </div> */}
          <div className="mb-4 flex justify-between items-center">
            {/* <h1 className=" font-bold text-gray-900">
              {selectedSchedule.mainScheduleTitle || "메인 일정 없음"}
            </h1> */}
            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
              value={selectedSchedule.mainScheduleTitle}
              onChange={(e) =>
                updateModalState("mainScheduleTitle", e.target.value)
              }
              disabled
            >
              <option value="기본일정">기본일정</option>
              {filteredMainSchedules.map((sched) => (
                <option key={sched.main_schedule_id} value={sched.title}>
                  {sched.title}
                </option>
              ))}
            </select>
            {/* "지난 목표 보기" 체크박스 */}
            {/* <label className="flex items-center space-x-1 cursor-pointer">
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
            </label> */}
          </div>

          {/* 제목 */}
          <div className="mb-4 flex flex-col items-start">
            <span className="block text-sm text-gray-600 mb-1">제목</span>
            <p className="text-gray-800 font-bold">
              {selectedSchedule.subScheduleTitle || "제목 없음"}
            </p>
          </div>

          {/* 날짜 */}
          <div className="mb-4 flex flex-col items-start">
            <span className="block text-sm text-gray-600 mb-1">날짜</span>
            <p className="text-gray-800">
              {formatLocalDateTime(selectedSchedule.start_time)} -{" "}
              {formatLocalDateTime(selectedSchedule.end_time)}
            </p>
          </div>

          {/* 설명 */}
          <div className="mb-4 flex flex-col items-start">
            <span className="block text-sm text-gray-600 mb-1">설명</span>
            <textarea
              readOnly
              className="w-full p-2 border border-gray-300 rounded focus:outline-none bg-gray-100 resize-none text-gray-800"
              rows={12}
              value={selectedSchedule.description || "설명이 없습니다."}
            />
          </div>

          {/* 색상 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">색상</span>
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: selectedSchedule.color }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailSchedule;
