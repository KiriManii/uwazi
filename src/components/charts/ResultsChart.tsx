'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Poll } from '@/types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ResultsChartProps {
  poll: Poll;
  type?: 'pie' | 'bar';
}

export default function ResultsChart({ poll, type = 'bar' }: ResultsChartProps) {
  const chartData = {
    labels: poll.options.map(o => o.option_text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(o => o.vote_count),
        backgroundColor: [
          '#2563EB', // Primary blue
          '#0D9488', // Secondary teal
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#10B981', // Green
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'pie' ? ('right' as const) : ('top' as const),
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed.y || context.parsed;
            const total = poll.total_votes;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} votes (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="h-[400px] w-full">
      {type === 'pie' ? (
        <Pie data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
