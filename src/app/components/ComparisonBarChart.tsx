// app/components/ComparisonBarChart.tsx
"use client";

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { forwardRef, ComponentRef } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  naturalScores: { d: number; i: number; s: number; c: number; };
  adaptadoScores: { d: number; i: number; s: number; c: number; };
}

export const ComparisonBarChart = forwardRef<ComponentRef<typeof Bar>, ChartProps>(({ naturalScores, adaptadoScores }, ref) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Comparativo: Natural vs. Adaptado' }},
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  const labels = ['Dominância (D)', 'Influência (I)', 'Estabilidade (S)', 'Conformidade (C)'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Perfil Natural',
        data: Object.values(naturalScores),
        backgroundColor: 'rgba(75, 103, 222, 0.6)', // Índigo
      },
      {
        label: 'Perfil Adaptado',
        data: Object.values(adaptadoScores),
        backgroundColor: 'rgba(20, 184, 166, 0.6)', // Teal
      },
    ],
  };

  return <Bar options={options} data={data} ref={ref} />;
});