// store/dashboardStore.ts

import { create } from 'zustand';

// Interface para os dados do dashboard (a mesma que definimos antes)
interface DashboardData {
  relatorioTextual: { 
	resumoPerfil: string;
	nomePerfil: string;
	pontosFortes: { ponto: string; descricao: string; }[];
	pontosDesenvolvimento: { ponto: string; descricao: string; }[];
	planoDeAcao: {
		livro: { titulo: string; justificativa: string; };
		comportamentos: { desafio: string; sugestao: string; }[];
	};
	mensagemFinal: string;
   };
  dadosQuantitativos: {
    scores: { d: number; i: number; s: number; c: number; };
    palavrasChave: string[];
    pontosChave: { competencia: string; pontuacao: number; }[];
  };
}

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