"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteSPSetting } from '@/services/spSetting/spSettingService';
import { handleError } from '@/shared/services';
import type { SPSettingRow } from '@/features/spSetting/types';

interface SPSettingActionsCellProps {
  row: SPSettingRow;
  onEdit: (item: SPSettingRow) => void;
  onDeleted?: () => void;
}

export default function SPSettingActionsCell({ row, onEdit, onDeleted }: SPSettingActionsCellProps) {
  const handleDelete = async () => {
    if (!window.confirm(`Hapus SP setting "${row.name}"?`)) return;
    try {
      await deleteSPSetting(row._id);
      toast.success('SP setting deleted successfully!');
      onDeleted?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Failed to delete SP setting.');
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
