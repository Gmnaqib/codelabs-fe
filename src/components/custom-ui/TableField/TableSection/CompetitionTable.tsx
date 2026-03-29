"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Menubar } from "../../MenuBar";
import { competition } from "../headerConfig";
import DialogField from "../../DialogField";
import { Card } from "@/components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import {
  getAllCompetition,
  getCompetitionById,
  updateCompetitionStatus,
} from "@/services/competition/competitionService";

import { DropdownField } from "../../DropdownField";
import { toast } from "sonner";

const getStatusClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface Competition {
  _id: string;
  name: string;
  title: string;
  type: string;
  status: string;
  link: string;
  description: string;
}

interface CompetitionTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  month?: number;
  year?: number;
  searchQuery?: string;
}

const CompetitionTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  searchQuery = "",
}: CompetitionTableProps) => {
  const [competitionData, setCompetitionData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<Competition | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const competitionKey = Object.keys(competition)[0];
  const competitionHeaders = competition[competitionKey] ?? [];


  const fetchCompetition = async () => {
    setLoading(true);
    try {
      const date = `${year}-${String(month).padStart(2, "0")}`;
      const params = { date };
      const data = await getAllCompetition(params);
      setCompetitionData(data);
    } catch (err) {
      console.error("Error fetching competition:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);


  // Client-side search filter
  const filteredData = searchQuery
    ? competitionData.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : competitionData;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleOpenDialog(id: string) {
    const detail = await getCompetitionById(id);
    setSelectedId(detail);
  }
  async function handleReview(newStatus: string) {
    if (!selectedId?._id) {
      console.error("ID tidak ditemukan. selectedId:", selectedId);
      return;
    }
    try {
      await updateCompetitionStatus(selectedId._id, newStatus);
      await fetchCompetition(); 
      toast.success(`Competition ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      toast.error(`Failed to update competition ${newStatus.toLowerCase()}.`);
    }
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(competition)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {competitionHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={competitionHeaders.length}
                  className="text-center py-6"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, i) => (
                <TableRow key={i}>
                  {/* name */}
                  <TableCell className="text-center">
                    {item.name ?? "-"}
                  </TableCell>

                  {/* status */}
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* Detail Dialog */}
                  <TableCell className="text-center">
                    <DialogField
                      name="Review"
                      title="Detail Competition"
                      onTriggerClick={() => handleOpenDialog(item._id)}
                      variant="outline"
                      noPadding
                    >
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="">
                            <p className="font-semibold mt-2">Title</p>
                            <p>{item.name}</p>
                          </div>

                          <div className="">
                            <p className="font-semibold mt-2">Competition Type</p>
                            <p>{item.type}</p>
                          </div>

                          <div className="">
                            <p className="font-semibold mt-2">Description</p>
                            <p>{item.description}</p>
                          </div>

                          <div className="">
                            <p className="font-semibold mt-2">Competition Link</p>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.link}
                            </a>
                          </div>

                          
                          <div className="">
                          <p className="font-semibold mt-2">Change Label</p>
                          <div className="mt-2 w-fit">
                            <DropdownField
                              title={item.status}
                              menu={["Approved", "Rejected"]}
                              onSelect={(value) => handleReview(value)}
                            />
                          </div>
                        </div>
                        </div>
                      </div>
                    </DialogField>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={competitionHeaders.length}
                  className="text-center py-6"
                >
                  Tidak ada data lomba
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </div>
  );
};

export default CompetitionTable;
