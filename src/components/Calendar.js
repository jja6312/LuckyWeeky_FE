// components/Calendar.jsx
import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  parseISO,
  differenceInMinutes,
  startOfDay,
  endOfWeek,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useStore from "../stores/useStore";
import useScheduleStore from "../stores/scheduleStore";
import ScheduleModal from "./ScheduleModal";

const WeekHeader = ({ startOfCurrentWeek }) => {
  return (
    <div
      className="grid border-b sticky top-0 bg-white z-10"
      style={{
        gridTemplateColumns: "102.4px repeat(7, minmax(0, 1fr))",
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

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const subschedules = useScheduleStore((state) => state.subschedules);
  const isHydrated = useScheduleStore.persist.hasHydrated(); // Zustand 상태 복원 확인

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });

  useEffect(() => {
    if (!isHydrated) {
      console.log("Loading schedules...");
    }
  }, [isHydrated]);

  const handleWeekChange = (event) => {
    const selectedDate = parseISO(event.target.value);
    setWeek(selectedDate);
  };

  const openModal = (schedule, position) => {
    setSelectedSchedule(schedule);
    setModalPosition(position);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setSelectedSchedule(null);
    }, 400);
  };

  const handleTimeBlockClick = (dayIndex, hour, quarter, event) => {
    if (modalOpen) {
      closeModal();
      return;
    }

    const clickedDay = new Date(startOfCurrentWeek);
    clickedDay.setDate(clickedDay.getDate() + dayIndex);
    clickedDay.setHours(hour, quarter * 15, 0, 0);

    const startTime = new Date(clickedDay);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 15);

    const newSchedule = {
      mainSchedule: "기본일정",
      title: `No title ${format(startTime, "h:mm a")} - ${format(
        endTime,
        "h:mm a"
      )}`,
      start_time: startTime,
      end_time: endTime,
      description: "",
      color: "#eeeaff",
      status: "진행중",
    };

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY;
    const offsetLeft = rect.left + window.scrollX;

    const newPosition = {
      top: offsetTop,
      left: offsetLeft,
    };

    openModal(newSchedule, newPosition);
  };

  const handleModalClose = () => {
    closeModal();
  };

  if (!isHydrated) {
    return <div>Loading...</div>; // 상태 복원이 완료되지 않으면 로딩 화면 표시
  }

  const filteredSubSchedules = subschedules.filter((schedule) => {
    const scheduleStart = schedule.start_time;
    const scheduleEnd = schedule.end_time;

    return (
      (scheduleStart >= startOfCurrentWeek &&
        scheduleStart <= endOfCurrentWeek) ||
      (scheduleEnd >= startOfCurrentWeek && scheduleEnd <= endOfCurrentWeek) ||
      (scheduleStart <= startOfCurrentWeek && scheduleEnd >= endOfCurrentWeek)
    );
  });

  const hours = [...Array(24)].map((_, i) => i);

  const renderSchedules = () => {
    return filteredSubSchedules.map((schedule, index) => {
      const scheduleStart = schedule.start_time;
      const scheduleEnd = schedule.end_time;

      const totalMinutesInDay = 24 * 60;
      const startOfDayTime = startOfDay(scheduleStart).getTime();

      const minutesFromTop =
        ((scheduleStart - startOfDayTime) / (totalMinutesInDay * 60000)) * 100;

      const scheduleDuration = differenceInMinutes(scheduleEnd, scheduleStart);

      const scheduleHeight = (scheduleDuration / totalMinutesInDay) * 100;

      const dayIndex =
        scheduleStart.getDay() === 0 ? 6 : scheduleStart.getDay() - 1;

      return (
        <div
          key={index}
          className="absolute flex justify-center items-center cursor-pointer"
          style={{
            top: `${minutesFromTop}%`,
            height: `${scheduleHeight}%`,
            left: `calc(${dayIndex * (100 / 7)}%)`,
            width: `calc(${100 / 7}% - 1px)`,
            backgroundColor: schedule.color,
            zIndex: 5,
            borderRadius: "0px",
            overflow: "hidden",
            padding: "2px",
            boxSizing: "border-box",
          }}
        >
          <div className="text-xs text-black text-center">{schedule.title}</div>
        </div>
      );
    });
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md relative"
      onClick={() => {
        if (modalOpen) closeModal();
      }}
      style={{ position: "relative" }}
    >
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
        className="h-[1500px] overflow-y-auto scrollbar-hide relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "calc(100%)",
          boxSizing: "border-box",
        }}
      >
        {/* 시간대 표시 */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: "102.4px",
            height: "100%",
            borderRight: "1px solid #e5e7eb",
          }}
        >
          {hours.map((hour) => (
            <div
              key={hour}
              style={{
                height: `${(1 / 24) * 100}%`,
                borderBottom: "1px solid #e5e7eb",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              {hour !== 0 && (
                <span
                  className="absolute left-0 top-0 text-xs text-gray-400"
                  style={{ transform: "translateY(-50%)" }}
                >
                  {format(new Date().setHours(hour, 0), "ha").toLowerCase()}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 날짜별 시간대 표시 */}
        <div
          className="absolute left-[102.4px] top-0"
          style={{ width: "calc(100% - 102.4px)", height: "100%" }}
        >
          {[...Array(7)].map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="absolute top-0"
              style={{
                left: `calc(${(dayIndex * 100) / 7}%)`,
                width: `calc(100% / 7)`,
                height: "100%",
                borderRight: "1px solid #e5e7eb",
                boxSizing: "border-box",
              }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: `${(1 / 24) * 100}%`,
                    borderBottom: "1px solid #e5e7eb",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="h-full w-full group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = e.clientY - rect.top;
                      const clickedMinutes = (y / rect.height) * 60;
                      const clickedHour = hour;
                      const clickedDate = new Date(startOfCurrentWeek);
                      clickedDate.setDate(clickedDate.getDate() + dayIndex);
                      clickedDate.setHours(
                        clickedHour,
                        Math.floor(clickedMinutes),
                        0,
                        0
                      );

                      handleTimeBlockClick(
                        dayIndex,
                        clickedHour,
                        Math.floor(clickedMinutes / 15),
                        e
                      );
                    }}
                    style={{
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <div
                      className="absolute inset-0 group-hover:bg-blue-100"
                      style={{
                        borderRadius: "0px",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* 등록된 일정 렌더링 */}
          {renderSchedules()}
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {modalOpen && (
        <ScheduleModal
          schedule={selectedSchedule}
          position={modalPosition}
          onClose={handleModalClose}
          isClosing={modalClosing}
        />
      )}

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
