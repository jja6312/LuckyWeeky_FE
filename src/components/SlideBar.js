import React from "react";
import {
  FaCalendarPlus,
  FaRegListAlt,
  FaUserFriends,
  FaChevronLeft,
} from "react-icons/fa";
import IconButton from "./IconButton";
import useStore from "../stores/useStore";

const SlideBar = () => {
  const {
    isSidebarOpen,
    selectedIcon,
    setSelectedIcon,
    setIsSidebarOpen,
    closeSidebar,
  } = useStore();

  const icons = [
    { name: "addSchedule", icon: FaCalendarPlus, label: "AI 일정 추가" },
    { name: "detailSchedule", icon: FaRegListAlt, label: "상세 일정" },
    { name: "friendManagement", icon: FaUserFriends, label: "친구 관리" },
  ];

  const handleBarClick = () => {
    if (!isSidebarOpen) {
      // 사이드바가 닫혀 있을 때 기본값(AI 일정 추가) 설정
      setSelectedIcon("addSchedule");
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false); // 열려 있을 때는 닫기
    }
  };

  return (
    <div className="h-full fixed top-0 left-0 z-20 pt-[65px] hidden md:block">
      <div className="relative h-full">
        {/* Slide-Out Content */}
        <div
          className={`bg-slate-200 p-4 h-full w-96 transition-transform duration-300 absolute top-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {selectedIcon === "addSchedule" && (
            <div>
              <h2 className="text-xl font-bold mb-4">AI 캘린더 일정 추가</h2>
              <p>AI를 활용하여 빠르게 일정을 추가하세요.</p>
            </div>
          )}
          {selectedIcon === "detailSchedule" && (
            <div>
              <h2 className="text-xl font-bold mb-4">상세 일정</h2>
              <p>일정의 세부 정보를 확인하거나 편집할 수 있습니다.</p>
            </div>
          )}
          {selectedIcon === "friendManagement" && (
            <div>
              <h2 className="text-xl font-bold mb-4">친구 관리</h2>
              <p>친구를 추가하거나 관리할 수 있습니다.</p>
            </div>
          )}
        </div>

        {/* Icon Section */}
        <div
          className={`flex flex-col items-center py-4 w-16 bg-[#463198] text-white h-full relative transition-all duration-300 ${
            isSidebarOpen ? "ml-96" : ""
          }`}
          onClick={handleBarClick} // 빈 바 클릭 이벤트 추가
          style={{ cursor: "pointer" }} // 커서 포인터 추가
        >
          {/* Close Button */}
          {isSidebarOpen && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#463198] rounded-full p-2 shadow-lg"
              onClick={closeSidebar}
              style={{ cursor: "pointer" }} // 커서 스타일 추가
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
          )}

          {/* Icons */}
          <div className="flex flex-col items-center space-y-6 mt-2">
            {icons.map((item) => (
              <IconButton
                key={item.name}
                icon={item.icon}
                isSelected={selectedIcon === item.name}
                onClick={(e) => {
                  e.stopPropagation(); // 아이콘 클릭 이벤트가 빈 바 클릭 이벤트와 충돌하지 않도록 방지
                  setSelectedIcon(item.name);
                }}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideBar;
