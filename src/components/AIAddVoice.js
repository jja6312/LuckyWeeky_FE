import React from "react";
import useAiInputStore from "../stores/useAiInputStore";
import { handleAnalysis } from "../function/ai/handleAnalysis";
import useStore from "../stores/useStore";

const AIAddVoice = () => {
  const {
    recording,
    transcription,
    visualEffect,
    startRecording,
    stopRecording,
    resetForm,
  } = useAiInputStore();

  const { setSelectedIcon } = useStore();

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">🎙️ 음성 입력</h2>

      {/* 녹음 버튼 */}
      <div
        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform ${
          recording ? "bg-red-500 animate-pulse" : "bg-blue-500"
        } ${visualEffect ? "scale-110" : "scale-100"}`}
        onClick={recording ? stopRecording : startRecording}
      >
        <span className="text-white text-2xl">{recording ? "🔴" : "🎤"}</span>
      </div>

      <p className="mt-4 text-gray-600">
        {recording ? "녹음 중..." : "클릭하여 녹음 시작"}
      </p>

      {/* 음성 인식 결과 */}
      {transcription && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">음성 인식 결과:</h3>
          <p className="mt-2 text-gray-800">{transcription}</p>
          {/* 제출 버튼 */}
          <button
            className="w-full bg-[#312a7a] text-white rounded p-2 hover:opacity-80 transition"
            onClick={() => {
              handleAnalysis({
                formData: { transcription }, // formData에 transcription만 포함
                validateAll: () => true, // 밸리데이션 항상 통과
                resetForm,
              });
              setSelectedIcon("suggestionSchedule");
            }}
          >
            분석 시작
          </button>
        </div>
      )}

      {/* 녹음 안내 */}
      <p className="mt-4 text-xs text-gray-400">
        음성을 클릭하면 녹음을 시작합니다.
      </p>
    </div>
  );
};

export default AIAddVoice;
