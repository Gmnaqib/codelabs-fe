"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, ChangeEvent } from 'react'
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { createKPIItem } from '@/services/points/pointsService';
import { toast } from 'sonner';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'

const Points = () => {
  const [activePage, setActivePage] = useState<string>("points");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [code, setCode] = useState("");
  const [point, setPoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");


  const isFormIncomplete = !category || !code || !point;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createKPIItem({ category, code, point: Number(point) });
      setSuccess(true);
      setIsDialogOpen(false);
      setCategory("");
      setCode("");
      setPoint("");
      setFetchTrigger(Date.now());
      toast.success("Point added successfully!");
    } catch {
      toast.error("Failed to add point.");
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
            name="Add Point"
            title="Add Point"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            submitDisabled={isFormIncomplete || loading}
          >
            <form className="flex flex-col gap-3 min-w-56" onSubmit={e => e.preventDefault()}>
              <DropdownField
                label="Category"
                menu={["OPERATIONAL", "RESEARCH", "BRANDING", "COMPETITION"]}
                value={category}
                onChange={setCategory}
              />
              <InputField
                type="string"
                placeholder="Ex: THEMATIC"
                label="Code"
                value={code}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Ex: 5"
                label="Point"
                value={point}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPoint(e.target.value)}
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

export default Points
