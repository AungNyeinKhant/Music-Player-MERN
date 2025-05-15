import { FC, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Calendar } from "lucide-react";
import { string } from "yup";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  data: number[];
  title: string;
  xAxisTitle: string;
  yAxisTitle: string;
}

const LineChart: FC<LineChartProps> = ({
  labels,
  data,
  title,
  xAxisTitle,
  yAxisTitle,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e2e8f0",
        },
      },
      title: {
        display: true,
        text: title,
        color: "#e2e8f0",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisTitle,
          color: "#e2e8f0",
        },
        ticks: {
          color: "#e2e8f0",
        },
        grid: {
          color: "rgba(226, 232, 240, 0.1)",
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisTitle,
          color: "#e2e8f0",
        },
        ticks: {
          color: "#e2e8f0",
        },
        grid: {
          color: "rgba(226, 232, 240, 0.1)",
        },
      },
    },
  };

  return (
    <div className='relative min-h-[400px] w-full'>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
