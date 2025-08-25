// types.ts

export interface DiscScores {
  d: number;
  i: number;
  s: number;
  c: number;
}

export interface DashboardData {
  introducao: string;
  perfilNatural: {
    titulo: string;
    descricaoGeral: string;
    exposicaoCaracteristicas: {
      marcantes: string;
      necessidade: string;
      habilidades: string[];
      emocaoMedo: {
        emocao: string;
        medo: string;
      };
    };
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
    pontosMelhoriaAcionaveis: string[];
  };
  analiseGrafico: {
    tipo: string;
    descricao: string;
    sobStress: string;
    zonaDeRisco: string;
  };
  perfilAdaptado: {
    exigenciasDoMeio: Array<{
      fator: 'D' | 'I' | 'S' | 'C';
      movimento: 'SOBE' | 'DESCE' | 'ESTÁVEL';
      descricao: string;
    }>;
    analiseDasMudancas: Array<{
      titulo: string;
      causas: string[];
    }>;
  };
  conclusao: string;
  scores: { // Adicionamos os scores aqui para os gráficos
    natural: DiscScores;
    adaptado: DiscScores;
  };
}