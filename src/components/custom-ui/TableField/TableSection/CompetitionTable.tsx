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
import { getAllCompetition } from "@/services/competition/competitionService";

interface CompetitionTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
}

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

const CompetitionTable = ({
  activePage,
  onPageChange,
  showMenu = true,
}: CompetitionTableProps) => {
  const [competitionData, setCompetitionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const competitionKey = Object.keys(competition)[0];
  const competitionHeaders = competition[competitionKey] ?? [];

  // Fetch data
  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const data = await getAllCompetition();
        setCompetitionData(data);
      } catch (err) {
        console.error("Error fetching competition:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, []);

  // Pagination slice
  const totalPages = Math.ceil(competitionData.length / itemsPerPage);
  const paginatedData = competitionData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                <TableCell colSpan={competitionHeaders.length} className="text-center py-6">
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

                  {/* status with color */}
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* detail */}
                  <TableCell className="text-center">
                    <DialogField name="Review" title="Detail Lomba">
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Description:</strong> {item.description}</p>
                      <p><strong>Type:</strong> {item.type}</p>
                      <p><strong>Link:</strong> {item.link}</p>
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
