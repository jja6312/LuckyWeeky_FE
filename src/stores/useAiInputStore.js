import { create } from "zustand";
import { format, addDays } from "date-fns";

// Helper to generate dummy schedule data
const generateDummySchedules = (startDateTime, endDateTime) => {
  const schedules = [];
  let currentDate = new Date(startDateTime);

  while (currentDate <= new Date(endDateTime)) {
    const daySchedule = {
      dayName: format(currentDate, "EEEE"),
      tasks: [
        {
          mainScheduleTitle: "헬스장 가기",
          subScheduleTitle: "유산소 운동",
          start_time: "16:00",
          end_time: "17:30",
          description: "런닝머신과 사이클 운동",
          color: "#FF5733", // 기본 색상 추가
        },
        {
          mainScheduleTitle: "독서하기",
          subScheduleTitle: "개발 서적 읽기",
          start_time: "19:00",
          end_time: "20:30",
          description: "프로그래밍 언어 심화 학습",
          color: "#FF5733", // 기본 색상 추가
        },
      ],
    };

    schedules.push(daySchedule);
    currentDate = addDays(currentDate, 1);
  }

  return schedules;
};

const today = new Date();
const oneWeekLater = addDays(today, 7);

const useAiInputStore = create((set, get) => ({
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

  dummySchedule: [],

  validateField: (key, value) => {
    const { formData } = get();
    let error = "";

    if (key === "startDateTime" && !value.trim()) {
      error = "시작 시간을 입력해주세요.";
    } else if (key === "endDateTime") {
      if (!value.trim()) {
        error = "종료 시간을 입력해주세요.";
      } else if (new Date(value) <= new Date(formData.startDateTime)) {
        error = "종료 시간은 시작 시간보다 나중이어야 합니다.";
      }
    } else if (key === "task" && !value.trim()) {
      error = "해야 할 일을 입력해주세요.";
    } else if (key === "availableTime" && !value.trim()) {
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
    const fields = Object.keys(formData);
    let isValid = true;

    fields.forEach((key) => {
      validateField(key, formData[key]);
      if (get().errors[key]) {
        isValid = false;
      }
    });

    return isValid;
  },

  setField: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),

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

  generateDummySchedule: () => {
    const { formData } = get();

    if (!formData?.startDateTime || !formData?.endDateTime) {
      console.error("Invalid formData. Cannot generate schedules.");
      return;
    }

    const schedule = generateDummySchedules(
      formData.startDateTime,
      formData.endDateTime
    );
    set({ dummySchedule: schedule });
  },

  // 일정 색상 업데이트
  updateTaskColors: (color) => {
    const { dummySchedule } = get();
    const updatedSchedule = dummySchedule.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => ({
        ...task,
        color,
      })),
    }));
    set({ dummySchedule: updatedSchedule });
  },

  // 음성 입력 관련 상태와 메서드 추가
  recording: false,
  transcription: "",
  visualEffect: false,

  startRecording: () => {
    set({ recording: true, transcription: "", visualEffect: true });
    console.log("Recording started");
    setTimeout(() => set({ visualEffect: false }), 300);
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

  clearTranscription: () => set({ transcription: "" }),
}));

export default useAiInputStore;
