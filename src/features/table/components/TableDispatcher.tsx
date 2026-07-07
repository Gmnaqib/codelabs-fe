"use client"

import React from 'react';
import type { TablePage } from '@/shared/state/tableStore';

type DispatchableComponent = React.ComponentType<Record<string, unknown>>;

function lazyTable<P extends object>(
  loader: () => Promise<{ default: React.ComponentType<P> }>
): React.LazyExoticComponent<DispatchableComponent> {
  return React.lazy(() =>
    loader().then((mod) => ({
      default: mod.default as unknown as DispatchableComponent,
    }))
  );
}

const ComingSoon: DispatchableComponent = () => <div>Coming soon</div>;

const TABLE_COMPONENTS: Record<
  TablePage,
  React.LazyExoticComponent<DispatchableComponent> | DispatchableComponent
> = {
  attendance: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/AttendanceTable')),
  scoring: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/ScoringTable')),
  members: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/MembersTable')),
  assessments: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/AssessmentsTable')),
  branding: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/BrandingTable')),
  competition: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/CompetitionTable')),
  ristek: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/RistekTable')),
  operational: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/OperationalTable')),
  'picket-schedule': lazyTable(() => import('@/components/custom-ui/TableField/TableSection/PicketScheduleTable/page')),
  'points-detail': lazyTable(() => import('@/components/custom-ui/TableField/TableSection/PointsDetailTable/page')),
  points: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/PointsTable/page')),
  products: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/ProductsTable/page')),
  report: lazyTable(() => import('@/components/custom-ui/TableField/TableSection/ReportTable/page')),
  organization: ComingSoon,
};

interface TableDispatcherProps {
  page: TablePage;
  [key: string]: unknown;
}

export function TableDispatcher({ page, ...rest }: TableDispatcherProps) {
  const Component = TABLE_COMPONENTS[page];

  if (!Component) {
    return <div>Unknown table: {page}</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...rest} />
    </React.Suspense>
  );
}
