// app/dashboard/page.tsx
"use client";

import { FC, useEffect, useRef, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { useDashboardStore } from '../../store/DashboardStore';
import { useRouter } from 'next/navigation';

// Componentes de visualização de dados
import { RadarChart } from '../components/RadarCharts'; // Gráfico de Radar para o Perfil Natural
import { ComparisonBarChart } from '../components/ComparisonBarChart'; // NOVO GRÁFICO
import { StatCard } from '../components/StatCard';
import { InsightCard } from '../components/InsightCard'; // NOVO COMPONENTE DE CARD

// Ícones
import { FileText, BarChart2, TrendingUp, Users, BrainCircuit, BookOpen } from 'lucide-react';

// Lógica de PDF (NOVA ABORDAGEM)
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfDocument } from '../components/PdfComponent'; // NOSSO NOVO DOCUMENTO PDF
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

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

const DashboardPage: FC = () => {
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const router = useRouter();

  const radarChartRef = useRef<ChartJS<'radar'>>(null);
  const barChartRef = useRef<ChartJS<'bar'>>(null);

  const [radarChartImage, setRadarChartImage] = useState<string>('');
  const [barChartImage, setBarChartImage] = useState<string>('');

  // Redireciona para a home se não houver dados no store
  useEffect(() => {
    if (!dashboardData) {
      router.replace('/');
    }

    const timer = setTimeout(() => {
      // Processa o Gráfico de Radar
      if (radarChartRef.current) {
        const chart = radarChartRef.current;
        
        // 1. FORÇA um tamanho fixo para a captura
        chart.resize(1000, 800); 
        
        // 2. Captura a imagem no formato JPEG
        const image = chart.toBase64Image('image/jpeg', 0.9);
        setRadarChartImage(image);
        
        // 3. IMPORTANTE: Devolve o gráfico ao seu tamanho responsivo original
        chart.resize(); 
      }

      // Processa o Gráfico de Barras
      if (barChartRef.current) {
        const chart = barChartRef.current;
        
        // Repete o mesmo processo
        chart.resize(1000, 800);
        const image = chart.toBase64Image('image/jpeg', 0.9);
        setBarChartImage(image);
        chart.resize();
      }
    }, 500);


    return () => clearTimeout(timer);
  }, [dashboardData, router]);

  // Se os dados ainda não carregaram (ou após o redirecionamento), não renderiza nada
  if (!dashboardData) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <p className="text-gray-500">Carregando dados ou redirecionando...</p>
        </div>
    );
  }

  // Extraindo dados para facilitar o acesso
  const { analisePerfilNatural, analisePerfilAdaptado, estiloDeLideranca, introducao, conclusao } = dashboardData;

  return (
    <main className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho com o botão de Download */}
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Análise Comportamental</h1>
            <p className="text-slate-600 mt-1">{introducao}</p>
        </div>
        
        {/* BOTÃO DE DOWNLOAD COM A NOVA LÓGICA */}
        <PDFDownloadLink
          document={
            <PdfDocument 
              data={dashboardData} 
              radarChartImage={radarChartImage}
              barChartImage={barChartImage}
            />
          }
          fileName="relatorio-comportamental-disc.pdf"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg"
        >
          {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar Relatório PDF')}
        </PDFDownloadLink>
      </header>

      {/* Conteúdo do Dashboard */}
      <div className="space-y-8">
        {/* Seção de Análise do Perfil Natural */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Perfil Natural: Sua Essência</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Radar e Insights */}
            <div className="space-y-6">
                <div className="h-150 ms-10 mx-auto">
                   <RadarChart ref={radarChartRef} scores={analisePerfilNatural.scores} style={{ position: 'relative', zIndex: 10, height: 450, width: 700 }} />
                </div>
                <InsightCard 
                    title="Análise do Gráfico" 
                    insight={analisePerfilNatural.analiseFormaGrafico.tipo}
                    description={analisePerfilNatural.analiseFormaGrafico.descricao}
                    icon={<BrainCircuit />}
                />
            </div>
            {/* Cards de Pontos Fortes e a Melhorar */}
            <div className="space-y-4">
                <StatCard title="Perfil Principal" value={analisePerfilNatural.tituloPerfil} icon={<FileText />} />
                <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Pontos Fortes</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {analisePerfilNatural.pontosFortes.atividades.map((p:string) => <li key={p}>{p}</li>)}
                        {analisePerfilNatural.pontosFortes.relacionamentos.map((p:string) => <li key={p}>{p}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Pontos a Melhorar</h3>
                     <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {analisePerfilNatural.pontosMelhorar.atividades.map((p:string) => <li key={p}>{p}</li>)}
                        {analisePerfilNatural.pontosMelhorar.relacionamentos.map((p:string) => <li key={p}>{p}</li>)}
                    </ul>
                </div>
            </div>
          </div>
        </section>

        {/* Seção Comparativa e Liderança */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Comparativo Natural vs. Adaptado */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Perfil Adaptado: Ajustes ao Meio</h2>
                <div className="w-full h-80">
                  <ComparisonBarChart 
                    ref={barChartRef}
                    naturalScores={analisePerfilNatural.scores} 
                    adaptadoScores={analisePerfilAdaptado.scores} 
                  />
                </div>
                 <div className="mt-4">
                    <h3 className="font-semibold text-slate-700 mb-2">Exigências do Meio:</h3>
                     <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {analisePerfilAdaptado.exigenciasDoMeio.map((e: string) => <li key={e}>{e}</li>)}
                    </ul>
                </div>
            </div>
            {/* Estilo de Liderança */}
            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Estilo de Liderança</h2>
                <StatCard title="Estilo Predominante" value={estiloDeLideranca.titulo} icon={<Users />} />
                <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Pontos Fortes na Liderança:</h3>
                     <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {estiloDeLideranca.pontosFortes.map((p: string) => <li key={p}>{p}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Comportamentos a Trabalhar:</h3>
                     <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {estiloDeLideranca.comportamentosTrabalhar.map((p: string) => <li key={p}>{p}</li>)}
                    </ul>
                </div>
            </div>
        </section>
        
        {/* Conclusão */}
        <footer className="text-center py-6">
            <p className="text-slate-700 max-w-3xl mx-auto">{conclusao}</p>
        </footer>
      </div>
    </main>
  );
};

export default DashboardPage;