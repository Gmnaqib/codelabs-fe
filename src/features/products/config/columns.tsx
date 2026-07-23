"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import ProductDetailCell from '@/features/products/components/ProductDetailCell';
import type { ProductRow } from '@/features/products/types';

export function createProductColumns(): TableColumn<ProductRow>[] {
  return [
    { key: 'name', label: 'Product', className: 'text-center', sortable: true },
    {
      key: 'action' as keyof ProductRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <ProductDetailCell row={row} />,
    },
  ];
}
