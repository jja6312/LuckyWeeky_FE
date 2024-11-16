import { create } from "zustand";

const useStore = create((set) => ({
  selectedIcon: null,
  lastSelectedIcon: null, // 마지막 선택된 아이콘 상태 추가
  setSelectedIcon: (icon) =>
    set((state) => ({
      selectedIcon: icon,
      lastSelectedIcon: icon,
      isSidebarOpen: true,
    })), // 아이콘 클릭 시 상태 변경 및 열림
  isSidebarOpen: false,
  setIsSidebarOpen: (isOpen) =>
    set((state) => ({
      isSidebarOpen: isOpen,
      selectedIcon: isOpen ? state.lastSelectedIcon : null, // 열릴 때 마지막 선택된 아이콘 유지
    })),
  closeSidebar: () => set({ isSidebarOpen: false, selectedIcon: null }), // 닫으면 선택 초기화

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
