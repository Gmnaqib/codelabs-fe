"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import CardField from '@/components/custom-ui/CardField'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useEffect, useState } from 'react'
import { BsFillPeopleFill } from 'react-icons/bs'


import { getKPIRankings } from '@/services/kpi/kpiService';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'

const Assessments = () => {
    const [average, setAverage] = useState<number | null>(null);
    const [statusLabel, setStatusLabel] = useState('Not Safe');
    const [statusClass, setStatusClass] = useState('text-warning');
    const [countExcellent, setCountExcellent] = useState(0);
    const [countSafe, setCountSafe] = useState(0);
    const [countWarning, setCountWarning] = useState(0);
    const [countDanger, setCountDanger] = useState(0);

    useEffect(() => {
        getKPIRankings().then((res: unknown) => {
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
    }, []);

    return (
        <ProtectedRoute>
            <MotionWrapper>
                <Card>
                    <div className="flex flex-col gap-10 p-5">
                        <div className="flex justify-between items-center">
                            <InputField
                                type="string"
                                placeholder="Search by Name"
                            />
                            <CalendarMonthYearPicker />
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">
                                <CardField title="Average Points" icon={<BsFillPeopleFill size={22} />}>
                                    <div className="flex gap-8 items-center justify-center">
                                        <p className="font-semibold text-3xl text-orange-400">
                                            {average !== null ? `${average.toFixed(2)}` : '-'}
                                        </p>
                                        <div className="bg-slate-400 w-0.5 h-10"></div>
                                        <p className={`font-semibold text-3xl ${statusClass}`}>{statusLabel}</p>
                                    </div>
                                </CardField>
                            </div>
                            <CardField title="Total Excellent">
                                <p className="font-semibold text-3xl text-center">{countExcellent}</p>
                            </CardField>
                            <CardField title="Total safe">
                                <p className="font-semibold text-3xl text-center">{countSafe}</p>
                            </CardField>
                            <CardField title="Total Warning">
                                <p className="font-semibold text-3xl text-center">{countWarning}</p>
                            </CardField>
                            <CardField title="Total Danger">
                                <p className="font-semibold text-3xl text-center">{countDanger}</p>
                            </CardField>
                        </div>
                        <TableField
                            activePage="assessments"
                            onPageChange={() => { }}
                            showMenu={false}
                        />
                    </div>
                </Card>
            </MotionWrapper>
        </ProtectedRoute>
    );
}

export default Assessments
