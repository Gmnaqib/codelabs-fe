"use client"

import React from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import type { ProductRow } from '@/features/products/types';

interface ProductDetailCellProps {
  row: ProductRow;
}

export default function ProductDetailCell({ row }: ProductDetailCellProps) {
  return (
    <DialogField variant="outline" name="Detail" title="Detail Product" size="sm">
      <div>
        <p className="font-semibold">Produce Name</p>
        <p>{row.name}</p>
      </div>
      <div>
        <p className="font-semibold">Produce Description</p>
        <p>{row.description}</p>
      </div>
      <div>
        <p className="font-semibold">Produce Status</p>
        <p>{row.status}</p>
      </div>
    </DialogField>
  );
}
