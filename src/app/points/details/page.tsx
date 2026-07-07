"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState, useEffect, ChangeEvent, Suspense } from 'react'
import InputField from '@/components/custom-ui/InputField';
import DialogField from '@/components/custom-ui/DialogField';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { createKPIDetail, getKPIDetail, updateKPIDetail } from '@/services/kpi/kpiService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { useSearchParams } from 'next/navigation';
import { useTableStore } from '@/shared/state';

enum KPILabel {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
}

type KPIDetailItem = {
  _id: string;
  kpi_item: string;
  point: number;
  label: string;
  max_activity: number;
};

const PointsDetails = () => {
  return (
    <Suspense fallback={null}>
      <PointsDetailsContent />
    </Suspense>
  );
};

const PointsDetailsContent = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const searchParams = useSearchParams();
  const masterId = searchParams.get('id') ?? '';

  const [activePage, setActivePage] = useState<string>("pointsdetail");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Add dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [kpiItem, setKpiItem] = useState("");
  const [point, setPoint] = useState("");
  const [maxActivity, setMaxActivity] = useState("");
  const [label, setLabel] = useState("");

  // Edit dialog state (triggered from row)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<KPIDetailItem | null>(null);
  const [editKpiItem, setEditKpiItem] = useState("");
  const [editPoint, setEditPoint] = useState("");
  const [editMaxActivity, setEditMaxActivity] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const isAddIncomplete = !kpiItem || !point || !maxActivity || !label;
  const isEditIncomplete = !editKpiItem || !editPoint || !editMaxActivity || !editLabel;

  const handleEditClick = (item: unknown) => {
    const kpiDetail = item as KPIDetailItem;
    setEditItem(kpiDetail);
    setEditKpiItem(kpiDetail.kpi_item);
    setEditPoint(String(kpiDetail.point));
    setEditMaxActivity(String(kpiDetail.max_activity));
    setEditLabel(kpiDetail.label);
    setIsEditOpen(true);
  };

  const handleAdd = async () => {
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
      setIsAddOpen(false);
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

  const handleEdit = async () => {
    if (!editItem) return;
    setLoading(true);
    try {
      await updateKPIDetail(editItem._id, {
        kpi_item: editKpiItem,
        point: Number(editPoint),
        max_activity: Number(editMaxActivity),
        id_kpi_master: masterId,
        label: editLabel,
      });
      toast.success("KPI detail updated successfully!");
      setIsEditOpen(false);
      setEditItem(null);
      setFetchTrigger(Date.now());
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to update KPI detail.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={['admin', 'president', 'vice president']}>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setGlobalSearchQuery(e.target.value);
            }}
          />
          <DialogField
            name="Add Detail"
            title="Add KPI Detail"
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            onSubmit={handleAdd}
            submitDisabled={isAddIncomplete || loading}
          >
            <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
              <InputField
                type="text"
                placeholder="Ex: picket"
                label="Name"
                value={kpiItem}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setKpiItem(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 15"
                label="Weight"
                value={point}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPoint(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 10"
                label="Activity Limit"
                value={maxActivity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxActivity(e.target.value)}
              />
              <DropdownField
                label="Requirement"
                menu={Object.values(KPILabel)}
                value={label}
                onChange={setLabel}
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
              onEditItem={handleEditClick}
            />
          </div>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditItem(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Detail {editItem?.kpi_item}</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
              <InputField
                type="text"
                placeholder="Ex: picket"
                label="Name"
                value={editKpiItem}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditKpiItem(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 15"
                label="Weight"
                value={editPoint}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPoint(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 10"
                label="Activity Limit"
                value={editMaxActivity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditMaxActivity(e.target.value)}
              />
              <DropdownField
                label="Requirement"
                menu={Object.values(KPILabel)}
                value={editLabel}
                onChange={setEditLabel}
              />
              <div className="flex justify-center gap-4 mt-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                <Button onClick={handleEdit} disabled={isEditIncomplete || loading}>Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default PointsDetails
