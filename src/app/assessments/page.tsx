"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import CardField from '@/components/custom-ui/CardField'
import InputField from '@/components/custom-ui/InputField'
import AssessmentsTable from '@/features/assessments/components/AssessmentsTable'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useEffect, useState } from 'react'
import { BsFillPeopleFill } from 'react-icons/bs'

import { getKPIRankings } from '@/services/kpi/kpiService';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { useTableStore } from '@/shared/state'

const Assessments = () => {
    const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
    const setGlobalDateRange = useTableStore((s) => s.setDateRange);
    const [average, setAverage] = useState<number | null>(null);
    const [statusLabel, setStatusLabel] = useState('Not Safe');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [statusClass, setStatusClass] = useState('text-warning');
    const [countExcellent, setCountExcellent] = useState(0);
    const [countSafe, setCountSafe] = useState(0);
    const [countWarning, setCountWarning] = useState(0);
    const [countDanger, setCountDanger] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        getKPIRankings(selectedYear, selectedMonth).then((res: unknown) => {
            if (Array.isArray(res) && res.length > 0) {
                const total = res.reduce((sum, item) => sum + (item.totalPoints ?? 0), 0);
                const avg = total / res.length;
                setAverage(avg);
                let label = 'Not Safe';
                let cls = 'text-warning';
                if (avg !== null && avg !== undefined) {
                    if (avg <= 150) {
                        label = 'Danger';
                        cls = 'text-destructive';
                    } else if (avg <= 250) {
                        label = 'Warning';
                        cls = 'text-warning';
                    } else if (avg <= 400) {
                        label = 'Safe';
                        cls = 'text-success';
                    } else if (avg > 400) {
                        label = 'Excellent';
                        cls = 'text-primary';
                    }
                }
                setStatusLabel(label);
                setStatusClass(cls);

                let excellent = 0, safe = 0, warning = 0, danger = 0;
                interface KPIItem { totalPoints?: number }
                (res as KPIItem[]).forEach((item) => {
                    const point = item.totalPoints ?? 0;
                    if (point > 400) {
                        excellent++;
                    } else if (point > 250 && point <= 400) {
                        safe++;
                    } else if (point > 150 && point <= 250) {
                        warning++;
                    } else {
                        danger++;
                    }
                });
                setCountExcellent(excellent);
                setCountSafe(safe);
                setCountWarning(warning);
                setCountDanger(danger);
            } else {
                setAverage(null);
                setStatusLabel('Not Safe');
                setStatusClass('text-warning');
                setCountExcellent(0);
                setCountSafe(0);
                setCountWarning(0);
                setCountDanger(0);
            }
        });
    }, [selectedYear, selectedMonth]);

    return (
        <ProtectedRoute roles={['admin', 'lecturer']}>
            <MotionWrapper>
                <Card>
                    <div className="flex flex-col gap-10 p-5">
                        <div className="flex justify-between gap-3 items-center flex-col lg:flex-row lg:gap-0">
                            <div className="w-full lg:w-fit">
                                <InputField
                                    type="string"
                                    placeholder="Search by Name"
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setGlobalSearchQuery(e.target.value);
                                    }}
                                />
                            </div>
                            <div className='w-full z-40 lg:w-fit'>
                                <CalendarMonthYearPicker
                                onChange={({ month, year }) => {
                                    setSelectedMonth(month + 1);
                                    setSelectedYear(year);
                                    setGlobalDateRange(month + 1, year);
                                }}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                            <div className="sm:col-span-2">
                                <CardField title="Average Points" icon={<BsFillPeopleFill size={22} />}>
                                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                                        <p className="text-2xl font-semibold text-orange-400 sm:text-3xl">
                                            {average !== null ? `${average.toFixed(2)}` : '-'}
                                        </p>
                                        <div className="hidden h-10 w-0.5 bg-slate-400 sm:block"></div>
                                        <p className={`text-2xl font-semibold sm:text-3xl ${statusClass}`}>{statusLabel}</p>
                                    </div>
                                </CardField>
                            </div>
                            <CardField title="Total Excellent">
                                <p className="text-center text-2xl font-semibold sm:text-3xl">{countExcellent}</p>
                            </CardField>
                            <CardField title="Total safe">
                                <p className="text-center text-2xl font-semibold sm:text-3xl">{countSafe}</p>
                            </CardField>
                            <CardField title="Total Warning">
                                <p className="text-center text-2xl font-semibold sm:text-3xl">{countWarning}</p>
                            </CardField>
                            <CardField title="Total Danger">
                                <p className="text-center text-2xl font-semibold sm:text-3xl">{countDanger}</p>
                            </CardField>
                        </div>
                        <AssessmentsTable />
                    </div>
                </Card>
            </MotionWrapper>
        </ProtectedRoute>
    );
}

export default Assessments
