import React, { useState, useEffect, useRef } from "react";
import useScheduleStore from "../stores/scheduleStore";
import styles from "../css/scheduleModal.module.css";
import { format, parse } from "date-fns";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

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
  const showPastSchedules = useScheduleStore(
    (state) => state.showPastSchedules
  );
  const toggleShowPastSchedules = useScheduleStore(
    (state) => state.toggleShowPastSchedules
  );

  const [mainSchedule, setMainSchedule] = useState(
    schedule.mainSchedule || "기본일정(default)"
  );
  const [customInput, setCustomInput] = useState("");
  const [subScheduleTitle, setSubScheduleTitle] = useState("");
  const [startTime, setStartTime] = useState(schedule.start_time);
  const [endTime, setEndTime] = useState(schedule.end_time);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(schedule.color || "#FF5733");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (mainSchedule === "직접 입력") {
      document
        .querySelector("input[placeholder='목표를 입력하세요.']")
        ?.focus();
    }
  }, [mainSchedule]);

  // 상태 자동 설정
  const [status, setStatus] = useState("진행중"); // 기본 상태

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
      mainSchedule: mainSchedule === "직접 입력" ? customInput : mainSchedule,
      title: subScheduleTitle,
      start_time: startTime,
      end_time: endTime,
      description,
      color,
      status,
    };

    console.log("Saving schedule:", scheduleToSave); // 디버깅용 로그
    saveSubSchedule(scheduleToSave);
    setSelectedSchedule(scheduleToSave);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Helper function to format Date to 'yyyy-MM-ddTHH:mm'
  const formatLocalDateTime = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  // Helper function to parse 'yyyy-MM-ddTHH:mm' to Date
  const parseLocalDateTime = (value) => {
    return parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
  };

  // 클릭 외부 영역 시 모달 닫기 방지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // 모달 외부 클릭 시 닫히지 않도록 주석 처리
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
            className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={mainSchedule}
            onChange={(e) => setMainSchedule(e.target.value)}
          >
            {mainSchedules.map((sched) => (
              <option key={sched.main_schedule_id} value={sched.title}>
                {sched.title}
              </option>
            ))}
          </select>
          {/* "지난 일정 포함" 체크박스 */}
          <label className="flex items-center space-x-1 cursor-pointer">
            {showPastSchedules ? (
              <FaCheckSquare
                className="text-blue-600"
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
              지난 일정 포함
            </span>
          </label>
        </div>

        {mainSchedule === "직접 입력" && (
          <input
            type="text"
            placeholder="목표를 입력하세요."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        )}

        {/* 제목 추가 */}
        <div className="flex flex-col space-y-2 mt-4">
          <input
            type="text"
            placeholder="제목을 입력하세요."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={subScheduleTitle}
            onChange={(e) => setSubScheduleTitle(e.target.value)}
          />
        </div>

        {/* 색상 선택 */}
        <div className="flex items-center space-x-2 mt-4 relative">
          <div
            className="w-8 h-8 rounded-full cursor-pointer border"
            style={{ backgroundColor: color }}
            onClick={() => setColorPickerVisible(!colorPickerVisible)}
          ></div>
          {colorPickerVisible && (
            <div className="flex flex-wrap w-40 p-2 bg-white border rounded shadow-lg absolute z-20 top-10 left-0">
              {predefinedColors.map((c) => (
                <div
                  key={c}
                  className="w-6 h-6 m-1 rounded-full cursor-pointer border"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setColor(c);
                    setColorPickerVisible(false);
                  }}
                ></div>
              ))}
            </div>
          )}
          <span>색상 선택</span>
        </div>

        {/* 시간 선택 */}
        <div className="flex space-x-2 mt-4">
          <input
            type="datetime-local"
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            value={formatLocalDateTime(startTime)}
            onChange={(e) => setStartTime(parseLocalDateTime(e.target.value))}
          />
          <input
            type="datetime-local"
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            value={formatLocalDateTime(endTime)}
            onChange={(e) => setEndTime(parseLocalDateTime(e.target.value))}
          />
        </div>

        {/* 설명 */}
        <textarea
          placeholder="추가 설명 입력 (옵션)"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 버튼 */}
        <div className="flex space-x-2 mt-4">
          <button className={styles.cancelButton} onClick={handleCancel}>
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
