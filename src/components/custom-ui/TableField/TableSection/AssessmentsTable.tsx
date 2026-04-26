"use client";

import React, { useEffect, useState } from "react";
import { getKPIMeDetail } from '@/services/kpi/kpiService';
import { getKPIRankings } from "@/services/kpi/kpiService";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menubar } from "@/components/custom-ui/MenuBar";
import DialogField from "../../DialogField";
import { assessments } from "../headerConfig";

interface AssessmentItem {
  userId: string;
  rank?: number | string;
  name?: string;
  monthly?: number | string;
  status?: string;
  detail?: string;
  totalPoints?: number;
  year?: number;
  month?: number;
}

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  searchQuery?: string;
  month?: number;
  year?: number;
}

const AssessmentsTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  searchQuery = "",
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
}: Props) => {
  const headers = assessments[activePage];

  const [allRankingData, setAllRankingData] = useState<AssessmentItem[]>([]);
  const [rankingData, setRankingData] = useState<AssessmentItem[]>([]);
  interface KPIDetail {
    research?: {
      personal?: { count?: number; totalPoints?: number };
      product?: { count?: number; totalPoints?: number };
      workshop?: { count?: number; totalPoints?: number };
    };
    operational?: {
      picket?: { count?: number; totalPoints?: number };
      thematic?: { count?: number; totalPoints?: number };
    };
    attendance?: {
      present?: { count?: number; totalPoints?: number };
    };
    branding?: { count?: number; totalPoints?: number };
    competition?: { count?: number; totalPoints?: number };
  }
  const [kpiDetail, setKpiDetail] = useState<KPIDetail | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  useEffect(() => {
    getKPIRankings(year, month).then((res: unknown) => {
      const arr = Array.isArray(res) ? res as AssessmentItem[] : [];
      const sorted = arr.sort((a, b) => (Number(b.monthly ?? b.totalPoints ?? 0)) - (Number(a.monthly ?? a.totalPoints ?? a.totalPoints ?? 0)));
      setAllRankingData(sorted);
    });
  }, [year, month]);

  useEffect(() => {
    let filtered = allRankingData;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      filtered = allRankingData.filter(item =>
        (item.name?.toLowerCase().includes(q))
        || (item.userId?.toLowerCase().includes(q))
        || (item.status?.toLowerCase().includes(q))
        || (item.totalPoints?.toString().includes(q))
      );
    }
    setRankingData(filtered);
  }, [allRankingData, searchQuery]);

  useEffect(() => {
    if (activeUserId) {
      getKPIMeDetail(activeUserId, year, month)
        .then((detail) => setKpiDetail(detail.summary))
        .catch(() => setKpiDetail(null));
    } else {
      setKpiDetail(null);
    }
  }, [activeUserId, year, month]);


  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(assessments)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <div className="">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i} className="w-40 lg:w-full">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rankingData.length > 0 ? (
                rankingData.map((item, i: number) => {
                  let statusLabel = 'Not Safe';
                  let statusClass = 'text-warning';
                  if (item.totalPoints !== null && item.totalPoints !== undefined) {
                    if (item.totalPoints <= 150) {
                      statusLabel = 'Danger';
                      statusClass = 'text-destructive';
                    } else if (item.totalPoints <= 250) {
                      statusLabel = 'Warning';
                      statusClass = 'text-warning';
                    } else if (item.totalPoints <= 400) {
                      statusLabel = 'Safe';
                      statusClass = 'text-success';
                    } else if (item.totalPoints > 400) {
                      statusLabel = 'Excellent';
                      statusClass = 'text-primary';
                    }
                  }
                  const handleDialogTriggerClick = (item: AssessmentItem) => () => {
                    if (item.userId) {
                      setActiveUserId(item.userId);
                    }
                  };
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-center">{i + 1}</TableCell>
                      <TableCell className="text-center">{item.name?.split(" ")[0] ?? "-"}</TableCell>
                      <TableCell className="text-center">{item.totalPoints ?? "-"}</TableCell>
                      <TableCell className={`text-center font-semibold ${statusClass}`}>{statusLabel}</TableCell>
                      <TableCell className="text-center">
                        <DialogField
                          name="Detail"
                          title="Assessment Detail"
                          variant="outline"
                          noPadding
                          onTriggerClick={handleDialogTriggerClick(item)}
                        >
                          <div className="">
                            <p className="font-semibold">research</p>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Personal</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.research?.personal?.count ?? '-'} ({kpiDetail?.research?.personal?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">product</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.research?.product?.count ?? '-'} ({kpiDetail?.research?.product?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Workshop</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.research?.workshop?.count ?? '-'} ({kpiDetail?.research?.workshop?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                          </div>
                          <div className="">
                            <p className="font-semibold">operational</p>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Piket</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.operational?.picket?.count ?? '-'} ({kpiDetail?.operational?.picket?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Tematik</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.operational?.thematic?.count ?? '-'} ({kpiDetail?.operational?.thematic?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                          </div>
                          <div className="">
                            <p className="font-semibold">attendance</p>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Present</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.attendance?.present?.count ?? '-'} ({kpiDetail?.attendance?.present?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                          </div>
                          <div className="">
                            <p className="font-semibold">branding</p>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Branding</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.branding?.count ?? '-'} ({kpiDetail?.branding?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                          </div>
                          <div className="">
                            <p className="font-semibold">competition</p>
                            <div className="grid grid-cols-3 lg:grid-cols-12">
                              <p className="col-span-1 lg:col-span-2">Competition</p>
                              <p>:</p>
                              <p className="col-span-1 lg:col-span-4">
                                {kpiDetail?.competition?.count ?? '-'} ({kpiDetail?.competition?.totalPoints ?? '-'} Point)
                              </p>
                            </div>
                          </div>
                        </DialogField>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="text-center py-5">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentsTable;
