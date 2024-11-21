import React from "react";
import useAiInputStore from "../stores/useAiInputStore";

import useStore from "../stores/useStore";
import { handleRecording } from "../api/scheduleAi/handleRecording";
import { createAiSchedule } from "../api/scheduleAi/createAiSchedule";

const AIAddVoice = () => {
  const {
    recording,
    transcription,
    visualEffect,
    startRecording,
    stopRecording,
    resetForm,
    setTranscription,
  } = useAiInputStore();

  const { setSelectedIcon } = useStore();

  function audioBufferToWav(buffer) {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    let offset = 0;

    const writeString = (str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset, str.charCodeAt(i));
        offset += 1;
      }
    };

    const writeInt16 = (input, offset) => {
      for (let i = 0; i < input.length; i++, offset += 2) {
        view.setInt16(offset, input[i] * 0x7fff, true);
      }
    };

    // WAV Header
    writeString("RIFF");
    view.setUint32(offset, length - 8, true);
    offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numOfChannels, true);
    offset += 2;
    view.setUint32(offset, buffer.sampleRate, true);
    offset += 4;
    view.setUint32(offset, buffer.sampleRate * numOfChannels * 2, true);
    offset += 4;
    view.setUint16(offset, numOfChannels * 2, true);
    offset += 2;
    view.setUint16(offset, 16, true);
    offset += 2;
    writeString("data");
    view.setUint32(offset, length - 44, true);
    offset += 4;

    // Write PCM data
    for (let i = 0; i < numOfChannels; i++) {
      writeInt16(buffer.getChannelData(i), offset);
    }

    return bufferArray;
  }

  async function convertToWav(audioBlob) {
    const audioContext = new AudioContext();
    const audioData = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    const wavBuffer = audioBufferToWav(audioBuffer); // PCM 데이터로 변환
    console.log("Converted WAV Blob:", wavBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  }

  const handleStartRecording = async () => {
    try {
      console.log("Starting recording...");
      startRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");

      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log("Audio data available:", event.data);
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        console.log("Recording stopped");
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const wavBlob = await convertToWav(audioBlob);

        try {
          const transcription = await handleRecording(wavBlob);
          setTranscription(transcription);
          console.log("STT Transcription:", transcription);
        } catch (error) {
          console.error("STT failed:", error);
        } finally {
          stopRecording();
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      console.log("Recording started");

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          console.log("Recording forcibly stopped");
        }
      }, 5000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("녹음 시작에 실패했습니다. 마이크 권한을 확인해주세요.");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">🎙️ 음성 입력</h2>

      {/* 녹음 버튼 */}
      <div
        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform ${
          recording ? "bg-red-500 animate-pulse" : "bg-blue-500"
        } ${visualEffect ? "scale-110" : "scale-100"}`}
        onClick={recording ? stopRecording : handleStartRecording}
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
              createAiSchedule({
                formData: { transcription }, // formData에 transcription만 포함
                validateAll: () => true, // 밸리데이션 항상 통과
                resetForm,
                setSelectedIcon,
              });
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
