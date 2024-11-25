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
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import useStore from "../stores/useStore";
import useScheduleStore from "../stores/useScheduleStore";
import ScheduleModal from "./ScheduleModal";
import WeekHeader from "./WeekHeader";
import Swal from "sweetalert2";
import { getSchedulesByDate } from "../api/schedule/getSchedulesByDate";
import { deleteSubScheduleById } from "../api/schedule/deleteSubScheduleById";

const Calendar = () => {
  const {
    selectedSchedule,
    setSelectedSchedule,
    subschedules,
    setSubschedules,
  } = useScheduleStore();
  const { currentWeek, setPrevWeek, setNextWeek, setWeek, closeSidebar } =
    useStore();

  // 캘린더 일정 클릭시 사이드바 조작을 위한 상태
  const { setSelectedIcon, setIsSidebarOpen } = useStore();

  const [hoverTime, setHoverTime] = useState({ hour: null, minutes: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [hidden, setHidden] = useState(false);

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
    }, 600);
  };

  const handleTimeBlockClick = (dayIndex, hour, quarter, event) => {
    event.stopPropagation(); // 이벤트 전파 방지
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
      mainScheduleTitle: "기본일정",
      subScheduleTitle: `No title ${format(startTime, "h:mm a")} - ${format(
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

  const handleDelete = (schedule) => {
    Swal.fire({
      title: "<strong style='font-size:18px'>정말 삭제하시겠습니까?</strong>",
      html: "<p style='font-size:12px;color:#555'>삭제된 데이터는 복구할 수 없습니다.</p>",
      icon: "warning",
      iconColor: "#d33",
      position: "top",
      showCancelButton: true,
      cancelButtonText: "<b style='margin-left:2px;'>취소</b>",
      confirmButtonText: "<b style='margin-right:2px;'>삭제</b>",
      reverseButtons: true, // 버튼 위치 변경
      buttonsStyling: false,
      customClass: {
        popup: "bg-white rounded-lg shadow-lg p-4", // 높이를 줄이기 위한 padding 조정
        title: "text-red-500 font-bold",
        confirmButton:
          "bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-150 ml-4", // 삭제 버튼 간격 추가
        cancelButton:
          "bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-150", // 취소 버튼
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteSubScheduleById(schedule.subScheduleTitle);

        Swal.fire({
          title: "✨ 삭제 완료! ✨",
          text: "데이터가 성공적으로 삭제되었습니다.",
          icon: "success",
          iconColor: "#4caf50",
          position: "top",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,

          background: "linear-gradient(145deg, #f0f0f0, #e0e0e0)",
          customClass: {
            popup: "rounded-lg shadow-md",
            title: "text-green-600 font-bold",
          },
        });
        closeSidebar();
        console.log("삭제가 완료되었습니다.");
        setTimeout(() => {
          // 0.4초 후에 새로고침
          window.location.reload();
        }, 400);
      } else {
        console.log("삭제가 취소되었습니다.");
      }
    });
  };

  // 현재 주에 해당하는 일정 필터링
  const filteredSubSchedules = useMemo(() => {
    return subschedules.filter((schedule) => {
      const scheduleStart = new Date(schedule.start_time);
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

  const renderSchedules = () => {
    if (!filteredSubSchedules || filteredSubSchedules.length === 0) {
      return null; // 일정이 없으면 아무것도 렌더링하지 않음
    }

    return filteredSubSchedules.flatMap((schedule, index) => {
      const scheduleStart = new Date(schedule.start_time);
      const scheduleEnd = new Date(schedule.end_time);
      const scheduleColor = schedule.color || "#ddd";
      const scheduleTitle = schedule.subScheduleTitle;

      const divs = [];
      let currentStart = new Date(scheduleStart);

      while (currentStart < scheduleEnd) {
        const currentEnd = new Date(
          Math.min(
            startOfDay(new Date(currentStart)).getTime() + 24 * 60 * 60 * 1000,
            scheduleEnd
          )
        );

        const totalMinutesInDay = 24 * 60;
        const startOfDayTime = startOfDay(currentStart).getTime();

        const minutesFromTop =
          ((currentStart - startOfDayTime) / (totalMinutesInDay * 60000)) * 100;
        const scheduleDuration = differenceInMinutes(currentEnd, currentStart);
        const scheduleHeight = (scheduleDuration / totalMinutesInDay) * 100;

        const dayIndex =
          currentStart.getDay() === 0 ? 6 : currentStart.getDay() - 1;

        divs.push(
          <div
            key={`${index}-${currentStart.toISOString()}`}
            className={`absolute flex flex-col cursor-pointer hover:opacity-70 transition-all duration-150
            group `}
            style={{
              top: `${minutesFromTop}%`,
              height: `${scheduleHeight}%`,
              left: `calc(${dayIndex * (100 / 7)}%)`,
              width: `calc(${100 / 7}%)`,
              backgroundColor: scheduleColor,
              zIndex: 5,
              borderRadius: "4px",
              overflow: "hidden",
              padding: "2px",
              boxSizing: "border-box",
            }}
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 전파 방지
              setIsSidebarOpen(true);
              setSelectedIcon("detailSchedule");
              setSelectedSchedule(schedule);
            }}
          >
            <div
              className=" space-x-1 absolute right-1 
            hidden group-hover:flex"
            >
              <FaEdit
                className="text-xs text-gray-400 hover:text-[#312a7a]"
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 전파 방지
                  setSelectedIcon("editSchedule");
                  setSelectedSchedule(schedule);
                }}
              />
              <FaTrash
                className="text-xs text-gray-400 hover:text-[#312a7a]"
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 전파 방지
                  handleDelete(schedule);
                }}
              />
            </div>
            <div className="flex justify-center items-center text-xs text-black text-center">
              <span>{scheduleTitle}</span>
            </div>
          </div>
        );

        currentStart = new Date(currentEnd); // 다음 날짜로 이동
      }

      return divs;
    });
  };

  useEffect(() => {
    // 필요에 따라 초기화 로직 추가
  }, []); // 첫 렌더링 시 한 번 실행

  // subschedules 상태가 변경되었을 때 실행
  useEffect(() => {
    console.log("현재 subschedules: ", subschedules);
    if (subschedules.length > 0) {
      console.log("일정 불러오기 완료");
    }
  }, [subschedules]); // subschedules가 변경될 때 실행

  // 현재 주 일정 데이터를 백엔드에서 조회
  useEffect(() => {
    const fetchSchedules = async () => {
      const dateString = format(currentWeek, "yyyy-MM-dd HH:mm:ss");
      const schedules = await getSchedulesByDate(dateString);
      console.log(schedules);
      try {
        // 백엔드 데이터를 subschedules 형식으로 변환
        // const subschedulesFromBackend = schedules.flatMap((schedule) =>
        //   schedule.subSchedules.map((subSchedule) => ({
        //     mainScheduleTitle: schedule.mainTitle,
        //     subScheduleTitle: subSchedule.title,
        //     description: subSchedule.description,
        //     start_time: new Date(subSchedule.startTime),
        //     end_time: new Date(subSchedule.endTime),
        //     color: schedule.color,
        //   }))
        // );
        const subschedulesFromBackend = schedules.flatMap((schedule) =>
          schedule.subSchedules
            ? schedule.subSchedules.map((subSchedule) => ({
                mainScheduleTitle: schedule.mainTitle,
                subScheduleTitle: subSchedule.title,
                description: subSchedule.description,
                start_time: new Date(subSchedule.startTime),
                end_time: new Date(subSchedule.endTime),
                color: schedule.color,
              }))
            : []
        );
        setSubschedules(subschedulesFromBackend); // 상태 업데이트
      } catch (error) {
        console.error("일정 조회 중 오류 발생:", error);
      }
    };

    fetchSchedules();
  }, [currentWeek]);

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
              className="absolute top-0 "
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
                        closeSidebar();
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
