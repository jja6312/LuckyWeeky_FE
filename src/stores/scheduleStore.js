// stores/useScheduleStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useScheduleStore = create(
  persist(
    (set, get) => ({
      // Main schedules reflecting the database structure
      mainSchedules: [
        {
          main_schedule_id: 1,
          user_id: 101,
          title: "목표 추가",
          start_time: new Date("2023-11-16T09:00:00"),
          end_time: new Date("2029-11-16T10:00:00"),
          color: "#FF5733",
          created_at: new Date("2023-11-01T12:00:00"),
          updated_at: new Date("2023-11-10T12:00:00"),
        },
        {
          main_schedule_id: 2,
          user_id: 102,
          title: "기본일정",
          start_time: new Date("2023-11-17T14:00:00"),
          end_time: new Date("2029-11-17T15:00:00"),
          color: "#33FF57",
          created_at: new Date("2023-11-05T10:00:00"),
          updated_at: new Date("2023-11-10T14:00:00"),
        },
        {
          main_schedule_id: 3,
          user_id: 101,
          title: "도커공부",
          start_time: new Date("2023-11-18T16:00:00"),
          end_time: new Date("2026-11-18T17:00:00"),
          color: "#3357FF",
          created_at: new Date("2023-11-06T14:00:00"),
          updated_at: new Date("2023-11-12T16:00:00"),
        },
        {
          main_schedule_id: 4,
          user_id: 101,
          title: "스프링공부",
          start_time: new Date("2023-11-19T10:00:00"),
          end_time: new Date("2023-11-19T12:00:00"),
          color: "#FF33A8",
          created_at: new Date("2023-11-07T09:00:00"),
          updated_at: new Date("2023-11-13T11:00:00"),
        },
      ],

      currentDate: new Date(),

      // Selected schedule for operations
      selectedSchedule: null,
      setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule }),

      // Sub-schedules (if applicable)
      subschedules: [],

      // Save a new sub-schedule
      saveSubSchedule: (subschedule) =>
        set((state) => ({
          subschedules: [...state.subschedules, subschedule],
        })),

      // Add a new main schedule
      addMainSchedule: (schedule) =>
        set((state) => ({
          mainSchedules: [...state.mainSchedules, schedule],
        })),

      // Update an existing main schedule
      updateMainSchedule: (updatedSchedule) =>
        set((state) => ({
          mainSchedules: state.mainSchedules.map((schedule) =>
            schedule.main_schedule_id === updatedSchedule.main_schedule_id
              ? { ...schedule, ...updatedSchedule }
              : schedule
          ),
        })),

      // Delete a main schedule
      deleteMainSchedule: (scheduleId) =>
        set((state) => ({
          mainSchedules: state.mainSchedules.filter(
            (schedule) => schedule.main_schedule_id !== scheduleId
          ),
        })),

      // "지난 일정 포함" 상태 추가
      showPastSchedules: false,
      toggleShowPastSchedules: () =>
        set((state) => ({ showPastSchedules: !state.showPastSchedules })),
    }),
    {
      name: "schedule-storage", // unique name
      getStorage: () => localStorage, // specify storage
      serialize: (state) =>
        JSON.stringify(state, (key, value) => {
          if (value instanceof Date) {
            // Date 객체를 ISO 문자열로 변환
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
            // 특정 키의 ISO 문자열을 Date 객체로 변환
            return new Date(value);
          }
          return value;
        }),
    }
  )
);

export default useScheduleStore;
