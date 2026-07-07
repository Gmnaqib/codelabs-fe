"use client";
import InputField from '@/components/custom-ui/InputField';
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState } from 'react'
import MotionWrapper from '@/components/custom-ui/MotionWrapper';
import { useTableStore } from '@/shared/state';
import ProductForm from '@/features/products/components/ProductForm';

const Product = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const [activePage, setActivePage] = useState<string>("products");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ProtectedRoute roles={['admin', 'minister of research']}>
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
          <ProductForm onSuccess={() => setFetchTrigger(Date.now())} />
        </div>
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

export default Product
