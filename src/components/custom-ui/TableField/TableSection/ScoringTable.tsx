"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { scoring } from "../headerConfig";
import { ScoringTableProps } from "@/types/ScoringTableProps";
import { getMeCompetition, getCompetitionById, updateCompetition, addCompetition } from "@/services/competition/competitionService";
import { getMyBranding, getBrandingById, updateBranding, addBranding } from "@/services/branding/brandingService";
import DialogField from "../../DialogField";
import InputField from "../../InputField";
import { DropdownField } from "../../DropdownField";

import { getStatusColor } from "@/utils/statusColor";


const ScoringTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: ScoringTableProps) => {
  const [addCompetitionName, setAddCompetitionName] = useState("");
  const [addCompetitionDescription, setAddCompetitionDescription] = useState("");
  const [addCompetitionDeadline, setAddCompetitionDeadline] = useState("");
  const [addCompetitionLink, setAddCompetitionLink] = useState("");
  const [addCompetitionType, setAddCompetitionType] = useState("");
  const [addBrandingName, setAddBrandingName] = useState("");
  const [addBrandingDescription, setAddBrandingDescription] = useState("");
  const [addBrandingLink, setAddBrandingLink] = useState("");
  const [addBrandingResearch, setAddBrandingResearch] = useState("");
  const [addBrandingLevel, setAddBrandingLevel] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const resetAddCompetition = () => {
    setAddCompetitionName("");
    setAddCompetitionDescription("");
    setAddCompetitionDeadline("");
    setAddCompetitionLink("");
    setAddCompetitionType("");
  };
  const resetAddBranding = () => {
    setAddBrandingName("");
    setAddBrandingDescription("");
    setAddBrandingLink("");
    setAddBrandingResearch("");
    setAddBrandingLevel("");
  };

  const handleAddCompetition = async () => {
    setLoadingAdd(true);
    try {
      const payload = {
        name: addCompetitionName,
        description: addCompetitionDescription,
        deadline: addCompetitionDeadline,
        link: addCompetitionLink,
        type: addCompetitionType,
      };
      await addCompetition(payload);
      setOpenAddDialog(false);
      resetAddCompetition();
      getMeCompetition().then((res) => setCompetitionData(res || []));
    } finally {
      setLoadingAdd(false);
    }
  };
  const handleAddBranding = async () => {
    setLoadingAdd(true);
    try {
      const payload = {
        name: addBrandingName,
        description: addBrandingDescription,
        link: addBrandingLink,
        research: addBrandingResearch,
        level: addBrandingLevel,
      };
      await addBranding(payload);
      setOpenAddDialog(false);
      resetAddBranding();
      getMyBranding().then((res) => setBrandingData(res || []));
    } finally {
      setLoadingAdd(false);
    }
  };
  const scoringHeaders = scoring[activePage] ?? [];

  type CompetitionItem = {
    _id: string;
    name?: string;
    description?: string;
    deadline?: string;
    link?: string;
    type?: string;
    status?: string;
  };
  type BrandingItem = {
    _id: string;
    name?: string;
    description?: string;
    link?: string;
    research?: string;
    level?: string;
    status?: string;
  };

  const [competitionData, setCompetitionData] = useState<CompetitionItem[]>([]);
  const [loadingCompetition, setLoadingCompetition] = useState(false);
  const [brandingData, setBrandingData] = useState<BrandingItem[]>([]);
  const [loadingBranding, setLoadingBranding] = useState(false);
  const [openBrandingDetailId, setOpenBrandingDetailId] = useState<string | null>(null);
  const [loadingBrandingDetail, setLoadingBrandingDetail] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState<BrandingItem | null>(null);
  const [openBrandingEditId, setOpenBrandingEditId] = useState<string | null>(null);
  const [loadingBrandingEdit, setLoadingBrandingEdit] = useState(false);
  const [editBrandingName, setEditBrandingName] = useState("");
  const [editBrandingDescription, setEditBrandingDescription] = useState("");
  const [editBrandingLink, setEditBrandingLink] = useState("");
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
        setEditBrandingLink(detail.link || "");
        setEditBrandingStatus(detail.status || "");
        setEditBrandingLevel(detail.level || "");
        setEditBrandingResearch(detail.research || "");
      } catch {
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
      } catch {
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
      } catch {
        setSelectedBranding(null);
      } finally {
        setLoadingBrandingDetail(false);
      }
    };
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionItem | null>(null);
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
      } catch {
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
      } catch {

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
    } catch {
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
          {(activePage === "competition" || activePage === "branding") && (
            <div className="mt-1">
            <DialogField
              name="Add Information"
              title={activePage === "competition" ? "Add Competition Information" : "Add Branding Information"}
              size="lg"
              open={openAddDialog}
              onOpenChange={setOpenAddDialog}
              onSubmit={activePage === "competition" ? handleAddCompetition : handleAddBranding}
              submitDisabled={loadingAdd || (activePage === "competition"
                ? !addCompetitionName || !addCompetitionDescription || !addCompetitionDeadline || !addCompetitionLink || !addCompetitionType
                : !addBrandingName || !addBrandingDescription || !addBrandingLink || !addBrandingResearch || !addBrandingLevel)}
            >
              {loadingAdd ? (
                <p className="text-center text-sm text-gray-500">Loading...</p>
              ) : activePage === "competition" ? (
                <div className="flex flex-col gap-5">
                  <InputField
                    type="string"
                    placeholder="Ex: Competition Name"
                    label="Title"
                    value={addCompetitionName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddCompetitionName(e.target.value)}
                  />
                  <InputField
                    type="string"
                    placeholder="Ex: Competition Description"
                    label="Description"
                    value={addCompetitionDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddCompetitionDescription(e.target.value)}
                  />
                  <InputField
                    placeholder="Ex: Competition Deadline"
                    type="datetime-local"
                    label="Deadline"
                    value={addCompetitionDeadline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddCompetitionDeadline(e.target.value)}
                  />
                  <InputField
                    type="string"
                    placeholder="Ex: https://competition.com"
                    label="Link"
                    value={addCompetitionLink}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddCompetitionLink(e.target.value)}
                  />
                  <DropdownField
                    key="type-input"
                    title="Type"
                    menu={["international", "national"]}
                    label="Type"
                    value={addCompetitionType}
                    onChange={(value) => setAddCompetitionType(value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <InputField
                    type="string"
                    placeholder="Ex: Branding Name"
                    label="Title"
                    value={addBrandingName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBrandingName(e.target.value)}
                  />
                  <InputField
                    type="string"
                    placeholder="Ex: Branding Description"
                    label="Description"
                    value={addBrandingDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBrandingDescription(e.target.value)}
                  />
                  <InputField
                    type="string"
                    placeholder="Ex: https://branding.com"
                    label="Link"
                    value={addBrandingLink}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBrandingLink(e.target.value)}
                  />
                  <DropdownField
                    key="research-branding-input"
                    title="research"
                    menu={["website", "mobile", "game", "ui/ux", "data", "other"]}
                    label="research"
                    value={addBrandingResearch}
                    onChange={(value) => setAddBrandingResearch(value)}
                  />
                  <DropdownField
                    key="level-branding-input"
                    title="Level"
                    menu={["beginner", "intermediate", "advanced"]}
                    label="Level"
                    value={addBrandingLevel}
                    onChange={(value) => setAddBrandingLevel(value)}
                  />
                </div>
              )}
            </DialogField>
          </div>
          )}
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
              competitionData.map((item, idx: number) => (
                <TableRow key={item._id || idx}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(item.status ?? "")}`}>
                      {(item.status ?? "").toUpperCase()}
                    </span>
                  </TableCell>
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: Competition Description"
                            label="Description"
                            value={editDescription}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDescription(e.target.value)}
                          />
                          <InputField
                            placeholder="Ex: Competition Description"
                            type="datetime-local"
                            label="Deadline"
                            value={editDeadline}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDeadline(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: https://competition.com"
                            label="Link"
                            value={editLink}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLink(e.target.value)}
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
              brandingData.map((item, idx: number) => (
                <TableRow key={item._id || idx}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">{item.research}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(item.status ?? "")}`}>
                      {(item.status ?? "").toUpperCase()}
                    </span>
                  </TableCell>
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditBrandingName(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: Branding Description"
                            label="Description"
                            value={editBrandingDescription}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditBrandingDescription(e.target.value)}
                          />
                          <InputField
                            type="string"
                            placeholder="Ex: https://branding.com"
                            label="Link"
                            value={editBrandingLink}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditBrandingLink(e.target.value)}
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
                {scoringHeaders.map((header, j) => {
                  const value = (row as Record<string, unknown>)[header];
                  return (
                    <TableCell key={j}>{
                      typeof value === "string" || typeof value === "number"
                        ? value
                        : value !== undefined && value !== null
                        ? String(value)
                        : "-"
                    }</TableCell>
                  );
                })}
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
