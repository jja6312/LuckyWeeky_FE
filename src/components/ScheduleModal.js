import React, { useState, useEffect, useRef } from "react";
import useScheduleStore from "../stores/scheduleStore";
import styles from "../css/scheduleModal.module.css";
import { format, parse, addMinutes, subMinutes } from "date-fns";
import {
  FaCheckSquare,
  FaRegSquare,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";

const predefinedColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#FF8C33",
  "#8D33FF",
  "#33FFF5",
  "#FF3333",
];

const ScheduleModal = ({ schedule, position, onClose, isClosing }) => {
  const mainSchedules = useScheduleStore((state) => state.mainSchedules);
  const saveSubSchedule = useScheduleStore((state) => state.saveSubSchedule);
  const setSelectedSchedule = useScheduleStore(
    (state) => state.setSelectedSchedule
  );

  const [mainSchedule, setMainSchedule] = useState("기본일정");
  const [customInput, setCustomInput] = useState("");
  const [subScheduleTitle, setSubScheduleTitle] = useState("");
  const [startTime, setStartTime] = useState(schedule.start_time);
  const [endTime, setEndTime] = useState(schedule.end_time);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(schedule.color || "#FF5733");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const [showPastSchedules, setShowPastSchedules] = useState(false);

  const toggleShowPastSchedules = () => {
    setShowPastSchedules(!showPastSchedules);
  };

  const modalRef = useRef(null);

  // 15분 단위로 조정
  const incrementDuration = () => {
    setEndTime(addMinutes(endTime, 15));
  };

  const decrementDuration = () => {
    if (endTime > addMinutes(startTime, 15)) {
      setEndTime(subMinutes(endTime, 15));
    }
  };

  useEffect(() => {
    if (mainSchedule === "목표 추가") {
      document
        .querySelector("input[placeholder='목표를 입력하세요.']")
        ?.focus();
    }
  }, [mainSchedule]);

  // 상태 자동 설정
  const [status, setStatus] = useState("진행중");

  useEffect(() => {
    const today = new Date();
    if (endTime < today) {
      setStatus("지난 일정");
    } else {
      setStatus("진행중");
    }
  }, [endTime]);

  const handleSave = () => {
    const scheduleToSave = {
      mainSchedule: mainSchedule === "목표 추가" ? customInput : mainSchedule,
      title: subScheduleTitle,
      start_time: startTime,
      end_time: endTime,
      description,
      color,
      status,
    };

    saveSubSchedule(scheduleToSave);
    setSelectedSchedule(scheduleToSave);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const formatLocalDateTime = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const parseLocalDateTime = (value) => {
    return parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // 모달 외부 클릭 시 닫히지 않음
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const filteredMainSchedules = mainSchedules.filter((schedule) => {
    // "목표 추가" 및 "기본일정" 일정은 항상 표시
    if (schedule.title === "목표 추가" || schedule.title === "기본일정") {
      return true;
    }

    // "지난 목표 보기" 옵션 상태에 따라 조건 분기
    if (showPastSchedules) {
      return true; // 옵션 활성화 시 모든 일정 표시
    } else {
      return schedule.end_time >= new Date(); // 옵션 비활성화 시 미래 일정만 표시
    }
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        className={`${styles.modal} ${
          isClosing ? styles.fadeOut : styles.fadeIn
        }`}
      >
        {/* 일정 선택 */}
        <div className="flex justify-between items-center space-x-2">
          <select
            className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
            value={mainSchedule}
            onChange={(e) => setMainSchedule(e.target.value)}
          >
            {filteredMainSchedules.map((sched) => (
              <option
                className={`${
                  sched.title === "목표 추가"
                    ? "text-[#312a7a] font-semibold"
                    : ""
                }`}
                key={sched.main_schedule_id}
                value={sched.title}
              >
                {sched.title}
              </option>
            ))}
          </select>
          {/* "지난 목표 보기" 체크박스 */}
          <label className="flex items-center space-x-1 cursor-pointer">
            {showPastSchedules ? (
              <FaCheckSquare
                className="text-[#312a7a] cursor-pointer"
                onClick={toggleShowPastSchedules}
              />
            ) : (
              <FaRegSquare
                className="text-gray-400"
                onClick={toggleShowPastSchedules}
              />
            )}
            <span
              className="text-sm text-gray-700"
              onClick={toggleShowPastSchedules}
            >
              지난 목표 보기
            </span>
          </label>
        </div>

        {mainSchedule === "목표 추가" && (
          <input
            type="text"
            placeholder="목표를 입력하세요."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] mt-2"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        )}

        {/* 제목 추가 */}
        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            placeholder="일정을 입력하세요."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
            value={subScheduleTitle}
            onChange={(e) => setSubScheduleTitle(e.target.value)}
          />
          {/* 색상 선택 */}
          <div className="flex items-center space-x-2 relative">
            <div
              className="w-8 h-8 rounded-full cursor-pointer border-[2px] border-gray-200"
              style={{ backgroundColor: color }}
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
            ></div>
            {colorPickerVisible && (
              <div className="flex flex-wrap w-40 p-2 bg-white border-[2px] border-gray-300 rounded shadow-lg absolute z-20 top-10 left-0">
                {predefinedColors.map((c) => (
                  <div
                    key={c}
                    className="w-6 h-6 m-1 rounded-full cursor-pointer "
                    style={{ backgroundColor: c }}
                    onClick={() => {
                      setColor(c);
                      setColorPickerVisible(false);
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Duration Control */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-700 text-sm">시간 조정</span>
          <div className="flex items-center space-x-4">
            <FaMinusCircle
              className="text-[#312a7a] text-3xl cursor-pointer"
              onClick={decrementDuration}
            />
            <span className="text-gray-700 text-sm">
              {Math.round((endTime - startTime) / (1000 * 60))} mins
            </span>
            <FaPlusCircle
              className="text-[#312a7a] text-3xl cursor-pointer"
              onClick={incrementDuration}
            />
          </div>
        </div>

        {/* 시간 선택 */}
        <div className="flex space-x-2 mt-4">
          <div className="flex flex-col items-start flex-1">
            <span className="text-xs">시작 날짜</span>
            <input
              type="datetime-local"
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] text-xs"
              value={formatLocalDateTime(startTime)}
              onChange={(e) => setStartTime(parseLocalDateTime(e.target.value))}
            />
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="text-xs">종료 날짜</span>
            <input
              type="datetime-local"
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] text-xs"
              value={formatLocalDateTime(endTime)}
              onChange={(e) => setEndTime(parseLocalDateTime(e.target.value))}
            />
          </div>
        </div>

        {/* 설명 */}
        <textarea
          placeholder="추가 설명 입력 (옵션)"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] mt-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 버튼 */}
        <div className="flex space-x-2 mt-4 w-full">
          <button className={styles.cancleButton} onClick={handleCancel}>
            취소
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
