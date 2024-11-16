import React from "react";
import { format, startOfWeek, addDays, isToday, parseISO } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useStore from "../stores/useStore";

const WeekHeader = ({ startOfCurrentWeek }) => {
  return (
    <div
      className="grid border-b sticky top-0 bg-white z-10 "
      style={{
        gridTemplateColumns: "102.4px repeat(7, minmax(0, 1fr))", // 요일 테이블은 기존 유지
        boxSizing: "border-box",
      }}
    >
      <div className="border-r h-16"></div>
      {[...Array(7)].map((_, index) => {
        const day = addDays(startOfCurrentWeek, index);
        const isCurrentDay = isToday(day);

        return (
          <div
            key={index}
            className="border-r text-center h-16 flex items-center justify-center"
          >
            <div className="flex justify-center items-center">
              <span
                className={`text-sm ${
                  isCurrentDay ? "font-bold text-black" : "text-gray-500"
                }`}
              >
                {format(day, "EEE")}
              </span>
              <div
                className={`flex items-center justify-center rounded-full w-6 h-6 ${
                  isCurrentDay ? "ml-2 bg-blue-500 text-white font-bold" : ""
                }`}
              >
                <span
                  className={`text-sm ${isCurrentDay ? "" : "text-gray-500"}`}
                >
                  {format(day, "d")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Calendar = () => {
  const currentWeek = useStore((state) => state.currentWeek);
  const setPrevWeek = useStore((state) => state.setPrevWeek);
  const setNextWeek = useStore((state) => state.setNextWeek);
  const setWeek = useStore((state) => state.setWeek);

  const handleWeekChange = (event) => {
    const selectedDate = parseISO(event.target.value);
    setWeek(selectedDate);
  };

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      {/* 상단 섹션 */}
      <div className="flex justify-between items-center mb-4">
        <div className="ml-16 text-lg font-bold text-gray-700">
          {format(currentWeek, "MMMM yyyy")}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={setPrevWeek}
            className="text-[#463198] text-xl p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <FaChevronLeft />
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={format(currentWeek, "yyyy-MM-dd")}
              onChange={handleWeekChange}
              className="border border-gray-100 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <button
            onClick={setNextWeek}
            className="text-[#463198] text-xl p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <WeekHeader startOfCurrentWeek={startOfCurrentWeek} />

      {/* 시간대와 셀 */}
      <div
        className="h-[600px] overflow-y-auto scrollbar-hide"
        style={{
          width: "calc(100%)", // 요일 테이블보다 가로 2.4px 더 크게 설정
          boxSizing: "border-box",
        }}
      >
        {[...Array(24)].map((_, hour) => (
          <div
            key={hour}
            className="grid"
            style={{
              gridTemplateColumns: "102.4px repeat(7, minmax(0, 1fr))", // 기존 열 설정 유지
            }}
          >
            <div className="h-12 flex items-start justify-center pt-1 text-gray-400">
              {hour !== 0 && (
                <span className="-translate-y-4 bg-white">
                  {format(new Date().setHours(hour), "ha").toLowerCase()}
                </span>
              )}
            </div>
            {[...Array(7)].map((_, day) => (
              <div
                key={`${day}-${hour}`}
                className="border-t border-r border-gray-300 h-12 cursor-pointer hover:bg-[#f5f4ff] transition-all duration-100"
                onClick={() => alert("일정을 추가합니다.")}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* 스크롤 바 숨기기 */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default Calendar;
