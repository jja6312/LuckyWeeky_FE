import { create } from "zustand";
import { persist } from "zustand/middleware";

// useScheduleStore.js
const useScheduleStore = create(
  persist(
    (set, get) => ({
      predefinedColors: [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FF33A8",
        "#FF8C33",
        "#8D33FF",
        "#33FFF5",
        "#FF3333",
      ],
      // 메인 일정
      mainSchedules: [
        {
          main_schedule_id: 1,
          user_id: 101,
          title: "도커 공부",
          start_time: new Date("2023-11-16T09:00:00"),
          end_time: new Date("2029-11-16T10:00:00"),
          color: "#FF5733",
          created_at: new Date("2023-11-01T12:00:00"),
          updated_at: new Date("2023-11-10T12:00:00"),
        },
        {
          main_schedule_id: 2,
          user_id: 101,
          title: "스프링 공부",
          start_time: new Date("2023-11-16T09:00:00"),
          end_time: new Date("2029-11-16T10:00:00"),
          color: "#FF5733",
          created_at: new Date("2023-11-01T12:00:00"),
          updated_at: new Date("2023-11-10T12:00:00"),
        },
      ],

      currentDate: new Date(), // 현재 날짜

      // 선택된 일정
      selectedSchedule: null,
      setSelectedSchedule: (schedule) => {
        console.log("Setting selected schedule:", schedule);
        set({ selectedSchedule: schedule || null });
      },

      // 서브 일정 관리
      subschedules: [],

      // 서브 일정 초기화
      initializeSubSchedules: (schedules) => {
        set(() => ({
          subschedules: schedules,
        }));
      },

      // 새로운 서브 일정 추가
      saveSubSchedule: (subschedule) =>
        set((state) => ({
          subschedules: [...state.subschedules, subschedule],
        })),

      // 메인 일정 추가
      addMainSchedule: (schedule) =>
        set((state) => ({
          mainSchedules: [...state.mainSchedules, schedule],
        })),

      // 기존 메인 일정 업데이트
      updateMainSchedule: (updatedSchedule) =>
        set((state) => ({
          mainSchedules: state.mainSchedules.map((schedule) =>
            schedule.main_schedule_id === updatedSchedule.main_schedule_id
              ? { ...schedule, ...updatedSchedule }
              : schedule
          ),
        })),

      // 메인 일정 삭제
      deleteMainSchedule: (scheduleId) =>
        set((state) => ({
          mainSchedules: state.mainSchedules.filter(
            (schedule) => schedule.main_schedule_id !== scheduleId
          ),
        })),

      // 지난 일정 보기 상태 토글
      showPastSchedules: false,
      toggleShowPastSchedules: () =>
        set((state) => ({ showPastSchedules: !state.showPastSchedules })),
    }),
    {
      name: "schedule-storage",
      getStorage: () => localStorage,
      serialize: (state) =>
        JSON.stringify(state, (key, value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }),
      deserialize: (str) =>
        JSON.parse(str, (key, value) => {
          const dateKeys = [
            "start_time",
            "end_time",
            "created_at",
            "updated_at",
          ];
          if (dateKeys.includes(key) && typeof value === "string") {
            return new Date(value);
          }
          return value;
        }),
    }
  )
);

export default useScheduleStore;
