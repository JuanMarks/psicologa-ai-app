// store/dashboardStore.ts

import { create } from 'zustand';
import { DashboardData, DiscScores } from '../types/types';



// Interface para a nossa store
interface DashboardState {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
}

// Criando a store com Zustand
export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: null,
  setDashboardData: (data) => set({ dashboardData: data }),
}));