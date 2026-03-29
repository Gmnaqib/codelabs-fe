"use client";
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, ChangeEvent } from 'react'
import { postProduct } from '@/services/product/productsService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper';

const Product = () => {
  const [activePage, setActivePage] = useState<string>("products");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const isFormIncomplete = !name || !description || !status;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await postProduct({ name, description, status });
      setSuccess(true);
      setIsDialogOpen(false);
      setName("");
      setDescription("");
      setStatus("active");
      setFetchTrigger(Date.now());
      toast.success("Product added successfully!");
    } catch {
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 1200);
    }
  };

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <DialogField
            name="Add Product"
            title="Add Product"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            submitDisabled={isFormIncomplete || loading}
          >
            <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
              <InputField
                type="string"
                placeholder="Ex: Product Name"
                label="Product Name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
              <InputField
                type="string"
                placeholder="Ex: Product Description"
                label="Product Description"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              />
              <DropdownField
                key="status-input"
                title="Choose Status"
                menu={["active", "inactive"]}
                label="Status"
                value={status}
                onChange={(value: string) => setStatus(value)}
              />
              {success && <p className="text-green-600 text-sm">Berhasil ditambahkan!</p>}
            </form>
          </DialogField>
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
