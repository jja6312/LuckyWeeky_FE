import React from "react";
import useScheduleStore from "../stores/useScheduleStore";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";

const DetailSchedule = () => {
  const selectedSchedule = useScheduleStore((state) => state.selectedSchedule);
  const mainSchedules = useScheduleStore((state) => state.mainSchedules);

  const formatLocalDateTime = (date) => {
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // 선택된 subSchedule과 연관된 mainSchedule 찾기
  const mainSchedule = mainSchedules.find(
    (schedule) => schedule.title === selectedSchedule?.mainScheduleTitle
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {selectedSchedule === null ? (
        <p className="text-gray-800 text-center">일정을 선택해주세요.</p>
      ) : (
        <>
          {/* Main Schedule Title */}
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {selectedSchedule.mainScheduleTitle || "메인 일정 없음"}
            </h1>
            <FaEdit className="text-2xl text-[#463198] cursor-pointer hover:opacity-60 transition-all duration-150" />
          </div>

          {/* Main Schedule Details */}
          {mainSchedule && (
            <div className="mb-4 flex flex-col items-start">
              <span className="block text-sm text-gray-600 mb-1">
                메인 일정 상세
              </span>
              <p className="text-gray-800">
                시작: {formatLocalDateTime(mainSchedule.start_time)}
              </p>
              <p className="text-gray-800">
                종료: {formatLocalDateTime(mainSchedule.end_time)}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-600">색상</span>
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: mainSchedule.color }}
                ></div>
              </div>
            </div>
          )}

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
