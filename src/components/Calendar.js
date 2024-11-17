// components/Calendar.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  parseISO,
  differenceInMinutes,
  startOfDay,
  endOfWeek,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useStore from "../stores/useStore";
import useScheduleStore from "../stores/scheduleStore";
import ScheduleModal from "./ScheduleModal";
import WeekHeader from "./WeekHeader";

const Calendar = () => {
  const currentWeek = useStore((state) => state.currentWeek);
  const setPrevWeek = useStore((state) => state.setPrevWeek);
  const setNextWeek = useStore((state) => state.setNextWeek);
  const setWeek = useStore((state) => state.setWeek);

  const [hoverTime, setHoverTime] = useState({ hour: null, minutes: null });
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const subschedules = useScheduleStore((state) => state.subschedules);

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });

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

  // 현재 주에 해당하는 일정 필터링
  const filteredSubSchedules = useMemo(() => {
    return subschedules.filter((schedule) => {
      const scheduleStart = new Date(schedule.start_time); // Date 변환 보장
      const scheduleEnd = new Date(schedule.end_time);

      return (
        (scheduleStart >= startOfCurrentWeek &&
          scheduleStart <= endOfCurrentWeek) ||
        (scheduleEnd >= startOfCurrentWeek &&
          scheduleEnd <= endOfCurrentWeek) ||
        (scheduleStart <= startOfCurrentWeek && scheduleEnd >= endOfCurrentWeek)
      );
    });
  }, [subschedules, startOfCurrentWeek, endOfCurrentWeek]);

  // 시간대를 나타내는 배열 생성 (0시부터 23시까지)
  const hours = [...Array(24)].map((_, i) => i);

  // 일정 렌더링 함수
  const renderSchedules = () => {
    if (!filteredSubSchedules || filteredSubSchedules.length === 0) {
      return null; // 일정이 없으면 아무것도 렌더링하지 않음
    }

    return filteredSubSchedules.map((schedule, index) => {
      const scheduleStart = new Date(schedule.start_time);
      const scheduleEnd = new Date(schedule.end_time);

      // 하루 총 분
      const totalMinutesInDay = 24 * 60;
      const startOfDayTime = startOfDay(scheduleStart).getTime();

      // 일정의 시작 위치를 계산 (0 ~ 100% 사이)
      const minutesFromTop =
        ((scheduleStart - startOfDayTime) / (totalMinutesInDay * 60000)) * 100;

      // 일정의 길이 계산 (분 단위)
      const scheduleDuration = differenceInMinutes(scheduleEnd, scheduleStart);

      // 일정의 높이 계산 (전체 높이의 퍼센트)
      const scheduleHeight = (scheduleDuration / totalMinutesInDay) * 100;

      // 일정이 시작되는 요일 계산 (0부터 6까지)
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
            width: `calc(${100 / 7}%)`,
            backgroundColor: schedule.color || "#ddd", // 기본 색상 설정
            zIndex: 5,
            borderRadius: "4px",
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

  useEffect(() => {
    const schedules =
      JSON.parse(localStorage.getItem("schedule-storage")) || [];
    console.log("로컬 스토리지에서 불러온 일정: ", schedules);

    if (schedules.length > 0) {
      useScheduleStore.getState().initializeSubSchedules(schedules); // 상태 초기화
    }
  }, []); // 첫 렌더링 시 한 번 실행

  // subschedules 상태가 변경되었을 때 실행
  useEffect(() => {
    console.log("현재 subschedules: ", subschedules);
    if (subschedules.length > 0) {
      console.log("일정 불러오기 완료");
    }
  }, [subschedules]); // subschedules가 변경될 때 실행

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
                boxSizing: "border-box",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: `${(1 / 24) * 100}%`,
                    boxSizing: "border-box",
                    borderTop: "1px solid #e5e7eb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {[0, 1, 2, 3].map((quarter) => (
                    <div
                      key={quarter}
                      className="h-full w-full group relative"
                      onMouseEnter={() => {
                        setHoverTime({
                          hour,
                          minutes: quarter * 15,
                          dayIndex,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoverTime({ hour: null, minutes: null });
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickedMinutes = quarter * 15; // 현재 블록의 시작 분(15분 단위)
                        const clickedHour = hour;
                        const clickedDate = new Date(startOfCurrentWeek);
                        clickedDate.setDate(clickedDate.getDate() + dayIndex);
                        clickedDate.setHours(clickedHour, clickedMinutes, 0, 0);

                        handleTimeBlockClick(dayIndex, clickedHour, quarter, e);
                      }}
                      style={{
                        position: "relative",
                        height: `${(1 / 4) * 100}%`, // 15분 단위 높이
                        borderTop:
                          quarter === 0 ? "none" : "1px dotted transparent",
                        borderBottom:
                          quarter === 3 ? "none" : "1px dotted transparent",
                      }}
                    >
                      <div
                        className="absolute inset-0 group-hover:bg-[#f6f4ff]"
                        style={{
                          borderRadius: "0px",
                        }}
                      ></div>
                      {hoverTime.hour === hour &&
                        hoverTime.minutes === quarter * 15 &&
                        hoverTime.dayIndex === dayIndex && (
                          <div
                            className="absolute inset-0 flex items-center justify-center text-xs text-gray-400"
                            style={{
                              pointerEvents: "none",
                            }}
                          >
                            {`${
                              hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                            }${hour >= 12 ? "pm" : "am"} ${quarter * 15}min`}
                          </div>
                        )}
                    </div>
                  ))}
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
