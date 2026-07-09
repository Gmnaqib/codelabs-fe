"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import { getKPIMeDetail } from '@/services/kpi/kpiService';
import type { AssessmentRow, KPIDetailSummary } from '@/features/assessments/types';

interface AssessmentDetailCellProps {
  row: AssessmentRow;
  year: number;
  month: number;
}

interface MetricItem {
  label: string;
  count?: number;
  points?: number;
}

interface MetricSection {
  title: string;
  items: MetricItem[];
}

function buildSections(kpiDetail: KPIDetailSummary | null): MetricSection[] {
  return [
    {
      title: 'Research',
      items: [
        { label: 'Personal', count: kpiDetail?.research?.personal?.count, points: kpiDetail?.research?.personal?.totalPoints },
        { label: 'Product', count: kpiDetail?.research?.product?.count, points: kpiDetail?.research?.product?.totalPoints },
        { label: 'Workshop', count: kpiDetail?.research?.workshop?.count, points: kpiDetail?.research?.workshop?.totalPoints },
      ],
    },
    {
      title: 'Operational',
      items: [
        { label: 'Piket', count: kpiDetail?.operational?.picket?.count, points: kpiDetail?.operational?.picket?.totalPoints },
        { label: 'Tematik', count: kpiDetail?.operational?.thematic?.count, points: kpiDetail?.operational?.thematic?.totalPoints },
      ],
    },
    {
      title: 'Attendance',
      items: [
        { label: 'Present', count: kpiDetail?.attendance?.present?.count, points: kpiDetail?.attendance?.present?.totalPoints },
      ],
    },
    {
      title: 'Branding',
      items: [
        { label: 'Branding', count: kpiDetail?.branding?.count, points: kpiDetail?.branding?.totalPoints },
      ],
    },
    {
      title: 'Competition',
      items: [
        { label: 'Competition', count: kpiDetail?.competition?.count, points: kpiDetail?.competition?.totalPoints },
      ],
    },
  ];
}

export default function AssessmentDetailCell({ row, year, month }: AssessmentDetailCellProps) {
  const [kpiDetail, setKpiDetail] = useState<KPIDetailSummary | null>(null);

  const handleOpen = async () => {
    try {
      const detail = (await getKPIMeDetail(row.userId, year, month)) as { summary: KPIDetailSummary };
      setKpiDetail(detail.summary);
    } catch {
      setKpiDetail(null);
    }
  };

  return (
    <DialogField
      name="Detail"
      title="Assessment Detail"
      variant="outline"
      noPadding
      onTriggerClick={handleOpen}
    >
      <div className="flex flex-col gap-4">
        {buildSections(kpiDetail).map((section) => (
          <div key={section.title} className="rounded-xl border p-4">
            <p className="mb-2 text-sm font-semibold text-secondary-foreground">{section.title}</p>
            <div className="flex flex-col divide-y">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count ?? '-'}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${
                        (item.points ?? 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.points ?? 0} Point{item.points === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DialogField>
  );
}
