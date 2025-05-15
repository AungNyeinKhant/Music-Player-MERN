import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface StackBarChartProps {
  labels: string[];
  datasets: Dataset[];
  title: string;
  xAxisTitle: string;
  yAxisTitle: string;
}

const StackBarChart: FC<StackBarChartProps> = ({
  labels,
  datasets,
  title,
  xAxisTitle,
  yAxisTitle,
}) => {
  const chartData = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      borderColor: "#3b82f6",
    })),
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
        stacked: true,
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
        stacked: true,
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
    <div className='relative min-h-[400px] w-full '>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StackBarChart;
