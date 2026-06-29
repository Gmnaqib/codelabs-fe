"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, useEffect, ChangeEvent, Suspense } from 'react'
import InputField from '@/components/custom-ui/InputField';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { createKPIDetail, getKPIDetail, updateKPIDetail } from '@/services/kpi/kpiService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const masterId = searchParams.get('id') ?? '';

  const [activePage, setActivePage] = useState<string>("pointsdetail");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailList, setDetailList] = useState<KPIDetailItem[]>([]);

  // Add dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [kpiItem, setKpiItem] = useState("");
  const [point, setPoint] = useState("");
  const [maxActivity, setMaxActivity] = useState("");
  const [label, setLabel] = useState("");

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [editKpiItem, setEditKpiItem] = useState("");
  const [editPoint, setEditPoint] = useState("");
  const [editMaxActivity, setEditMaxActivity] = useState("");
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    if (!masterId) return;
    const fetchDetail = async () => {
      try {
        const data = await getKPIDetail(masterId);
        setDetailList(Array.isArray(data) ? data : [data]);
      } catch {
        toast.error("Failed to fetch KPI detail");
      }
    };
    fetchDetail();
  }, [masterId, fetchTrigger]);

  const selectedEditItem = detailList.find((i) => i.kpi_item === selectedItemName);

  const handleSelectEditItem = (name: string) => {
    setSelectedItemName(name);
    const item = detailList.find((i) => i.kpi_item === name);
    if (item) {
      setEditKpiItem(item.kpi_item);
      setEditPoint(String(item.point));
      setEditMaxActivity(String(item.max_activity));
      setEditLabel(item.label);
    }
  };

  const isAddIncomplete = !kpiItem || !point || !maxActivity || !label;
  const isEditIncomplete = !selectedItemName || !editKpiItem || !editPoint || !editMaxActivity || !editLabel;

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
    if (!selectedEditItem) return;
    setLoading(true);
    try {
      await updateKPIDetail(selectedEditItem._id, {
        kpi_item: editKpiItem,
        point: Number(editPoint),
        max_activity: Number(editMaxActivity),
        id_kpi_master: masterId,
        label: editLabel,
      });
      toast.success("KPI detail updated successfully!");
      setIsEditOpen(false);
      setSelectedItemName("");
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
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <DialogField
              name="Edit Items"
              title="Edit KPI Item"
              open={isEditOpen}
              onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) setSelectedItemName("");
              }}
              onSubmit={handleEdit}
              submitDisabled={isEditIncomplete || loading}
            >
              <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
                <DropdownField
                  label="Select Item"
                  menu={detailList.map((i) => i.kpi_item)}
                  value={selectedItemName}
                  onChange={handleSelectEditItem}
                />
                <DropdownField
                  label="Label"
                  menu={Object.values(KPILabel)}
                  value={editLabel}
                  onChange={setEditLabel}
                />
                <InputField
                  type="text"
                  placeholder="Ex: picket"
                  label="KPI Item"
                  value={editKpiItem}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditKpiItem(e.target.value)}
                />
                <InputField
                  type="number"
                  placeholder="Ex: 15"
                  label="Point"
                  value={editPoint}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPoint(e.target.value)}
                />
                <InputField
                  type="number"
                  placeholder="Ex: 10"
                  label="Max Activity"
                  value={editMaxActivity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditMaxActivity(e.target.value)}
                />
              </form>
            </DialogField>
            <DialogField
              name="Add Detail"
              title="Add KPI Detail"
              open={isAddOpen}
              onOpenChange={setIsAddOpen}
              onSubmit={handleAdd}
              submitDisabled={isAddIncomplete || loading}
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
