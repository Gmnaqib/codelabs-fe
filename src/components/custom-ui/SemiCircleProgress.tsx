"use client";
import React from "react";

export default function SemiCircleProgress({
  value = 1,
  max = 5,
  size = 200,
  strokeWidth = 20,
}) {
  const percentage = value / max;

  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // setengah lingkaran

  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size / 2}>
        {/* Background */}
        <path
          d={`
            M ${strokeWidth / 2},${size / 2}
            A ${radius},${radius} 0 0 1 ${size - strokeWidth / 2},${size / 2}
          `}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress */}
        <path
          d={`
            M ${strokeWidth / 2},${size / 2}
            A ${radius},${radius} 0 0 1 ${size - strokeWidth / 2},${size / 2}
          `}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>

      {/* Text */}
      <div className="-mt-10 text-2xl font-semibold text-blue-500">
        {value}/{max}
      </div>
    </div>
  );
}