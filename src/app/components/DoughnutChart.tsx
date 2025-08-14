// app/components/DoughnutChart.tsx
"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  scores: { d: number; i: number; s: number; c: number; };
}

export const DoughnutChart = ({ scores }: DoughnutChartProps) => {
  const data = {
    labels: ['Dominância', 'Influência', 'Estabilidade', 'Conformidade'],
    datasets: [{
      label: 'Proporção de Scores',
      data: [scores.d, scores.i, scores.s, scores.c],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',   // Red
        'rgba(234, 179, 8, 0.8)',  // Yellow
        'rgba(34, 197, 94, 0.8)',  // Green
        'rgba(59, 130, 246, 0.8)'  // Blue
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Composição do Perfil DISC',
        font: { size: 16 }
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};