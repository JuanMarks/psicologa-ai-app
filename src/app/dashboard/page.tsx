// app/dashboard/page.tsx
"use client";

import { useState, FC, useRef, useEffect } from 'react';
import { RadarChart } from '../components/RadarCharts'; // Ajuste o caminho se necessário
import { StatCard } from '../components/StatCard';
import { DoughnutChart } from '../components/DoughnutChart';
import { FileText, BarChart2, CheckSquare, MessageSquare } from 'lucide-react'; // Ícones para os cards
import { useDashboardStore } from '../../store/DashboardStore';
import { useRouter } from 'next/navigation';
// Bibliotecas para o PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const DashboardPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const dashboardData = useDashboardStore((state) => state.dashboardData);

  const router = useRouter();

    useEffect(() => {
    if (!dashboardData) {
      router.replace('/'); // Use .replace() para não adicionar ao histórico do navegador
    }
  }, [dashboardData, router]);
  
  // Ref para o elemento do dashboard que queremos "printar"
  const dashboardRef = useRef<HTMLDivElement>(null);


  
  const handleDownloadPdf = async () => {
    const dashboardElement = dashboardRef.current;
    if (!dashboardElement) return;
    
    // Usa html2canvas para capturar o elemento
    const canvas = await html2canvas(dashboardElement, {
        scale: 2, // Aumenta a resolução da imagem
        useCORS: true,
        backgroundColor: '#f1f5f9' // Cor de fundo do canvas
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Usa jsPDF para criar o PDF
    // Dimensões do PDF (A4: 210x297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth - 20; // com margem de 10mm de cada lado
    const imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 10; // margem superior
    
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20);

    // Lógica para PDFs com múltiplas páginas (se o dashboard for muito grande)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }

    pdf.save('relatorio-dashboard.pdf');
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={dashboardData ? handleDownloadPdf : undefined}
          disabled={loading}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-slate-400"
        >
          {loading ? 'Gerando...' : (dashboardData ? 'Baixar Relatório PDF' : 'Gerar Relatório')}
        </button>
      </div>

      {/* Conteúdo do Dashboard que será capturado */}
      {dashboardData ? (
        <div ref={dashboardRef} className="p-4 bg-slate-100">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Perfil Principal" value={dashboardData.relatorioTextual.nomePerfil} icon={<FileText />} colorClass="bg-blue-100 text-blue-800" />
            <StatCard title="Fator Dominante" value="Dominância (D)" icon={<BarChart2 />} colorClass="bg-red-100 text-red-800" />
            <StatCard title="Competências" value={`${dashboardData.dadosQuantitativos.pontosChave.length} Mapeadas`} icon={<CheckSquare />} colorClass="bg-green-100 text-green-800" />
            <StatCard title="Estilo de Comunicação" value="Direto e Objetivo" icon={<MessageSquare />} colorClass="bg-yellow-100 text-yellow-800" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
              <RadarChart scores={dashboardData.dadosQuantitativos.scores} />
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <DoughnutChart scores={dashboardData.dadosQuantitativos.scores} />
            </div>
          </div>
        </div>
      ) : (
         <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Clique em "Gerar Relatório" para visualizar o dashboard.</p>
         </div>
      )}
    </div>
  );
};

export default DashboardPage;