"use client";

import React, { useEffect, useState } from "react";
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
  rank?: number | string;
  name?: string;
  monthly?: number | string;
  status?: string;
  detail?: string;
}

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: AssessmentItem[];
}

const AssessmentsTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: Props) => {
  const headers = assessments[activePage];

  const [rankingData, setRankingData] = useState<any[]>([]);
  useEffect(() => {
    getKPIRankings().then((res: any) => {
      const sorted = Array.isArray(res) ? res.sort((a, b) => (b.totalPoint ?? 0) - (a.totalPoint ?? 0)) : [];
      setRankingData(sorted);
    });
  }, []);


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
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rankingData.length > 0 ? (
                rankingData.map((item, i: number) => {
                  let statusLabel = 'Not Safe';
                  let statusClass = 'text-warning';
                  if (item.totalPoint !== null && item.totalPoint !== undefined) {
                    if (item.totalPoint <= 150) {
                      statusLabel = 'Danger';
                      statusClass = 'text-destructive';
                    } else if (item.totalPoint <= 250) {
                      statusLabel = 'Warning';
                      statusClass = 'text-warning';
                    } else if (item.totalPoint <= 400) {
                      statusLabel = 'Safe';
                      statusClass = 'text-success';
                    } else if (item.totalPoint > 400) {
                      statusLabel = 'Excellent';
                      statusClass = 'text-primary';
                    }
                  }
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-center">{i + 1}</TableCell>
                      <TableCell className="text-center">{item.name?.split(" ")[0] ?? "-"}</TableCell>
                      <TableCell className="text-center">{item.totalPoint ?? "-"}</TableCell>
                      <TableCell className={`text-center font-semibold ${statusClass}`}>{statusLabel}</TableCell>
                      <TableCell className="text-center">
                        <DialogField
                          name="Detail"
                          title="Assessment Detail"
                          variant="outline"
                          noPadding
                        >
                          <p>Year: {item.year ?? "-"}, Month: {item.month ?? "-"}</p>
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
