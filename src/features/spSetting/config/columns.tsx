"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import SPSettingActionsCell from '@/features/spSetting/components/SPSettingActionsCell';
import type { SPSettingRow } from '@/features/spSetting/types';

interface CreateSPSettingColumnsParams {
  onEdit: (item: SPSettingRow) => void;
  onDeleted?: () => void;
}

export function createSPSettingColumns({ onEdit, onDeleted }: CreateSPSettingColumnsParams): TableColumn<SPSettingRow>[] {
  return [
    { key: 'name', label: 'Name', className: 'text-center', sortable: true },
    { key: 'point', label: 'Point', className: 'text-center', sortable: true },
    {
      key: 'action' as keyof SPSettingRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <SPSettingActionsCell row={row} onEdit={onEdit} onDeleted={onDeleted} />,
    },
  ];
}
