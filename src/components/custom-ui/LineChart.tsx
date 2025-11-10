"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title
);

const LineChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: ["January", "February", "March", "April", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
           {
              label: "User Growth",
              data: [10, 30, 45, 60, 80, 75, 20, 35, 64, 77, 90, 79],
              borderWidth: 2,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.3,
            },
            {
              label: "Active Users",
              data: [5, 15, 40, 32, 60, 65, 50, 45, 50, 70, 66, 85],
              borderWidth: 2,
              borderColor: "rgb(255, 99, 132)", 
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, []);

  return <canvas ref={chartRef} />;
};

export default LineChart;
