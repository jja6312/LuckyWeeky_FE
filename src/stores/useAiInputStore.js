import { create } from "zustand";
import { format, addDays } from "date-fns";

const today = new Date();
const oneWeekLater = addDays(today, 7);

const useAiInputStore = create((set, get) => ({
  // 모드 상태
  mode: "text",
  toggleMode: () =>
    set((state) => ({ mode: state.mode === "text" ? "voice" : "text" })),

  // 폼 데이터
  formData: {
    startDateTime: format(today, "yyyy-MM-dd'T'HH:mm"),
    endDateTime: format(oneWeekLater, "yyyy-MM-dd'T'HH:mm"),
    task: "",
    availableTime: "",
    additionalNotes: "",
  },
  errors: {
    startDateTime: "",
    endDateTime: "",
    task: "",
    availableTime: "",
  },
  setField: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),
  validateField: (key, value) => {
    let error = "";
    const { formData } = get();

    if (key === "startDateTime" && !value.trim()) {
      error = "시작 시간을 입력해주세요.";
    }
    if (key === "endDateTime") {
      if (!value.trim()) {
        error = "종료 시간을 입력해주세요.";
      } else if (new Date(value) <= new Date(formData.startDateTime)) {
        error = "종료 시간은 시작 시간보다 나중이어야 합니다.";
      }
    }
    if (key === "task" && !value.trim()) {
      error = "해야 할 일을 입력해주세요.";
    }
    if (key === "availableTime" && !value.trim()) {
      error = "수행 가능 시간을 입력해주세요.";
    }

    set((state) => ({
      errors: {
        ...state.errors,
        [key]: error,
      },
    }));
  },
  validateAll: () => {
    const { formData, validateField } = get();
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (get().errors[key]) {
        isValid = false;
      }
    });

    return isValid;
  },
  resetForm: () =>
    set(() => ({
      formData: {
        startDateTime: format(today, "yyyy-MM-dd'T'HH:mm"),
        endDateTime: format(oneWeekLater, "yyyy-MM-dd'T'HH:mm"),
        task: "",
        availableTime: "",
        additionalNotes: "",
      },
      errors: {
        startDateTime: "",
        endDateTime: "",
        task: "",
        availableTime: "",
      },
    })),

  // 음성 입력 상태
  recording: false,
  transcription: "",
  visualEffect: false,
  startRecording: () => {
    set({ recording: true, transcription: "", visualEffect: true });
    console.log("Recording started");
    setTimeout(() => set({ visualEffect: false }), 300); // 짧은 효과
  },
  stopRecording: () => {
    const dummyTranscription = "예시로 받아온 음성 텍스트"; // 예시 텍스트
    set({
      recording: false,
      visualEffect: false,
      transcription: dummyTranscription,
    });
    console.log("Recording stopped");
  },
}));

export default useAiInputStore;
