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
import { Menubar } from "../../../MenuBar";
import { report } from "../../headerConfig";
import DialogField from "../../../DialogField";
import {
  getResearchById,
  updateResearchRecord,
} from "@/services/research/researchService";
import { DropdownField } from "../../../DropdownField";
import InputField from "../../../InputField";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import { getStatusColor } from "@/utils/statusColor";

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

  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [progress, setProgress] = useState("");
  const [link, setLink] = useState("");
  const [challenge, setChallenge] = useState("");

  const handleOpenEdit = async (id: string) => {
  try {
    const research = await getResearchById(id);
    setSelectedResearch(research);

    setTitle(research.title || "");
    setWeek(`Week ${research.week}`);
    setProgress(
      research.progress
        ? research.progress.charAt(0).toUpperCase() + research.progress.slice(1)
        : ""
    );
    setLink(research.link || "");
    setChallenge(research.challenge || "");
  } catch (error) {
    showErrorToast("Gagal memuat data untuk edit.", { duration: 5000 });
  }
};


  const handleEditSubmit = async () => {
    if (!selectedResearch?._id) return;

    if (!title || !week || !progress) {
      showErrorToast("Harap isi semua field wajib (Title, Week, Progress)", {
        duration: 5000,
      });
      return;
    }

    if (link && !/^https:\/\/.+/i.test(link)) {
      showErrorToast("Link harus diawali dengan 'https://'", {
        duration: 5000,
      });
      return;
    }

    const payload = {
      week: parseInt(week.replace("Week ", "")) || 1,
      title,
      link: link || "https://example.com/research",
      progress: progress.toLowerCase(),
      challenge,
    };

    try {
      await updateResearchRecord(selectedResearch._id, payload);
      toast.success("Data berhasil diperbarui!");
      setOpenEditId(null);
    } catch (error) {
      showErrorToast("Gagal memperbarui data.", { duration: 5000 });
    }
  };

  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    setOpenDetailId(id);
    try {
      const research = await getResearchById(id);
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
                <TableCell className="text-center">{`Week ${item.week}`}</TableCell>
                <TableCell className="text-center">{item.progress}</TableCell>
                <TableCell className="text-center">
                  <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(item.status)}`}>
                    {item.status?.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-3 justify-center">
                    {(() => {
                      const isEditLinkValid = link.startsWith("https://");
                      const isEditFormIncomplete = !title || !week || !progress || !link || !challenge || !isEditLinkValid;
                      return (
                        <DialogField
                          name="Edit"
                          title="Edit Plan"
                          variant="outline"
                          noPadding
                          open={openEditId === item._id}
                          onOpenChange={(isOpen) => setOpenEditId(isOpen ? item._id : null)}
                          onTriggerClick={() => handleOpenEdit(item._id)}
                          onSubmit={handleEditSubmit}
                          submitDisabled={isEditFormIncomplete}
                        >
                          <div className="flex flex-col gap-5">
                            <InputField
                              type="string"
                              placeholder="Ex: Learn how to make responsive web"
                              label="Title"
                              value={title}
                              onChange={(e: any) => setTitle(e.target.value)}
                            />

                            <div className="flex gap-5">
                              <DropdownField
                                key="week-input"
                                title="Choose Week"
                                menu={["Week 1", "Week 2", "Week 3", "Week 4"]}
                                label="Week"
                                value={week}
                                onChange={(value) => setWeek(value)}
                              />
                              <DropdownField
                                key="progress-input"
                                title="Your Progress"
                                menu={["Finished", "Unfinished"]}
                                label="Progress"
                                value={progress}
                                onChange={(value) => setProgress(value)}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <InputField
                                type="string"
                                placeholder="Ex: https://github.com/unikom-codelabs/"
                                label="Link"
                                value={link}
                                onChange={(e: any) => setLink(e.target.value)}
                              />
                              {link && !isEditLinkValid && (
                                <span className="text-xs text-red-500">Link harus diawali dengan 'https://'</span>
                              )}
                            </div>

                            <Textarea
                              label="Challenge"
                              placeholder="Ex: Ada kendala pada fitur upload gambar..."
                              value={challenge}
                              onChange={(e: any) => setChallenge(e.target.value)}
                            />
                          </div>
                        </DialogField>
                      );
                    })()}

                    <DialogField
                      name="Detail"
                      title="Detail Plan"
                      variant="outline"
                      noPadding 
                      open={openDetailId === item._id}
                      onOpenChange={(isOpen) =>
                        setOpenDetailId(isOpen ? item._id : null)
                      }
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