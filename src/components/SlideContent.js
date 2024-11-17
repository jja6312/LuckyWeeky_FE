import React, { useEffect } from "react";
import useScheduleStore from "../stores/useScheduleStore";
import DetailSchedule from "./DetailSchedule";

const SlideContent = ({ isSidebarOpen, selectedIcon }) => {
  const selectedSchedule = useScheduleStore((state) => state.selectedSchedule);

  useEffect(() => {
    console.log(
      "SlideContent rendered with selectedSchedule:",
      selectedSchedule
    );
  }, [selectedSchedule]);

  const contentMap = {
    addSchedule: {
      title: "AI 캘린더 일정 추가",
      description: "AI를 활용하여 빠르게 일정을 추가하세요.",
    },
    detailSchedule: {
      title: selectedSchedule?.title || "상세 일정",
      description: "일정의 세부 정보를 확인하거나 편집할 수 있습니다.",
    },
    friendManagement: {
      title: "친구 관리",
      description: "친구를 추가하거나 관리할 수 있습니다.",
    },
  };

  const content = contentMap[selectedIcon];

  return (
    <div
      className={`bg-slate-200 p-4 h-full w-96 transition-transform duration-300 absolute top-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {content ? (
        <>
          {/* 상세 일정 컴포넌트 렌더링 */}
          {selectedIcon === "detailSchedule" && <DetailSchedule />}
        </>
      ) : null}
    </div>
  );
};

export default SlideContent;
