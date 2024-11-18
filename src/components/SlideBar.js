// components/SlideBar.js
import React from "react";
import {
  FaCalendarPlus,
  FaRegListAlt,
  FaUserFriends,
  FaChevronLeft,
} from "react-icons/fa";
import IconButton from "./IconButton";
import SlideContent from "./SlideContent";
import useStore from "../stores/useStore";

const SlideBar = () => {
  const { isSidebarOpen, selectedIcon, toggleSidebar, setSelectedIcon } =
    useStore();

  const icons = [
    { name: "aiAddSchedule", icon: FaCalendarPlus, label: "AI 일정 추가" },
    { name: "detailSchedule", icon: FaRegListAlt, label: "상세 일정" },
    { name: "friendManagement", icon: FaUserFriends, label: "친구 관리" },
  ];

  return (
    <div className="h-full fixed top-0 left-0 z-20 pt-[65px] hidden md:block">
      <div className="relative h-full">
        {/* Slide-Out Content */}
        <SlideContent
          isSidebarOpen={isSidebarOpen}
          selectedIcon={selectedIcon}
        />

        {/* Icon Section */}
        <div
          className={`flex flex-col items-center  w-16 bg-[#463198] text-white h-full relative transition-all duration-300 ${
            isSidebarOpen ? "ml-96" : ""
          }`}
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
        >
          {/* Close Button */}
          {isSidebarOpen && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#463198] rounded-full p-2 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
          )}

          {/* Icons */}
          <div className="w-full flex flex-col items-center ">
            {icons.map((item) => (
              <IconButton
                key={item.name}
                icon={item.icon}
                isSelected={selectedIcon === item.name}
                onClick={(e) => {
                  e.stopPropagation();
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
