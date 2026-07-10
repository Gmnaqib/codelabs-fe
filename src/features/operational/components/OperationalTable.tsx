"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Menubar } from '@/components/custom-ui/MenuBar';
import { useOperationalStore, type OperationalTab } from '@/features/operational/state';
import { useOperationalTable } from '@/features/operational/hooks';
import { useTableStore } from '@/shared/state';
import { exportOperationalExcel } from '@/features/operational/utils/exportExcel';
import AbsenceTab from './tabs/AbsenceTab';
import PicketTab from './tabs/PicketTab';
import ThematicTab from './tabs/ThematicTab';

interface OperationalTableProps {
  showMenu?: boolean;
  searchQuery?: string;
  // Accepts and ignores legacy props still passed by the pre-migration
  // TableField.tsx callsite (activePage, onPageChange, month, year, etc.)
  // until it is migrated to TableDispatcher in STEP 50.
  [key: string]: unknown;
}

const TABS: { key: OperationalTab; label: string }[] = [
  { key: 'absence', label: 'Absence' },
  { key: 'thematic', label: 'Thematic' },
  { key: 'picket', label: 'Picket' },
];

export default function OperationalTable({ showMenu }: OperationalTableProps) {
  const activeTab = useOperationalStore((s) => s.activeTab);
  const setActiveTab = useOperationalStore((s) => s.setActiveTab);
  const { users, loading, error } = useOperationalTable();
  const month = useTableStore((s) => s.month);
  const year = useTableStore((s) => s.year);
  const searchQuery = useTableStore((s) => s.searchQuery);
  const setSearchQuery = useTableStore((s) => s.setSearchQuery);
  const setDateRange = useTableStore((s) => s.setDateRange);
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportOperationalExcel(year, month);
    } catch {
      toast.error('Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10 p-4 text-destructive">
        {error.message}
      </Card>
    );
  }

  const tabProps = { users, loading, searchQuery, showMenu };
  const activeLabel = TABS.find((tab) => tab.key === activeTab)?.label ?? TABS[0].label;

  const handleTabChange = (label: string) => {
    const found = TABS.find((tab) => tab.label === label);
    if (found) setActiveTab(found.key);
  };

  return (
    <div className="flex flex-col gap-4">
      <Menubar
        menus={TABS.map((tab) => tab.label)}
        activeMenu={activeLabel}
        onChange={handleTabChange}
        filter
        operational
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onExportExcel={handleExportExcel}
        filterProps={{
          onChange: ({ month: m, year: y }) => setDateRange(m + 1, y),
          defaultMonth: month - 1,
          defaultYear: year,
        }}
      />

      {activeTab === 'absence' && <AbsenceTab {...tabProps} />}
      {activeTab === 'picket' && <PicketTab {...tabProps} />}
      {activeTab === 'thematic' && <ThematicTab {...tabProps} />}
    </div>
  );
}
