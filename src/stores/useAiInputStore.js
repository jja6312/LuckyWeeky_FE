import { create } from "zustand";
import { format, addDays } from "date-fns";

// 오늘과 1주일 후 날짜 설정
const today = new Date();
const oneWeekLater = addDays(today, 7);

const useAiInputStore = create((set, get) => ({
  // 모드 상태 (text/voice)
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

  // 에러 상태
  errors: {
    startDateTime: "",
    endDateTime: "",
    task: "",
    availableTime: "",
  },

  // AI 생성된 일정 데이터 배열
  schedules: [],

  // 폼 유효성 검사
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

  // 서버에서 받은 데이터를 schedules 배열에 추가
  pushToSchedules: (response) => {
    const { result, schedule } = response;
    if (result === "true") {
      const formattedSchedule = {
        mainTitle: schedule.mainTitle,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        subSchedules: schedule.subSchedules.map((sub) => ({
          title: sub.title,
          startTime: sub.startTime,
          endTime: sub.endTime,
        })),
      };

      console.log("Formatted Schedule:", formattedSchedule); // 포맷팅된 데이터 확인

      set((state) => ({
        schedules: [...state.schedules, formattedSchedule],
      }));
    } else {
      console.error("Invalid schedule response:", response);
    }
  },

  resetSchedules: () => set({ schedules: [] }),

  // 기존 일정 덮어쓰기
  replaceSchedule: (response) => {
    const { result, schedule } = response;
    if (result === "true") {
      const updatedSchedule = {
        mainTitle: schedule.mainTitle,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        subSchedules: schedule.subSchedules.map((sub) => ({
          title: sub.title,
          startTime: sub.startTime,
          endTime: sub.endTime,
        })),
      };

      console.log("Updated Schedule:", updatedSchedule); // 덮어쓴 데이터 확인

      set((state) => {
        const updatedSchedules = state.schedules.map((existingSchedule) =>
          existingSchedule.id === schedule.id
            ? updatedSchedule // 같은 ID인 경우 덮어쓰기
            : existingSchedule
        );
        return { schedules: updatedSchedules };
      });
    } else {
      console.error("Invalid schedule response:", response);
    }
  },

  resetSchedules: () => set({ schedules: [] }),

  // 음성 입력 관련 상태와 메서드 추가
  recording: false,
  transcription: "",
  visualEffect: false,

  startRecording: () =>
    set({ recording: true, transcription: "", visualEffect: true }),
  stopRecording: () => set({ recording: false, visualEffect: false }),
  setTranscription: (text) => set({ transcription: text }), // STT 결과 업데이트
  clearTranscription: () => set({ transcription: "" }),
}));

export default useAiInputStore;
