"use client"

import React, { useMemo, useState } from 'react';
import { Menubar } from '@/components/custom-ui/MenuBar';
import { BaseTable } from '@/features/table/components';
import EmptyState from '@/components/custom-ui/EmptyState';
import { useTableStore } from '@/shared/state';
import { useScoringTable } from '@/features/scoring/hooks/useScoringTable';
import {
  createBrandingColumns,
  createCompetitionColumns,
  createOperationalColumns,
  createResearchColumns,
} from '@/features/scoring/config/columns';
import AddCompetitionDialog from './AddCompetitionDialog';
import AddBrandingDialog from './AddBrandingDialog';
import type { ScoringTab, SummaryRow } from '@/features/scoring/types';

const SCORING_TABS: ScoringTab[] = ['Research', 'Operational', 'Competition', 'Branding'];

interface ScoringTableProps {
  showMenu?: boolean;
  [key: string]: unknown;
}

export default function ScoringTable({ showMenu = true }: ScoringTableProps) {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const setDateRange = useTableStore((s) => s.setDateRange);

  const {
    activeTab,
    setActiveTab,
    myResearch,
    myOperational,
    competitionData,
    loadingCompetition,
    competitionCategories,
    competitionHasAnyData,
    brandingData,
    loadingBranding,
    brandingCategories,
    brandingHasAnyData,
    addCompetitionEntry,
    addBrandingEntry,
    editCompetitionEntry,
    editBrandingEntry,
  } = useScoringTable();

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const researchRows: SummaryRow[] = useMemo(
    () => [
      {
        _id: 'research',
        label: 'Conduct research Responses',
        total: myResearch?.totalApproved ?? 0,
        point: myResearch?.totalPoint ?? 0,
      },
    ],
    [myResearch]
  );

  const operationalRows: SummaryRow[] = useMemo(
    () => [
      { _id: 'daily', label: 'Daily Attendance', total: myOperational?.totalAttendance ?? 0, point: myOperational?.pointAttendance ?? 0 },
      { _id: 'thematic', label: 'Thematic Attendance', total: myOperational?.totalTematik ?? 0, point: myOperational?.pointTematik ?? 0 },
      { _id: 'picket', label: 'Picket Attendance', total: myOperational?.totalPicket ?? 0, point: myOperational?.pointPicket ?? 0 },
    ],
    [myOperational]
  );

  const researchColumns = useMemo(() => createResearchColumns(), []);
  const operationalColumns = useMemo(() => createOperationalColumns(), []);
  const competitionColumns = useMemo(
    () => createCompetitionColumns({ onEdit: editCompetitionEntry }),
    [editCompetitionEntry]
  );
  const brandingColumns = useMemo(
    () => createBrandingColumns({ categories: brandingCategories, onEdit: editBrandingEntry }),
    [brandingCategories, editBrandingEntry]
  );

  return (
    <div className="w-full rounded-lg px-5">
      {showMenu && (
        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
          <div className={`w-full flex lg:mb-0${activeTab === 'Research' || activeTab === 'Operational' ? ' mb-5' : ''}`}>
            <Menubar
              menus={SCORING_TABS}
              activeMenu={activeTab}
              onChange={(menu) => setActiveTab(menu as ScoringTab)}
              filter
              search={false}
              filterProps={{
                onChange: ({ year: y, month: m }) => setDateRange(m + 1, y),
                defaultYear: year,
                defaultMonth: month - 1,
              }}
            />
          </div>

          {(activeTab === 'Competition' || activeTab === 'Branding') && (
            <div className="flex justify-center mb-5 lg:mb-0 lg:mt-1">
              {activeTab === 'Competition' ? (
                <AddCompetitionDialog
                  open={openAddDialog}
                  onOpenChange={setOpenAddDialog}
                  categories={competitionCategories}
                  onSubmit={addCompetitionEntry}
                />
              ) : (
                <AddBrandingDialog
                  open={openAddDialog}
                  onOpenChange={setOpenAddDialog}
                  categories={brandingCategories}
                  onSubmit={addBrandingEntry}
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto w-full">
        {activeTab === 'Research' && (
          <BaseTable data={researchRows} columns={researchColumns} emptyMessage="Tidak ada data untuk halaman ini." />
        )}
        {activeTab === 'Operational' && (
          <BaseTable data={operationalRows} columns={operationalColumns} emptyMessage="Tidak ada data untuk halaman ini." />
        )}
        {activeTab === 'Competition' && (
          <BaseTable
            data={competitionData}
            columns={competitionColumns}
            loading={loadingCompetition}
            emptyMessage={
              competitionHasAnyData ? (
                'No data available for this page.'
              ) : (
                <EmptyState message="No data available for this page." />
              )
            }
            paginate
          />
        )}
        {activeTab === 'Branding' && (
          <BaseTable
            data={brandingData}
            columns={brandingColumns}
            loading={loadingBranding}
            emptyMessage={
              brandingHasAnyData ? (
                'No data available for this page.'
              ) : (
                <EmptyState message="No data available for this page." />
              )
            }
            paginate
          />
        )}
      </div>
    </div>
  );
}
