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
  attendance: lazyTable(() => import('@/features/attendance/components/AttendanceTable')),
  scoring: lazyTable(() => import('@/features/scoring/components/ScoringTable')),
  members: lazyTable(() => import('@/features/members/components/MembersTable')),
  assessments: lazyTable(() => import('@/features/assessments/components/AssessmentsTable')),
  branding: lazyTable(() => import('@/features/branding/components/BrandingTable')),
  competition: lazyTable(() => import('@/features/competition/components/CompetitionTable')),
  ristek: lazyTable(() => import('@/features/ristek/components/RistekTable')),
  operational: lazyTable(() => import('@/features/operational/components/OperationalTable')),
  'picket-schedule': lazyTable(() => import('@/features/picket/components/PicketScheduleTable')),
  'thematic-schedule': lazyTable(() => import('@/features/thematic/components/ThematicScheduleTable')),
  'points-detail': lazyTable(() => import('@/features/points/components/PointsDetailTable')),
  points: lazyTable(() => import('@/features/points/components/PointsTable')),
  products: lazyTable(() => import('@/features/products/components/ProductsTable')),
  report: lazyTable(() => import('@/features/report/components/ReportTable')),
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
