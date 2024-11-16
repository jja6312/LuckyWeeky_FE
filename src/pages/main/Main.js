// Main.js
import React from "react";
import Header from "../../components/Header";
import SlideBar from "../../components/SlideBar";
import Calendar from "../../components/Calendar";
import useStore from "../../stores/useStore";

const Main = () => {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Section */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <SlideBar />

        {/* Calendar Section */}
        <div
          className={`flex-grow p-4 transition-all duration-300 ${
            isSidebarOpen ? "ml-[24rem]" : "ml-16"
          }`}
        >
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Main;
