"use client";

import React, { useEffect, useRef, useState } from "react";

import { getKPIAllOperational, getKPIAllResearch } from '@/services/kpi/kpiService';
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


interface LineChartProps {
  year?: string | number;
}

const LineChart = ({ year }: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<{research: number[]; attendance: number[]}>({ research: [], attendance: [] });
  const labels = React.useMemo(
    () => [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const y = year ? Number(year) : new Date().getFullYear();
      const researchPoints: number[] = [];
      const attendancePoints: number[] = [];
      for (let month = 1; month <= 12; month++) {
        try {
          const researchRes = await getKPIAllResearch(y, month);
          const attendanceRes = await getKPIAllOperational(y, month);
          const researchTotal = Array.isArray(researchRes) ? researchRes.reduce((sum, item) => sum + (item.totalPoint || 0), 0) : 0;
          const attendanceTotal = Array.isArray(attendanceRes) ? attendanceRes.reduce((sum, item) => sum + (item.totalPoint || 0), 0) : 0;
          researchPoints.push(researchTotal);
          attendancePoints.push(attendanceTotal);
        } catch {
          researchPoints.push(0);
          attendancePoints.push(0);
        }
      }
      setChartData({ research: researchPoints, attendance: attendancePoints });
    };
    fetchData();
  }, [year]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Research Points",
              data: chartData.research,
              borderWidth: 2,
              borderColor: "#00D0FF",
              backgroundColor: "#00D0FF",
              tension: 0.3,
            },
            {
              label: "Attendance Points",
              data: chartData.attendance,
              borderWidth: 2,
              borderColor: "#24BB8B",
              backgroundColor: "#24BB8B",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          resizeDelay: 0,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
            },
          },
        },
      });
    }
  }, [chartData, labels]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={chartRef} className="!w-full !h-full" />
    </div>
  );
};

export default LineChart;
