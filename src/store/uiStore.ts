import { create } from 'zustand';

interface UIState {
  showAlerts: boolean;
  showZones: boolean;
  sidebarOpen: boolean;
  addingPointMode: boolean;
  addingAlertMode: boolean;
  drawingZoneMode: boolean;
  selectedPointId: string | null;
  hiddenCategoryIds: Set<string>;

  toggleAlerts: () => void;
  toggleZones: () => void;
  toggleSidebar: () => void;
  setAddingPointMode: (v: boolean) => void;
  setAddingAlertMode: (v: boolean) => void;
  setDrawingZoneMode: (v: boolean) => void;
  setSelectedPointId: (id: string | null) => void;
  clearInteractionModes: () => void;
  toggleCategoryVisibility: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showAlerts: true,
  showZones: true,
  sidebarOpen: true,
  addingPointMode: false,
  addingAlertMode: false,
  drawingZoneMode: false,
  selectedPointId: null,
  hiddenCategoryIds: new Set<string>(),

  toggleAlerts: () => set((s) => ({ showAlerts: !s.showAlerts })),
  toggleZones: () => set((s) => ({ showZones: !s.showZones })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleCategoryVisibility: (id) =>
    set((s) => {
      const next = new Set(s.hiddenCategoryIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { hiddenCategoryIds: next };
    }),
  setAddingPointMode: (v) =>
    set({ addingPointMode: v, addingAlertMode: false, drawingZoneMode: false }),
  setAddingAlertMode: (v) =>
    set({ addingAlertMode: v, addingPointMode: false, drawingZoneMode: false }),
  setDrawingZoneMode: (v) =>
    set({ drawingZoneMode: v, addingPointMode: false, addingAlertMode: false }),
  setSelectedPointId: (id) => set({ selectedPointId: id }),
  clearInteractionModes: () =>
    set({ addingPointMode: false, addingAlertMode: false, drawingZoneMode: false }),
}));
