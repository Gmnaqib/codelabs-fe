"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { scoring } from "../headerConfig";
import { ScoringTableProps } from "@/types/ScoringTableProps";
import { getMeCompetition, getCompetitionById, updateCompetition } from "@/services/competition/competitionService";
import { getMyBranding, getBrandingById, updateBranding } from "@/services/branding/brandingService";
import DialogField from "../../DialogField";
import InputField from "../../InputField";
import { DropdownField } from "../../DropdownField";
import { Textarea } from "@/components/ui/textarea";


const ScoringTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: ScoringTableProps) => {
  const scoringHeaders = scoring[activePage] ?? [];

  const [competitionData, setCompetitionData] = useState<any[]>([]);
  const [loadingCompetition, setLoadingCompetition] = useState(false);
  const [brandingData, setBrandingData] = useState<any[]>([]);
  const [loadingBranding, setLoadingBranding] = useState(false);
  const [openBrandingDetailId, setOpenBrandingDetailId] = useState<string | null>(null);
  const [loadingBrandingDetail, setLoadingBrandingDetail] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState<any>(null);
  const [openBrandingEditId, setOpenBrandingEditId] = useState<string | null>(null);
  const [loadingBrandingEdit, setLoadingBrandingEdit] = useState(false);
  const [editBrandingName, setEditBrandingName] = useState("");
  const [editBrandingDescription, setEditBrandingDescription] = useState("");
  const [editBrandingDeadline, setEditBrandingDeadline] = useState("");
  const [editBrandingLink, setEditBrandingLink] = useState("");
  const [editBrandingType, setEditBrandingType] = useState("");
  const [editBrandingStatus, setEditBrandingStatus] = useState("");
  const [editBrandingLevel, setEditBrandingLevel] = useState("");
  const [editBrandingResearch, setEditBrandingResearch] = useState("");
    // Branding handlers
    const handleOpenBrandingEdit = async (id: string) => {
      setLoadingBrandingEdit(true);
      setOpenBrandingEditId(id);
      try {
        const detail = await getBrandingById(id);
        setSelectedBranding(detail);
        setEditBrandingName(detail.name || "");
        setEditBrandingDescription(detail.description || "");
        setEditBrandingDeadline(detail.deadline ? detail.deadline.slice(0, 16) : "");
        setEditBrandingLink(detail.link || "");
        setEditBrandingType(detail.type || "");
        setEditBrandingStatus(detail.status || "");
        setEditBrandingLevel(detail.level || "");
        setEditBrandingResearch(detail.research || "");
      } catch (error) {
        setSelectedBranding(null);
      } finally {
        setLoadingBrandingEdit(false);
      }
    };

    const handleBrandingEditSubmit = async () => {
      if (!selectedBranding?._id) return;
      try {
        setLoadingBrandingEdit(true);
        const payload = {
          name: editBrandingName,
          description: editBrandingDescription,
          link: editBrandingLink,
          research: editBrandingResearch,
          level: editBrandingLevel,
          status: editBrandingStatus,
        };
        await updateBranding(selectedBranding._id, payload);
        setOpenBrandingEditId(null);
        getMyBranding().then((res) => setBrandingData(res || []));
      } catch (error) {
        // handle error
      } finally {
        setLoadingBrandingEdit(false);
      }
    };

    const handleOpenBrandingDetail = async (id: string) => {
      setLoadingBrandingDetail(true);
      setOpenBrandingDetailId(id);
      try {
        const detail = await getBrandingById(id);
        setSelectedBranding(detail);
      } catch (error) {
        setSelectedBranding(null);
      } finally {
        setLoadingBrandingDetail(false);
      }
    };
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editType, setEditType] = useState("");
  const [editStatus, setEditStatus] = useState("");
    const handleOpenEdit = async (id: string) => {
      setLoadingEdit(true);
      setOpenEditId(id);
      try {
        const detail = await getCompetitionById(id);
        setSelectedCompetition(detail);
        setEditName(detail.name || "");
        setEditDescription(detail.description || "");
        setEditDeadline(detail.deadline ? detail.deadline.slice(0, 16) : ""); // for datetime-local
        setEditLink(detail.link || "");
        setEditType(detail.type || "");
        setEditStatus(detail.status || "");
      } catch (error) {
        setSelectedCompetition(null);
      } finally {
        setLoadingEdit(false);
      }
    };

    const handleEditSubmit = async () => {
      if (!selectedCompetition?._id) return;
      try {
        setLoadingEdit(true);
        const payload = {
          name: editName,
          description: editDescription,
          deadline: editDeadline,
          link: editLink,
          type: editType,
          status: editStatus,
        };
        await updateCompetition(selectedCompetition._id, payload);
        setOpenEditId(null);
        getMeCompetition().then((res) => setCompetitionData(res || []));
      } catch (error) {
        // handle error, optionally show toast
      } finally {
        setLoadingEdit(false);
      }
    };
  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    setOpenDetailId(id);
    try {
      const detail = await getCompetitionById(id);
      setSelectedCompetition(detail);
    } catch (error) {
      setSelectedCompetition(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (activePage === "competition") {
      setLoadingCompetition(true);
      getMeCompetition()
        .then((res) => setCompetitionData(res || []))
        .finally(() => setLoadingCompetition(false));
    } else if (activePage === "branding") {
      setLoadingBranding(true);
      getMyBranding()
        .then((res) => setBrandingData(res || []))
        .finally(() => setLoadingBranding(false));
    }
  }, [activePage]);

  return (
    <div className="w-full rounded-lg overflow-hidden px-5">
      {showMenu && (
        <div className="flex justify-between gap-5">
          <div className=" w-full flex">
            <Menubar menus={Object.keys(scoring)} activeMenu={activePage} onChange={onPageChange} filter search={false} />
          </div>
          <div className="mt-1">
            <DialogField name="Add Information" title="Add Competition Information" size="lg">
              <div className="flex flex-col gap-5">
                <InputField type="string" placeholder="Ex: Learn how to make responsive web" label='Title' />
                <div className="flex gap-5">
                  <DropdownField key="week" title="Week" menu={["Week 1", "Week 2", "Week 3", "Week4"]} label='Week'/>
                  <DropdownField key="progress" title="Progress" menu={["Finished", "Unfinished"]} label='Progress'/>
                </div>
                <div className="">
                  <InputField type="string" placeholder="Ex: https://github.com/unikom-codelabs/" label='Problem' />
                </div>
                <Textarea label="Deskripsi Masalah" placeholder="Ex: Ada kendala pada fitur upload gambar..." />
              </div>
            </DialogField>
          </div>
        </div>
      )}

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {scoringHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activePage === "research" ? (
            <>
              <TableRow>
                <TableCell>Conduct research Responses</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center font-semibold text-primary">0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Leading the workshop</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center font-semibold text-primary">0%</TableCell>
              </TableRow>
            </>
          ) : activePage === "operational" ? (
            <>
              <TableRow>
                <TableCell>Daily Attendance</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center font-semibold text-primary">0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Thematic Attendance</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center font-semibold text-primary">0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Picket Attendance</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center font-semibold text-primary">0%</TableCell>
              </TableRow>
            </>
          ) : activePage === "competition" ? (
            loadingCompetition ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">Loading...</TableCell>
              </TableRow>
            ) : Array.isArray(competitionData) && competitionData.length > 0 ? (
              competitionData.map((item: any, idx: number) => (
                <TableRow key={item._id || idx}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">{item.status}</TableCell>
                  <TableCell className="text-center">0</TableCell>
                  <TableCell className="text-center gap-2 flex justify-center">
                    <DialogField
                      name="Edit"
                      title="Edit Competition"
                      variant="outline"
                      noPadding
                      open={openEditId === item._id}
                      onOpenChange={(isOpen) => setOpenEditId(isOpen ? item._id : null)}
                      onTriggerClick={() => handleOpenEdit(item._id)}
                      onSubmit={handleEditSubmit}
                      submitDisabled={loadingEdit || !editName || !editDescription || !editDeadline || !editLink || !editType || !editStatus}
                    >
                      {loadingEdit ? (
                        <p className="text-center text-sm text-gray-500">Loading...</p>
                      ) : (
                        <div className="flex flex-col gap-5">
                          <InputField
                            type="string"
                            placeholder="Ex: Competition Name"
                            label="Title"
                            value={editName}
                            onChange={(e: any) => setEditName(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: Competition Description"
                            label="Description"
                            value={editDescription}
                            onChange={(e: any) => setEditDescription(e.target.value)}
                          />
                          <InputField
                            placeholder="Ex: Competition Description"
                            type="datetime-local"
                            label="Deadline"
                            value={editDeadline}
                            onChange={(e: any) => setEditDeadline(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: https://competition.com"
                            label="Link"
                            value={editLink}
                            onChange={(e: any) => setEditLink(e.target.value)}
                          />
                          <DropdownField
                            key="type-input"
                            title="Type"
                            menu={["international", "national"]}
                            label="Type"
                            value={editType}
                            onChange={(value) => setEditType(value)}
                          />
                        </div>
                      )}
                    </DialogField>
                    <DialogField
                      name="Detail"
                      title="Detail Competition"
                      variant="outline"
                      noPadding
                      open={openDetailId === item._id}
                      onOpenChange={(isOpen) => setOpenDetailId(isOpen ? item._id : null)}
                      onTriggerClick={() => handleOpenDetail(item._id)}
                    >
                      {loadingDetail ? (
                        <p className="text-center text-sm text-gray-500">Loading...</p>
                      ) : selectedCompetition ? (
                        <div className="flex flex-col gap-5 text-lg">
                          <div>
                            <p className="font-semibold">Title</p>
                            <p>{selectedCompetition.name}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Description</p>
                            <p>{selectedCompetition.description}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Deadline</p>
                            <p>{selectedCompetition.deadline ? new Date(selectedCompetition.deadline).toLocaleString() : '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Link</p>
                            <a
                              href={selectedCompetition.link?.startsWith('http') ? selectedCompetition.link : `https://${selectedCompetition.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {selectedCompetition.link}
                            </a>
                          </div>
                          <div>
                            <p className="font-semibold">Status</p>
                            <p>{selectedCompetition.status}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Type</p>
                            <p>{selectedCompetition.type}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center">No data found</p>
                      )}
                    </DialogField>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>competition</TableCell>
                <TableCell className="text-center">oke</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">oke</TableCell>
              </TableRow>
            )
          ) : activePage === "branding" ? (
            loadingBranding ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">Loading...</TableCell>
              </TableRow>
            ) : Array.isArray(brandingData) && brandingData.length > 0 ? (
              brandingData.map((item: any, idx: number) => (
                <TableRow key={item._id || idx}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">{item.research}</TableCell>
                  <TableCell className="text-center">{item.status}</TableCell>
                  <TableCell className="text-center">0</TableCell>
                  <TableCell className="text-center gap-2 flex justify-center">
                    <DialogField
                      name="Edit"
                      title="Edit Branding"
                      variant="outline"
                      noPadding
                      open={openBrandingEditId === item._id}
                      onOpenChange={(isOpen) => setOpenBrandingEditId(isOpen ? item._id : null)}
                      onTriggerClick={() => handleOpenBrandingEdit(item._id)}
                      onSubmit={handleBrandingEditSubmit}
                      submitDisabled={loadingBrandingEdit || !editBrandingName || !editBrandingDescription || !editBrandingLink }
                    >
                      {loadingBrandingEdit ? (
                        <p className="text-center text-sm text-gray-500">Loading...</p>
                      ) : (
                        <div className="flex flex-col gap-5">
                          <InputField
                            type="string"
                            placeholder="Ex: Branding Name"
                            label="Title"
                            value={editBrandingName}
                            onChange={(e: any) => setEditBrandingName(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: Branding Description"
                            label="Description"
                            value={editBrandingDescription}
                            onChange={(e: any) => setEditBrandingDescription(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: https://branding.com"
                            label="Link"
                            value={editBrandingLink}
                            onChange={(e: any) => setEditBrandingLink(e.target.value)}
                          />
                          <DropdownField
                            key="research-branding-input"
                            title="research"
                            menu={["website", "mobile", "game", "ui/ux", "data", "other"]}
                            label="research"
                            value={editBrandingResearch}
                            onChange={(value) => setEditBrandingResearch(value)}
                          />
                          <DropdownField
                            key="level-branding-input"
                            title="Level"
                            menu={["beginner", "intermediate", "advanced"]}
                            label="Level"
                            value={editBrandingLevel}
                            onChange={(value) => setEditBrandingLevel(value)}
                          />
                        </div>
                      )}
                    </DialogField>
                    <DialogField
                      name="Detail"
                      title="Detail Branding"
                      variant="outline"
                      noPadding
                      open={openBrandingDetailId === item._id}
                      onOpenChange={(isOpen) => setOpenBrandingDetailId(isOpen ? item._id : null)}
                      onTriggerClick={() => handleOpenBrandingDetail(item._id)}
                    >
                      {loadingBrandingDetail ? (
                        <p className="text-center text-sm text-gray-500">Loading...</p>
                      ) : selectedBranding ? (
                        <div className="flex flex-col gap-5 text-lg">
                          <div>
                            <p className="font-semibold">Title</p>
                            <p>{selectedBranding.name }</p>
                          </div>
                          <div>
                            <p className="font-semibold">Description</p>
                            <p>{selectedBranding.description}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Type</p>
                            <p>{selectedBranding.research}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Link</p>
                            <a
                              href={selectedBranding.link?.startsWith('http') ? selectedBranding.link : `https://${selectedBranding.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {selectedBranding.link}
                            </a>
                          </div>
                          <div>
                            <p className="font-semibold">Status</p>
                            <p>{selectedBranding.status}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Level</p>
                            <p>{selectedBranding.level}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center">No data found</p>
                      )}
                    </DialogField>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={scoringHeaders.length} className="text-center py-8 text-gray-400">
                Tidak ada data untuk halaman ini.
              </TableCell>
              </TableRow>
            )
          ) : data && data.length > 0 ? (
            data.map((row, i) => (
              <TableRow key={i}>
                {scoringHeaders.map((header, j) => (
                  <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={scoringHeaders.length} className="text-center py-8 text-gray-400">
                Tidak ada data untuk halaman ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoringTable;
