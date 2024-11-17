import React, { useEffect, useState } from "react";
import useScheduleStore from "../stores/useScheduleStore";
import { format, addMinutes, subMinutes } from "date-fns";
import {
  FaCheckSquare,
  FaRegSquare,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";

import SlideTitle from "./SlideTitle";
import useStore from "../stores/useStore";

import Swal from "sweetalert2";

const EditSchedule = () => {
  const {
    mainSchedules,
    subschedules,
    saveSubSchedule,
    setSelectedSchedule,
    addMainSchedule,
    predefinedColors,
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

    // 화려한 SweetAlert2 알림
    Swal.fire({
      title: "✨ 수정 성공! ✨",
      text: "일정이 성공적으로 수정되었습니다.",
      icon: "success",
      timer: 1200, // 0.5초 후 자동 닫힘
      timerProgressBar: true,
      showConfirmButton: false,
      background: "linear-gradient(145deg, #f0f0f0, #e0e0e0)",
      position: "top",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-xl font-bold text-indigo-700",
        htmlContainer: "text-gray-100",
      },
    });

    console.log("저장 완료:", scheduleToSave);

    closeSidebar();
  };

  const updateModalState = (key, value) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  const formatLocalDateTime = (date) => {
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const incrementDuration = () => {
    updateModalState("endTime", addMinutes(modalState.endTime, 15));
  };

  const decrementDuration = () => {
    if (modalState.endTime > addMinutes(modalState.startTime, 15)) {
      updateModalState("endTime", subMinutes(modalState.endTime, 15));
    }
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
        <label className="w-1/2 flex items-center space-x-1 cursor-pointer ml-2">
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
            className=" text-[13px] text-gray-700"
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

      {/* 시간 조정 */}
      <div className="flex items-center justify-center my-4">
        <div className="flex items-center space-x-4">
          <FaMinusCircle
            className="text-[#312a7a] text-3xl cursor-pointer"
            onClick={decrementDuration}
          />
          <span className="text-gray-700 text-sm">15 mins</span>
          <FaPlusCircle
            className="text-[#312a7a] text-3xl cursor-pointer"
            onClick={incrementDuration}
          />
        </div>
      </div>

      {/* 날짜 수정 */}
      <div className="mb-4 flex items-start space-x-1">
        <div className="flex flex-col w-1/2">
          <div className="flex">
            <label className="block text-sm text-gray-600 mb-1">
              시작 시간
            </label>
          </div>
          <input
            type="datetime-local"
            className="w-full text-xs p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
            value={formatLocalDateTime(modalState.startTime)}
            onChange={(e) =>
              updateModalState("startTime", new Date(e.target.value))
            }
          />
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex">
            <label className="block text-sm text-gray-600 mb-1">
              종료 시간
            </label>
          </div>
          <input
            type="datetime-local"
            className="w-full text-xs p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#312a7a]"
            value={formatLocalDateTime(modalState.endTime)}
            onChange={(e) =>
              updateModalState("endTime", new Date(e.target.value))
            }
          />
        </div>
      </div>

      {/* 설명 수정 */}
      <div className="mb-4 flex flex-col items-start">
        <label className="block text-sm text-gray-600 mb-1">설명</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded focus:outline-none resize-none focus:ring-2 focus:ring-[#312a7a]"
          rows={4}
          value={modalState.description}
          onChange={(e) => updateModalState("description", e.target.value)}
        />
      </div>

      {/* 색상 */}
      <div className="flex items-center space-x-2 relative">
        <span className="text-sm text-gray-600">색상</span>

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
            {predefinedColors.map((c) => (
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
