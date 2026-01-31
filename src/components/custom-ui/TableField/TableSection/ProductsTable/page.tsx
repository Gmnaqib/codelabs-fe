import { ReportTableProps } from '@/types/ReportTableProps';
import React, { useEffect, useState } from 'react'
import { products } from '../../headerConfig';
import { Menubar } from '@/components/custom-ui/MenuBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getProducts, editProduct } from '@/services/product/productsService';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { ChangeEvent } from 'react';
import { DropdownField } from '@/components/custom-ui/DropdownField';

const ProductsTable = ({
  activePage,
  onPageChange,
  showMenu = true,
}: ReportTableProps) => {

  const productHeaders = products[activePage] ?? [];
  const [productData, setProductData] = useState<{ _id: string; name: string; description: string; status: string  }[]>([]);

  // State untuk edit produk
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [successEdit, setSuccessEdit] = useState(false);

  // Saat dialog edit dibuka, set data
  const handleOpenEdit = (product: { _id: string; name: string; description: string; status: string }) => {
    setEditId(product._id);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditStatus(product.status);
  };

  // Submit edit
  const handleEditSubmit = async () => {
    if (!editId) return;
    setLoadingEdit(true);
    try {
      await editProduct(editId, {
        productManager: editId,
        name: editName,
        description: editDescription,
        status: editStatus,
      });
      setSuccessEdit(true);
      // refresh data
      const data = await getProducts();
      setProductData(data);
      setEditId(null);
    } catch {
      // handle error
    } finally {
      setLoadingEdit(false);
      setTimeout(() => setSuccessEdit(false), 1200);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProductData(data);
      } catch {
        setProductData([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {showMenu && (
        <Menubar
          menus={Object.keys(products)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {productHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
          <TableBody>
            {productData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={productHeaders.length} className="text-center">Tidak ada data produk</TableCell>
              </TableRow>
            ) : (
              productData.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className='text-center'>{product.name}</TableCell>
                  <TableCell className='gap-3 flex w-full justify-center'>
                    <DialogField
                      variant='outline'
                      name="Detail"
                      title="Detail Product"
                      size="sm"
                    >
                      <div className="">
                        <p className='font-semibold'>Produce Name</p>
                        <p>{product.name}</p>
                      </div>
                      <div className="">
                        <p className='font-semibold'>Produce Description</p>
                        <p>{product.description}</p>
                      </div>
                      <div className="">
                        <p className='font-semibold'>Produce Status</p>
                        <p>{product.status}</p>
                      </div>
                    </DialogField>
                    <DialogField
                      variant='outline'
                      name="Edit"
                      title="Edit Product"
                      size="sm"
                      onSubmit={handleEditSubmit}
                      open={editId === product._id}
                      onOpenChange={(isOpen) => {
                        if (isOpen) handleOpenEdit(product);
                        else setEditId(null);
                      }}
                    >
                      <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
                        <InputField
                          type="string"
                          placeholder="Ex: Product Name"
                          label="Product Name"
                          value={editId === product._id ? editName : product.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                        />
                        <InputField
                          type="string"
                          placeholder="Ex: Product Description"
                          label="Product Description"
                          value={editId === product._id ? editDescription : product.description}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditDescription(e.target.value)}
                        />
                        <DropdownField
                          key="status-input"
                          title="Choose Status"
                          menu={["active", "inactive"]}
                          label="Status"
                          value={editId === product._id ? editStatus : product.status}
                          onChange={(value: string) => setEditStatus(value)}
                        />
                      </form>
                    </DialogField>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
      </Table>
    </div>
  )
}

export default ProductsTable
