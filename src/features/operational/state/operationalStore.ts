import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type OperationalTab = 'absence' | 'picket' | 'thematic';

interface OperationalState {
  activeTab: OperationalTab;
  showInfo: boolean;
  checked: Record<string, boolean>;
  recordIds: Record<string, string>;
  loading: boolean;
  error: Error | null;
  setActiveTab: (tab: OperationalTab) => void;
  setShowInfo: (show: boolean) => void;
  setChecked: (map: Record<string, boolean>) => void;
  setRecordIds: (map: Record<string, string>) => void;
  toggleChecked: (key: string, id?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

const initialState = {
  activeTab: 'absence' as OperationalTab,
  showInfo: false,
  checked: {} as Record<string, boolean>,
  recordIds: {} as Record<string, string>,
  loading: false,
  error: null as Error | null,
};

export const useOperationalStore = create<OperationalState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowInfo: (show) => set({ showInfo: show }),
      setChecked: (map) => set({ checked: map }),
      setRecordIds: (map) => set({ recordIds: map }),
      toggleChecked: (key, id) => {
        const isNowChecked = !get().checked[key];
        const nextChecked = { ...get().checked, [key]: isNowChecked };

        const nextRecordIds = { ...get().recordIds };
        if (!isNowChecked) {
          delete nextRecordIds[key];
        } else if (id) {
          nextRecordIds[key] = id;
        }

        set({ checked: nextChecked, recordIds: nextRecordIds });
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    { name: 'OperationalStore' }
  )
);
