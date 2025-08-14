// app/components/RadarChart.tsx

"use client";

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  scores: {
    d: number;
    i: number;
    s: number;
    c: number;
  };
}

export const RadarChart = ({ scores }: RadarChartProps) => {
  const data = {
    labels: ['Dominância (D)', 'Influência (I)', 'Estabilidade (S)', 'Conformidade (C)'],
    datasets: [
      {
        label: 'Pontuação do Perfil',
        data: [scores.d, scores.i, scores.s, scores.c],
        backgroundColor: 'rgba(75, 103, 222, 0.2)', // Azul/Índigo com transparência
        borderColor: 'rgba(75, 103, 222, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 103, 222, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 103, 222, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
            backdropColor: 'transparent',
            stepSize: 20
        },
        pointLabels: {
            font: {
                size: 14,
                weight: 'bold' as const
            }
        }
      },
    },
    plugins: {
        legend: {
            display: false,
        }
    }
  };

  return <Radar data={data} options={options} />;
};