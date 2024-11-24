import React, { useState, useEffect, useRef } from "react";
import useScheduleStore from "../stores/useScheduleStore";
import styles from "../css/scheduleModal.module.css";
import { format, parse, addMinutes, subMinutes } from "date-fns";
import {
  FaCheckSquare,
  FaRegSquare,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const ScheduleModal = ({ schedule, position, onClose, isClosing }) => {
  const {
    mainSchedules,
    subschedules,
    saveSubSchedule,
    setSelectedSchedule,
    addMainSchedule,
    predefinedColors,
  } = useScheduleStore();

  // 상태를 객체로 묶기
  const [modalState, setModalState] = useState({
    mainScheduleTitle: "기본일정",
    customInput: "",
    subScheduleTitle: "",
    startTime: schedule?.start_time || new Date(),
    endTime: schedule?.end_time || addMinutes(new Date(), 30),
    color: schedule?.color || "#FF5733",
    description: "",
    colorPickerVisible: false,
    showPastSchedules: false,
  });

  // 상태 업데이트 함수
  const updateModalState = (key, value) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  // 상태 자동 설정: 진행 상태 (진행중 / 지난 일정)
  const status = modalState.endTime < new Date() ? "지난 일정" : "진행중";

  const modalRef = useRef(null);

  // 15분 단위로 조정
  const incrementDuration = () => {
    updateModalState("endTime", addMinutes(modalState.endTime, 15));
  };

  const decrementDuration = () => {
    if (modalState.endTime > addMinutes(modalState.startTime, 15)) {
      updateModalState("endTime", subMinutes(modalState.endTime, 15));
    }
  };

  useEffect(() => {
    if (modalState.mainScheduleTitle === "목표 추가") {
      document
        .querySelector("input[placeholder='목표를 입력하세요.']")
        ?.focus();
    }
  }, [modalState.mainScheduleTitle]);

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

  // **서버에 일정 생성 요청**

  const handleSave = async () => {
    // ScheduleData 생성
    const scheduleData = {
      userId: 101, // 로그인한 사용자 ID (예시)
      mainTitle:
        modalState.mainScheduleTitle === "목표 추가" && modalState.customInput
          ? modalState.customInput
          : modalState.mainScheduleTitle,
      color: modalState.color,
      startTime: format(modalState.startTime, "yyyy-MM-dd HH:mm:ss"),
      endTime: format(modalState.endTime, "yyyy-MM-dd HH:mm:ss"),
      subSchedules: [
        {
          title: modalState.subScheduleTitle, // SubScheduleDto의 title 필드
          description: modalState.description, // SubScheduleDto의 description 필드
          startTime: format(modalState.startTime, "yyyy-MM-dd HH:mm:ss"), // SubScheduleDto의 startTime 필드
          endTime: format(modalState.endTime, "yyyy-MM-dd HH:mm:ss"), // SubScheduleDto의 endTime 필드
        },
      ],
    };

    try {
      const response = await axiosInstance.post(
        "/UAKRPCjN/OqwSjA",
        scheduleData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Created schedule response:", response.data);
      alert("일정이 성공적으로 생성되었습니다!");
      onClose();
    } catch (error) {
      console.error("Failed to save schedule:", error);
      alert("일정 저장에 실패했습니다. 다시 시도해주세요.");
    }
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
            value={modalState.mainScheduleTitle}
            onChange={(e) =>
              updateModalState("mainScheduleTitle", e.target.value)
            }
          >
            <option value="목표 추가" className="text-[#312a7a] font-semibold">
              목표 추가
            </option>
            <option value="기본일정">기본일정</option>
            {filteredMainSchedules.map((sched) => (
              <option key={sched.main_schedule_id} value={sched.title}>
                {sched.title}
              </option>
            ))}
          </select>
          {/* "지난 목표 보기" 체크박스 */}
          <label className="flex items-center space-x-1 cursor-pointer">
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

        {modalState.mainScheduleTitle === "목표 추가" && (
          <input
            type="text"
            placeholder="목표를 입력하세요."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] mt-2"
            value={modalState.customInput}
            onChange={(e) => updateModalState("customInput", e.target.value)}
          />
        )}

        {/* 제목 추가 */}
        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            placeholder="일정을 입력하세요."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
            value={modalState.subScheduleTitle}
            onChange={(e) =>
              updateModalState("subScheduleTitle", e.target.value)
            }
          />
          {/* 색상 선택 */}
          <div className="flex items-center space-x-2 relative">
            <div
              className="w-8 h-8 rounded-full cursor-pointer border-[2px] border-gray-200"
              style={{ backgroundColor: modalState.color }}
              onClick={() =>
                updateModalState(
                  "colorPickerVisible",
                  !modalState.colorPickerVisible
                )
              }
            ></div>
            {modalState.colorPickerVisible && (
              <div className="flex flex-wrap w-40 p-2 bg-white border-[2px] border-gray-300 rounded shadow-lg absolute z-20 top-10 left-0">
                {predefinedColors?.map((c) => (
                  <div
                    key={c}
                    className="w-6 h-6 m-1 rounded-full cursor-pointer"
                    style={{ backgroundColor: c }}
                    onClick={() => {
                      updateModalState("color", c);
                      updateModalState(
                        "colorPickerVisible",
                        !modalState.colorPickerVisible
                      );
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
              {Math.round(
                (modalState.endTime - modalState.startTime) / (1000 * 60)
              )}{" "}
              mins
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
              value={formatLocalDateTime(modalState.startTime)}
              onChange={(e) =>
                updateModalState(
                  "startTime",
                  parseLocalDateTime(e.target.value)
                )
              }
            />
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="text-xs">종료 날짜</span>
            <input
              type="datetime-local"
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] text-xs"
              value={formatLocalDateTime(modalState.endTime)}
              onChange={(e) =>
                updateModalState("endTime", parseLocalDateTime(e.target.value))
              }
            />
          </div>
        </div>

        {/* 설명 */}
        <textarea
          placeholder="추가 설명 입력 (옵션)"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a] mt-4"
          value={modalState.description}
          onChange={(e) => updateModalState("description", e.target.value)}
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
