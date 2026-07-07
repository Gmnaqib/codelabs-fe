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
      <div>
        <p className="font-semibold">research</p>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Personal</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.research?.personal?.count ?? '-'} ({kpiDetail?.research?.personal?.totalPoints ?? '-'} Point)
          </p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">product</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.research?.product?.count ?? '-'} ({kpiDetail?.research?.product?.totalPoints ?? '-'} Point)
          </p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Workshop</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.research?.workshop?.count ?? '-'} ({kpiDetail?.research?.workshop?.totalPoints ?? '-'} Point)
          </p>
        </div>
      </div>
      <div>
        <p className="font-semibold">operational</p>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Piket</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.operational?.picket?.count ?? '-'} ({kpiDetail?.operational?.picket?.totalPoints ?? '-'} Point)
          </p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Tematik</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.operational?.thematic?.count ?? '-'} ({kpiDetail?.operational?.thematic?.totalPoints ?? '-'} Point)
          </p>
        </div>
      </div>
      <div>
        <p className="font-semibold">attendance</p>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Present</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.attendance?.present?.count ?? '-'} ({kpiDetail?.attendance?.present?.totalPoints ?? '-'} Point)
          </p>
        </div>
      </div>
      <div>
        <p className="font-semibold">branding</p>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Branding</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.branding?.count ?? '-'} ({kpiDetail?.branding?.totalPoints ?? '-'} Point)
          </p>
        </div>
      </div>
      <div>
        <p className="font-semibold">competition</p>
        <div className="grid grid-cols-3 lg:grid-cols-12">
          <p className="col-span-1 lg:col-span-2">Competition</p>
          <p>:</p>
          <p className="col-span-1 lg:col-span-4">
            {kpiDetail?.competition?.count ?? '-'} ({kpiDetail?.competition?.totalPoints ?? '-'} Point)
          </p>
        </div>
      </div>
    </DialogField>
  );
}
