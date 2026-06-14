"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, ChangeEvent } from 'react'
import InputField from '@/components/custom-ui/InputField';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { createKPIDetail } from '@/services/kpi/kpiService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { useSearchParams } from 'next/navigation';

enum KPILabel {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
}

const PointsDetails = () => {
  const searchParams = useSearchParams();
  const masterId = searchParams.get('id') ?? '';

  const [activePage, setActivePage] = useState<string>("pointsdetail");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [kpiItem, setKpiItem] = useState("");
  const [point, setPoint] = useState("");
  const [maxActivity, setMaxActivity] = useState("");
  const [label, setLabel] = useState("");

  const isFormIncomplete = !kpiItem || !point || !maxActivity || !label;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createKPIDetail({
        kpi_item: kpiItem,
        point: Number(point),
        max_activity: Number(maxActivity),
        id_kpi_master: masterId,
        label,
      });
      toast.success("KPI detail created successfully!");
      setIsDialogOpen(false);
      setKpiItem("");
      setPoint("");
      setMaxActivity("");
      setLabel("");
      setFetchTrigger(Date.now());
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create KPI detail.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <DialogField
            name="Add Detail"
            title="Add KPI Detail"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            submitDisabled={isFormIncomplete || loading}
          >
            <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
              <DropdownField
                label="Label"
                menu={Object.values(KPILabel)}
                value={label}
                onChange={setLabel}
              />
              <InputField
                type="text"
                placeholder="Ex: picket"
                label="KPI Item"
                value={kpiItem}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setKpiItem(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 15"
                label="Point"
                value={point}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPoint(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 10"
                label="Max Activity"
                value={maxActivity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxActivity(e.target.value)}
              />
            </form>
          </DialogField>
        </div>
        <Card className='p-5'>
          <div>
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={true}
              searchQuery={searchQuery}
              fetchTrigger={fetchTrigger}
            />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default PointsDetails
