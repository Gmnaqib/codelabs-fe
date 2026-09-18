"use client"

import React from 'react';
import ProductForm from '@/features/products/components/ProductForm';
import type { ProductRow } from '@/features/products/types';

interface ProductDetailCellProps {
  row: ProductRow;
  onUpdated?: () => void;
}

export default function ProductDetailCell({ row, onUpdated }: ProductDetailCellProps) {
  return <ProductForm mode="edit" product={row} onSuccess={onUpdated} />;
}
