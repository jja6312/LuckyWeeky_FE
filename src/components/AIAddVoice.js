import React, { useRef, useState } from "react";
import useAiInputStore from "../stores/useAiInputStore";
import useStore from "../stores/useStore";
import { handleRecording } from "../api/scheduleAi/handleRecording";
import { createAiSchedule } from "../api/scheduleAi/createAiSchedule";
import Logo from "../assets/logo/logo.png";
import "../css/AIAddVoice.css";

const AIAddVoice = () => {
  const {
    recording,
    transcription,
    visualEffect,
    pushToSchedules,
    startRecording,
    stopRecording,
    resetForm,
    setTranscription,
  } = useAiInputStore();

  const { setSelectedIcon } = useStore();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const handleStartRecording = async () => {
    try {
      startRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        try {
          const transcription = await handleRecording(audioBlob);
          setTranscription(transcription);
          if (transcription && transcription.result === "true") {
            pushToSchedules({
              result: transcription.result,
              schedule: transcription.schedule,
            });
            setSelectedIcon("suggestionSchedule");
          } else {
            alert("음성을 더 크게 녹음해주세요.");
          }
        } catch (error) {
          console.error("STT failed:", error);
        } finally {
          setLoading(false); // 로딩 종료
          stopRecording();
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
    } catch (error) {
      alert("녹음 시작에 실패했습니다. 마이크 권한을 확인해주세요.");
    }
  };

  const handleStopRecording = () => {
    if (loading) return; // 이미 로딩 중일 때 추가 작업 방지
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      setLoading(true); // 로딩 상태 활성화
      mediaRecorderRef.current.stop();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">🎙️ 음성 입력</h2>

      {/* 녹음 버튼 */}
      <div
        className={`recording-button flex items-center justify-center w-20 h-20 rounded-full cursor-pointer transition-all ${
          recording
            ? loading
              ? "bg-gradient-to-r from-green-500 via-green-600 to-green-500 animate-spin"
              : "bg-green-600"
            : "bg-red-500 hover:bg-blue-200"
        }`}
        onClick={recording ? handleStopRecording : handleStartRecording}
      >
        {!loading && (
          <img
            src={Logo}
            alt="logo"
            className={`w-full ${recording && "opacity-0"}`}
          />
        )}
      </div>

      {/* 상태 메시지 */}
      <div
        className={`mt-4 flex items-center justify-center ${
          recording ? "text-red-600" : "text-gray-600"
        }`}
      >
        {recording
          ? loading
            ? "로딩 중..."
            : "녹음 중..."
          : "클릭하여 녹음 시작"}
        {/* ? 버튼 */}
        <div
          className="floating-icon ml-2 rounded-full bg-gray-500 w-6 h-6 text-white flex justify-center items-center text-lg cursor-pointer"
          onClick={toggleDropdown}
        >
          ?
        </div>
      </div>

      {/* 음성 인식 결과 */}
      {transcription && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">음성 인식 결과:</h3>
          <p className="mt-2 text-gray-800">{transcription}</p>
          <button
            className="w-full bg-[#312a7a] text-white rounded p-2 hover:opacity-80 transition"
            onClick={() => {
              createAiSchedule({
                formData: { transcription },
                validateAll: () => true,
                resetForm,
                setSelectedIcon,
              });
            }}
          >
            분석 시작
          </button>
        </div>
      )}

      {/* 드롭다운 */}
      {isDropdownOpen && (
        <div className="dropdown mt-4">
          <div className="flex flex-col border-2 border-gray-300 rounded-lg p-4">
            <p className="font-semibold text-gray-500 pb-4">녹음 예시</p>
            <div className="flex flex-col items-start text-sm space-y-4">
              <p className="flex flex-col items-start">
                <span>1️⃣ 어떤 일정? :</span>
                <span className="text-gray-500">➡ 헬스장 가려고하는데</span>
              </p>
              <p className="flex flex-col items-start">
                <span>2️⃣ 언제까지? :</span>
                <span className="text-gray-500">➡ 일주일 내내</span>
              </p>
              <p className="flex flex-col items-start">
                <span>3️⃣ 가능한 시간은? :</span>
                <span className="text-gray-500">➡ 하루 1시간</span>
              </p>
              <p className="flex flex-col items-start">
                <span>4️⃣ 구체적인 일정이 있나요? :</span>
                <span className="text-gray-500">
                  ➡ 3분할로 운동할 예정이야.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAddVoice;
