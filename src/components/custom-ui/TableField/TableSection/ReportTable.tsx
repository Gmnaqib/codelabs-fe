"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { report } from "../headerConfig";
import DialogField from "../../DialogField";
import { getResearchById } from "@/services/research/researchService";
import { DropdownField } from "../../DropdownField";
import InputField from "../../InputField";
import { Textarea } from "@/components/ui/textarea";

interface ReportTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: Record<string, any>[];
}

const ReportTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  researchData = [],
}: ReportTableProps) => {
  const reportKey = Object.keys(report)[0];
  const reportHeaders = report[reportKey] ?? [];

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    setIsDetailOpen(true);
    try {
      const res = await getResearchById(id);
      const research =
        Array.isArray(res.data) ? res.data[0] : res.data || res;
      setSelectedResearch(research);
    } catch (error) {
      console.error("Failed to fetch research detail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(report)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {reportHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {researchData.length > 0 ? (
            researchData.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="text-center">{item.title}</TableCell>
                <TableCell className="text-center">
                  {`Week ${item.week}`}
                </TableCell>
                <TableCell className="text-center">{item.progress}</TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-3 justify-center">
                    {/* 🧩 Edit Dialog */}
                    <DialogField
                      name="Edit"
                      title="Edit Plan"
                      variant="outline"
                      open={isEditOpen}
                      onOpenChange={setIsEditOpen}
                    >
                      <div className="flex flex-col gap-5">
                        <InputField
                          type="string"
                          placeholder="Ex: Learn how to make responsive web"
                          label="Title"
                        />

                        <div className="flex gap-5">
                          <DropdownField
                            key="week-input"
                            title="Choose Week"
                            menu={["Week 1", "Week 2", "Week 3", "Week 4"]}
                            label="Week"
                          />
                          <DropdownField
                            key="progress-input"
                            title="Your Progress"
                            menu={["Finished", "Unfinished"]}
                            label="Progress"
                          />
                        </div>

                        <InputField
                          type="string"
                          placeholder="Ex: https://github.com/unikom-codelabs/"
                          label="Link"
                        />

                        <Textarea
                          label="Challenge"
                          placeholder="Ex: Ada kendala pada fitur upload gambar..."
                        />
                      </div>
                    </DialogField>

                    <DialogField
                      name="Detail"
                      title="Detail Plan"
                      variant="outline"
                      open={isDetailOpen}
                      onOpenChange={setIsDetailOpen}
                      onTriggerClick={() => handleOpenDetail(item._id)}
                    >
                      {loadingDetail ? (
                        <p className="text-center text-sm text-gray-500">
                          Loading...
                        </p>
                      ) : selectedResearch ? (
                        <div className="flex flex-col gap-5 text-lg">
                          <div>
                            <p className="font-semibold">Title</p>
                            <p>{selectedResearch.title}</p>
                          </div>

                          <div>
                            <p className="font-semibold">Week</p>
                            <p>{selectedResearch.week}</p>
                          </div>

                          <div>
                            <p className="font-semibold">Progress</p>
                            <p>{selectedResearch.progress}</p>
                          </div>

                          <div>
                            <p className="font-semibold">Output Link</p>
                            <a
                              href={selectedResearch.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {selectedResearch.link}
                            </a>
                          </div>

                          <div>
                            <p className="font-semibold">Problem</p>
                            <p>{selectedResearch.challenge}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center">
                          No data found
                        </p>
                      )}
                    </DialogField>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders.length}
                className="text-center py-6"
              >
                Tidak ada data research
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTable;
