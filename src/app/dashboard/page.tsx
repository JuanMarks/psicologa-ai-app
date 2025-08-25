// app/dashboard/page.tsx
"use client";

import { FC, useEffect, useRef, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { useDashboardStore } from '../../store/DashboardStore';
import { useRouter } from 'next/navigation';

// Componentes
import { RadarChart } from '../components/RadarCharts';
import { ComparisonBarChart } from '../components/ComparisonBarChart';
import { StatCard } from '../components/StatCard';
import { InsightCard } from '../components/InsightCard';
import { PdfDocument } from '../components/PdfComponent';

// Ícones
import { FileText, BrainCircuit, ShieldAlert, Zap, ArrowRightLeft, Target, ListChecks, Heart, Users, Activity } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';

const DashboardPage: FC = () => {
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const router = useRouter();

  const radarChartRef = useRef<ChartJS<'radar'>>(null);
  const barChartRef = useRef<ChartJS<'bar'>>(null);

  const [radarChartImage, setRadarChartImage] = useState<string>('');
  const [barChartImage, setBarChartImage] = useState<string>('');

  // Redireciona se não houver dados e prepara imagens dos gráficos para o PDF
  useEffect(() => {
    if (!dashboardData) {
      router.replace('/');
      return;
    }

    // Atraso para garantir que os gráficos estejam renderizados antes da captura
    const timer = setTimeout(() => {
      if (radarChartRef.current) {
        const chart = radarChartRef.current;
        chart.resize(1000, 800);
        const image = chart.toBase64Image('image/jpeg', 0.9);
        setRadarChartImage(image);
        chart.resize();
      }
      if (barChartRef.current) {
        const chart = barChartRef.current;
        chart.resize(1000, 800);
        const image = chart.toBase64Image('image/jpeg', 0.9);
        setBarChartImage(image);
        chart.resize();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [dashboardData, router]);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-gray-500">Carregando dados ou redirecionando...</p>
      </div>
    );
  }

  // Extraindo dados com a nova estrutura completa
  const { perfilNatural, perfilAdaptado, analiseGrafico, introducao, conclusao, scores } = dashboardData;

  return (
    <main className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Análise Comportamental</h1>
            <p className="text-slate-600 mt-1 max-w-3xl">{introducao}</p>
        </div>
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
        {/* Seção de Análise do Perfil Natural (MUITO MAIS DETALHADA) */}
        <section className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 border-b pb-2">{perfilNatural.titulo}: Sua Essência</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Coluna do Gráfico */}
            <div className="lg:col-span-2 flex justify-center items-center">
                <div className="w-full max-w-md">
                    <RadarChart ref={radarChartRef} scores={scores.natural} />
                </div>
            </div>

            {/* Coluna de Descrições e Características */}
            <div className="lg:col-span-3 space-y-4">
                <p className="text-slate-700 italic">{perfilNatural.descricaoGeral}</p>
                
                {/* Exposição de Características */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Exposição de Características</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                      <p><strong>Marcantes:</strong> {perfilNatural.exposicaoCaracteristicas.marcantes}</p>
                      <p><strong>Necessidade:</strong> {perfilNatural.exposicaoCaracteristicas.necessidade}</p>
                      <p><strong>Emoção Principal:</strong> {perfilNatural.exposicaoCaracteristicas.emocaoMedo.emocao}</p>
                      <p><strong>Medo Principal:</strong> {perfilNatural.exposicaoCaracteristicas.emocaoMedo.medo}</p>
                      <div>
                          <strong>Habilidades:</strong>
                          <ul className="list-disc list-inside ml-4">
                              {perfilNatural.exposicaoCaracteristicas.habilidades.map(h => <li key={h}>{h}</li>)}
                          </ul>
                      </div>
                  </div>
                </div>

                {/* Pontos de Melhoria Acionáveis */}
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2"><Target size={20}/> Pontos de Melhoria Acionáveis</h3>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      {perfilNatural.pontosMelhoriaAcionaveis.map(p => <li key={p}>{p}</li>)}
                    </ul>
                </div>
            </div>
          </div>
          
          {/* Pontos Fortes e a Melhorar (Agora divididos por categoria) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Pontos Fortes */}
                <div className='space-y-3'>
                    <h3 className="font-semibold text-lg text-slate-800">Seus Superpoderes: Pontos Fortes</h3>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className='font-bold text-blue-700 flex items-center gap-2'><Heart size={18}/> Emoções</h4>
                        <ul className="list-disc list-inside text-slate-600 mt-1">{perfilNatural.pontosFortes.emocoes.map(p => <li key={p}>{p}</li>)}</ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className='font-bold text-blue-700 flex items-center gap-2'><Users size={18}/> Relacionamentos</h4>
                        <ul className="list-disc list-inside text-slate-600 mt-1">{perfilNatural.pontosFortes.relacionamentos.map(p => <li key={p}>{p}</li>)}</ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className='font-bold text-blue-700 flex items-center gap-2'><Activity size={18}/> Atividades</h4>
                        <ul className="list-disc list-inside text-slate-600 mt-1">{perfilNatural.pontosFortes.atividades.map(p => <li key={p}>{p}</li>)}</ul>
                    </div>
                </div>
                {/* Pontos a Melhorar */}
                <div className='space-y-3'>
                    <h3 className="font-semibold text-lg text-slate-800">Oportunidades de Crescimento</h3>
                     <div className="p-4 bg-amber-50 rounded-lg">
                        <h4 className='font-bold text-amber-700 flex items-center gap-2'><Heart size={18}/> Emoções</h4>
                        <ul className="list-disc list-inside text-slate-600 mt-1">{perfilNatural.pontosMelhorar.emocoes.map(p => <li key={p}>{p}</li>)}</ul>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                        <h4 className='font-bold text-amber-700 flex items-center gap-2'><Users size={18}/> Relacionamentos</h4>
                        <ul className="list-disc list-inside text-slate-600 mt-1">{perfilNatural.pontosMelhorar.relacionamentos.map(p => <li key={p}>{p}</li>)}</ul>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                        <h4 className='font-bold text-amber-700 flex items-center gap-2'><Activity size={18}/> Atividades</h4>
                        <ul className="list-disc list-inside text-slate-600 mt-1">{perfilNatural.pontosMelhorar.atividades.map(p => <li key={p}>{p}</li>)}</ul>
                    </div>
                </div>
          </div>
        </section>

        {/* Análise da Forma do Gráfico */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Análise da Forma do Gráfico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InsightCard title="Padrão do Gráfico" insight={analiseGrafico.tipo} icon={<BrainCircuit />}/>
                <InsightCard title="Comportamento sob Stress" insight={analiseGrafico.sobStress} icon={<Zap />} />
                <InsightCard title="Zona de Risco" insight={analiseGrafico.zonaDeRisco} icon={<ShieldAlert />} />
            </div>
        </section>

        {/* Seção Comparativa e Análise de Mudanças */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-teal-800 mb-4">Perfil Adaptado: Ajustes ao Meio</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="w-full h-80">
                  <ComparisonBarChart ref={barChartRef} naturalScores={scores.natural} adaptadoScores={scores.adaptado} />
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><ArrowRightLeft size={20}/> Exigências do Meio:</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1">
                            {perfilAdaptado.exigenciasDoMeio.map((e) => (
                                <li key={e.fator}><strong>{e.fator} ({e.movimento}):</strong> {e.descricao}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><ListChecks size={20}/> Análise das Mudanças:</h3>
                         {perfilAdaptado.analiseDasMudancas.map((mudanca, index) => (
                            <div key={index} className="mt-2">
                                <h4 className="font-bold">{mudanca.titulo}</h4>
                                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                                    {mudanca.causas.map(causa => <li key={causa}>{causa}</li>)}
                                </ul>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Conclusão */}
        <footer className="text-center py-6">
          <p className="text-slate-700 max-w-3xl mx-auto">{conclusao}</p>
          <p className="mt-4 font-semibold text-indigo-700">Conte comigo.</p>
        </footer>
      </div>
    </main>
  );
};

export default DashboardPage;