"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { PointsRow } from '@/features/points/types';

interface PointsActionsCellProps {
  row: PointsRow;
  onEdit?: (item: PointsRow) => void;
}

export default function PointsActionsCell({ row, onEdit }: PointsActionsCellProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => router.push(`/points/details?id=${row._id}`)}>
        Detail
      </Button>
      {onEdit && (
        <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
          Edit
        </Button>
      )}
    </div>
  );
}
