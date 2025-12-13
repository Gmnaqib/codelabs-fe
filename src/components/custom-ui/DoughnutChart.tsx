"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

type Props = {
  filled: number; // uniqueResearchUsers
  total: number;  // totalUsers
};

const DoughnutChart = ({ filled, total }: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;
  const notFilled = total - filled;

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Logbook filled", "Not filled"],
        datasets: [
          {
            label: "Progress",
            data: [filled, notFilled],
            borderWidth: 3,
            backgroundColor: [
              "#24BB8B",  
              "#FF6A88",  
            ]
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        radius: "70%",
        plugins: {
          legend: {
            position: "top",
          },
        },
      },

      plugins: [
        {
          id: "centerText",
          afterDraw(chart) {
            const { ctx } = chart;
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

            ctx.save();
            ctx.font = "bold 28px sans-serif";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${percentage}%`, centerX, centerY);
            ctx.restore();
          },
        },
      ],
    });
  }, [filled, total]);

  return (
    <div className="h-56 flex">
      <canvas ref={chartRef} />
    </div>
  );
};

export default DoughnutChart;
