"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOperationalStore, type OperationalTab } from '@/features/operational/state';
import { useOperationalTable } from '@/features/operational/hooks';
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
  { key: 'picket', label: 'Picket' },
  { key: 'thematic', label: 'Thematic' },
];

export default function OperationalTable({ showMenu, searchQuery = '' }: OperationalTableProps) {
  const activeTab = useOperationalStore((s) => s.activeTab);
  const setActiveTab = useOperationalStore((s) => s.setActiveTab);
  const { users, loading, error } = useOperationalTable();

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10 p-4 text-destructive">
        {error.message}
      </Card>
    );
  }

  const tabProps = { users, loading, searchQuery, showMenu };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'absence' && <AbsenceTab {...tabProps} />}
      {activeTab === 'picket' && <PicketTab {...tabProps} />}
      {activeTab === 'thematic' && <ThematicTab {...tabProps} />}
    </div>
  );
}
