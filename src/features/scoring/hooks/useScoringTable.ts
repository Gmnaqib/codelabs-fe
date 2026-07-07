import { useCallback, useEffect, useState } from 'react';
import { useTableStore } from '@/shared/state';
import {
  getKPIMeResearch,
  getKPIMeOperational,
  getKPIItemsByKementerian,
} from '@/services/kpi/kpiService';
import {
  getMeCompetition,
  addCompetition,
  updateCompetition,
  type CompetitionPayload,
} from '@/services/competition/competitionService';
import {
  getMyBranding,
  addBranding,
  updateBranding,
} from '@/services/branding/brandingService';
import type {
  BrandingRow,
  CompetitionRow,
  OperationalSummary,
  ResearchSummary,
  ScoringTab,
} from '@/features/scoring/types';

export function useScoringTable() {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);

  const [activeTab, setActiveTab] = useState<ScoringTab>('Research');

  const [myResearch, setMyResearch] = useState<ResearchSummary | null>(null);
  const [myOperational, setMyOperational] = useState<OperationalSummary | null>(null);

  const [competitionData, setCompetitionData] = useState<CompetitionRow[]>([]);
  const [loadingCompetition, setLoadingCompetition] = useState(false);
  const [competitionCategories, setCompetitionCategories] = useState<string[]>([]);

  const [brandingData, setBrandingData] = useState<BrandingRow[]>([]);
  const [loadingBranding, setLoadingBranding] = useState(false);
  const [brandingCategories, setBrandingCategories] = useState<string[]>([]);

  const refetchCompetition = useCallback(() => {
    return getMeCompetition(year, month).then((res) => setCompetitionData(res || []));
  }, [year, month]);

  const refetchBranding = useCallback(() => {
    return getMyBranding(year, month).then((res) => setBrandingData(res || []));
  }, [year, month]);

  useEffect(() => {
    if (activeTab === 'Competition') {
      setLoadingCompetition(true);
      refetchCompetition().finally(() => setLoadingCompetition(false));
      if (competitionCategories.length === 0) {
        getKPIItemsByKementerian('competition')
          .then(setCompetitionCategories)
          .catch(() => setCompetitionCategories([]));
      }
    } else if (activeTab === 'Branding') {
      setLoadingBranding(true);
      refetchBranding().finally(() => setLoadingBranding(false));
      if (brandingCategories.length === 0) {
        getKPIItemsByKementerian('branding')
          .then(setBrandingCategories)
          .catch(() => setBrandingCategories([]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, year, month]);

  useEffect(() => {
    if (activeTab === 'Research') {
      getKPIMeResearch(year, month).then((res) => setMyResearch(res || {}));
    } else if (activeTab === 'Operational') {
      getKPIMeOperational(year, month).then((res) => setMyOperational(res || {}));
    }
  }, [activeTab, year, month]);

  const addCompetitionEntry = useCallback(
    async (payload: CompetitionPayload) => {
      await addCompetition(payload);
      await refetchCompetition();
    },
    [refetchCompetition]
  );

  const addBrandingEntry = useCallback(
    async (payload: Record<string, unknown>) => {
      await addBranding(payload);
      await refetchBranding();
    },
    [refetchBranding]
  );

  const editCompetitionEntry = useCallback(
    async (id: string, payload: CompetitionPayload) => {
      await updateCompetition(id, payload);
      await refetchCompetition();
    },
    [refetchCompetition]
  );

  const editBrandingEntry = useCallback(
    async (id: string, payload: Record<string, unknown>) => {
      await updateBranding(id, payload);
      await refetchBranding();
    },
    [refetchBranding]
  );

  return {
    activeTab,
    setActiveTab,
    year,
    month,
    myResearch,
    myOperational,
    competitionData,
    loadingCompetition,
    competitionCategories,
    brandingData,
    loadingBranding,
    brandingCategories,
    addCompetitionEntry,
    addBrandingEntry,
    editCompetitionEntry,
    editBrandingEntry,
  };
}
