"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, useEffect, ChangeEvent } from 'react'
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
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
  const [selectedKementerian, setSelectedKementerian] = useState("");
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

  const selectedItem = kpiMasterList.find(
    (item) => item.kementerian === selectedKementerian
  );

  const handleKementerianChange = (value: string) => {
    setSelectedKementerian(value);
    const item = kpiMasterList.find((i) => i.kementerian === value);
    setEditPoint(item ? String(item.point) : "");
  };

  const isFormIncomplete = !selectedKementerian || !editPoint || !selectedItem;

  const handleSubmit = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      await updateKPIMaster(selectedItem._id, {
        name: selectedKementerian,
        point: Number(editPoint),
      });
      setIsDialogOpen(false);
      setSelectedKementerian("");
      setEditPoint("");
      setFetchTrigger(Date.now());
      toast.success("Category updated successfully!");
    } catch {
      toast.error("Failed to update category.");
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
            name="Edit Category"
            title="Edit Category"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            submitDisabled={isFormIncomplete || loading}
          >
            <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
              <DropdownField
                label="Category"
                menu={kpiMasterList.map((item) => item.kementerian)}
                value={selectedKementerian}
                onChange={handleKementerianChange}
              />
              <InputField
                type="number"
                placeholder="Ex: 30"
                label="Point"
                value={editPoint}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPoint(e.target.value)}
              />
            </form>
          </DialogField>
        </div>
        {kpiMasterList.reduce((sum, item) => sum + item.point, 0) < 100 && (
          <p className="text-md font-medium text-black mb-4">
            Total Available Percentage : <span className='font-normal text-foreground'>{100 - kpiMasterList.reduce((sum, item) => sum + item.point, 0)}%</span>
          </p>
        )}
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

export default Points
