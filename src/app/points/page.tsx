"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState, useEffect } from 'react'
import InputField from '@/components/custom-ui/InputField';
import { getKPIMaster } from '@/services/kpi/kpiService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { useTableStore } from '@/shared/state'
import KpiItemForm from '@/features/points/components/KpiItemForm'

type KPIMasterItem = {
  _id: string;
  kementerian: string;
  point: number;
};

const Points = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const [activePage, setActivePage] = useState<string>("points");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kpiMasterList, setKpiMasterList] = useState<KPIMasterItem[]>([]);
  const [editItem, setEditItem] = useState<KPIMasterItem | null>(null);
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
    setIsDialogOpen(true);
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

        <KpiItemForm
          item={editItem}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditItem(null);
          }}
          onSuccess={() => setFetchTrigger(Date.now())}
        />
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default Points
