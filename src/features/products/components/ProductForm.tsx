"use client"

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { postProduct, editProduct } from '@/services/product/productsService';
import { handleError } from '@/shared/services';
import { productSchema, type ProductForm as ProductFormValues } from '@/features/products/config/schemas';
import type { ProductRow } from '@/features/products/types';

interface ProductFormProps {
  mode?: 'create' | 'edit';
  product?: ProductRow;
  onSuccess?: () => void;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: '',
  description: '',
  status: 'active',
};

function toDefaultValues(product?: ProductRow): ProductFormValues {
  if (!product) return DEFAULT_VALUES;
  return {
    name: product.name ?? '',
    description: product.description ?? '',
    status: product.status === 'inactive' ? 'inactive' : 'active',
  };
}

export default function ProductForm({ mode = 'create', product, onSuccess }: ProductFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: toDefaultValues(product),
  });

  useEffect(() => {
    if (isDialogOpen) {
      reset(toDefaultValues(product));
    }
  }, [isDialogOpen, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (mode === 'edit' && product) {
        await editProduct(product._id, values);
        toast.success('Product updated successfully!');
      } else {
        await postProduct(values);
        setSuccess(true);
        toast.success('Product added successfully!');
      }
      setIsDialogOpen(false);
      onSuccess?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Failed to save product.');
    } finally {
      setTimeout(() => setSuccess(false), 1200);
    }
  };

  return (
    <DialogField
      name={mode === 'edit' ? 'Edit' : 'Add Product'}
      title={mode === 'edit' ? 'Edit Product' : 'Add Product'}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onSubmit={() => handleSubmit(onSubmit)()}
      submitDisabled={!isValid || isSubmitting}
    >
      <form className="flex flex-col gap-3 min-w-56" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: Product Name"
              label="Product Name"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: Product Description"
              label="Product Description"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <DropdownField
              key="status-input"
              title="Choose Status"
              menu={['active', 'inactive']}
              label="Status"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {success && <p className="text-green-600 text-sm">Added successfully!</p>}
      </form>
    </DialogField>
  );
}
