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

const DoughnutChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

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
            data: [97, 3],
            borderWidth: 3,
            backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            ],
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
        ctx.fillText("97%", centerX, centerY);
        ctx.restore();
        },
    },
    ],

    });

  }, []);

  return (
        <div className="border-2">
            <canvas ref={chartRef} />
        </div>
  );
};

export default DoughnutChart;
