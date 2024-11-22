import React from "react";
import SlideTitle from "./SlideTitle";
import useAiInputStore from "../stores/useAiInputStore";
import AIAddText from "./AIAddText";
import AIAddVoice from "./AIAddVoice";

const AIAddSchedule = () => {
  const { mode, toggleMode } = useAiInputStore(); // Zustand에서 상태 가져오기

  return (
    <div className="p-4 bg-white  h-full shadow-lg rounded-lg max-w-md mx-auto">
      <div className="flex w-full justify-between mb-3">
        <SlideTitle title="🤖AI 일정 추가" />
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Text</span>
          <div
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              mode === "text" ? "bg-yellow-300" : "bg-blue-500"
            }`}
            onClick={toggleMode}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                mode === "text" ? "translate-x-0" : "translate-x-7"
              }`}
            ></div>
          </div>
          <span className="text-sm text-gray-600 ml-2">Voice</span>
        </div>
      </div>

      {/* 텍스트 모드와 음성 모드 분기 */}
      {mode === "text" ? <AIAddText /> : <AIAddVoice />}
    </div>
  );
};

export default AIAddSchedule;
