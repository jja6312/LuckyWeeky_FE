import { create } from "zustand";

const useStore = create((set) => ({
  selectedIcon: null,
  lastSelectedIcon: null, // 마지막 선택된 아이콘 상태 추가

  setSelectedIcon: (icon) =>
    set((state) => ({
      selectedIcon: icon,
      lastSelectedIcon: icon, // 아이콘을 선택할 때 마지막 아이콘 정보 업데이트
      isSidebarOpen: true, // 사이드바를 자동으로 엶
    })),

  isSidebarOpen: false,
  setIsSidebarOpen: (isOpen) =>
    set((state) => ({
      isSidebarOpen: isOpen,
      selectedIcon: isOpen ? state.lastSelectedIcon : null, // 열릴 때 마지막 아이콘 유지
    })),

  closeSidebar: () =>
    set((state) => ({
      isSidebarOpen: false,
      selectedIcon: null, // 사이드바를 닫으면 아이콘 선택 초기화
    })),

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
      selectedIcon: !state.isSidebarOpen
        ? state.lastSelectedIcon // 열릴 때 마지막 아이콘 유지
        : null, // 닫힐 때 아이콘 선택 해제
    })),

  currentWeek: new Date(),
  setPrevWeek: () =>
    set((state) => ({
      currentWeek: new Date(
        state.currentWeek.setDate(state.currentWeek.getDate() - 7)
      ),
    })),
  setNextWeek: () =>
    set((state) => ({
      currentWeek: new Date(
        state.currentWeek.setDate(state.currentWeek.getDate() + 7)
      ),
    })),
  setWeek: (date) => set({ currentWeek: date }),
  selectedColor: "#eeeaff",
  setSelectedColor: (color) => set({ selectedColor: color }),
}));

export default useStore;
