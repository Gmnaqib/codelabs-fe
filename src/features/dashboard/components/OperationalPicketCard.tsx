"use client";
import CardField from "@/components/custom-ui/CardField";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useEffect, useState } from "react";
import { getOperationalRecordsToday } from "@/services/picket/picketService";

export default function OperationalPicketCard({
    size = 160,
    strokeWidth = 18,
}) {
    const [value, setValue] = useState(0);
    const max = 6;

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            try {
                const data = await getOperationalRecordsToday(year, month);
                setValue(Array.isArray(data) ? data.length : 0);
            } catch {
                setValue(0);
            }
        };
        fetchData();
    }, []);

    const percentage = value / max;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - percentage);

    return (
        <CardField title="Today’s Picket Progress" icon={<ClipboardDocumentCheckIcon />} bg>
            <div className="flex flex-col items-center justify-center h-64 z-10">
                <svg width={size} height={size / 2}>
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

                <div className="-mt-10 text-2xl font-semibold text-blue-500">
                    {value}/{max}
                </div>
                <div className="flex items-center justify-center gap-2 mt-16">
                    <Link href="/picket-schedule" className="text-primary">See All Member</Link>
                    <ArrowUpRightIcon className="text-primary text-base font-normal size-4" />
                </div>
            </div>
        </CardField>
    );
}