"use client"
import SPSettingTable from '@/features/spSetting/components/SPSettingTable'
import SPSettingFormDialog from '@/features/spSetting/components/SPSettingFormDialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState } from 'react'
import InputField from '@/components/custom-ui/InputField';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { useTableStore } from '@/shared/state'
import type { SPSettingRow } from '@/features/spSetting/types'

const SPSettingPage = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<SPSettingRow | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddClick = () => {
    setEditItem(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (item: SPSettingRow) => {
    setEditItem(item);
    setIsDialogOpen(true);
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <MotionWrapper>
        <div className="flex justify-between mb-10 flex-col lg:flex-row gap-4 lg:gap-0">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setGlobalSearchQuery(e.target.value);
            }}
          />
          <Button onClick={handleAddClick}>Add SP</Button>
        </div>
        <Card className='p-5'>
          <SPSettingTable
            fetchTrigger={fetchTrigger}
            onEdit={handleEditClick}
          />
        </Card>

        <SPSettingFormDialog
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

export default SPSettingPage
