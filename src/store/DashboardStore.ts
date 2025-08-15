// store/dashboardStore.ts

import { create } from 'zustand';

// Interface para os dados do dashboard (a mesma que definimos antes)
interface DiscScores {
	d: number;
	i: number;
	s: number;
	c: number;
}

interface DashboardData {
  introducao: string;
  analisePerfilNatural: {
    scores: DiscScores;
    fatorAltoPrincipal: string;
    fatorBaixoPrincipal: string;
    tituloPerfil: string;
    descricaoPerfil: string;
    exposicaoCaracteristicas: Array<{
      titulo: string;
      texto: string;
    }>;
    pontosFortes: {
      emocoes: string[];
      relacionamentos: string[];
      atividades: string[];
    };
    pontosMelhorar: {
      emocoes: string[];
      relacionamentos: string[];
      atividades: string[];
    };
    analiseFormaGrafico: {
      tipo: string;
      descricao: string;
    };
  };
  analisePerfilAdaptado: {
    scores: DiscScores;
    exigenciasDoMeio: string[];
  };
  estiloDeLideranca: {
    titulo: string;
    pontosFortes: string[];
    comportamentosTrabalhar: string[];
  };
  conclusao: string;
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