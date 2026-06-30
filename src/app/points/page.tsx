"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, useEffect, ChangeEvent } from 'react'
import InputField from '@/components/custom-ui/InputField';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getKPIMaster, updateKPIMaster } from '@/services/kpi/kpiService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'

type KPIMasterItem = {
  _id: string;
  kementerian: string;
  point: number;
};

const Points = () => {
  const [activePage, setActivePage] = useState<string>("points");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kpiMasterList, setKpiMasterList] = useState<KPIMasterItem[]>([]);
  const [editItem, setEditItem] = useState<KPIMasterItem | null>(null);
  const [editPoint, setEditPoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const data = await getKPIMaster();
        setKpiMasterList(data);
      } catch {
        toast.error("Failed to fetch KPI master");
      }
    };
    fetchMaster();
  }, [fetchTrigger]);

  const handleEditClick = (item: unknown) => {
    const kpiItem = item as KPIMasterItem;
    setEditItem(kpiItem);
    setEditPoint(String(kpiItem.point));
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!editItem) return;
    setLoading(true);
    try {
      await updateKPIMaster(editItem._id, {
        name: editItem.kementerian,
        point: Number(editPoint),
      });
      setIsDialogOpen(false);
      setEditItem(null);
      setEditPoint("");
      setFetchTrigger(Date.now());
      toast.success("Category updated successfully!");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update category.";
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
        </div>
        {kpiMasterList.reduce((sum, item) => sum + item.point, 0) < 100 && (
          <p className="text-md font-medium text-amber-500 mb-4">
            Unallocated Weight: <span className='font-semibold'>{100 - kpiMasterList.reduce((sum, item) => sum + item.point, 0)}%</span>
          </p>
        )}
        <Card className='p-5'>
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true}
            searchQuery={searchQuery}
            fetchTrigger={fetchTrigger}
            onEditItem={handleEditClick}
          />
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditItem(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Category {editItem?.kementerian}</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
              <InputField
                type="number"
                placeholder="Ex: 30"
                label="Weight"
                value={editPoint}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPoint(e.target.value)}
              />
              <div className="flex justify-center gap-4 mt-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                <Button onClick={handleSubmit} disabled={!editPoint || loading}>Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default Points
