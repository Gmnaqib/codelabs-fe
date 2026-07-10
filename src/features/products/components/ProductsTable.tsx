"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createProductColumns } from '@/features/products/config/columns';
import { useProductsTable } from '@/features/products/hooks/useProductsTable';

interface ProductsTableProps {
  fetchTrigger?: number;
  [key: string]: unknown;
}

export default function ProductsTable({ fetchTrigger }: ProductsTableProps) {
  const { data, loading, error } = useProductsTable({ fetchTrigger });
  const columns = useMemo(() => createProductColumns(), []);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Tidak ada data produk"
    />
  );
}
