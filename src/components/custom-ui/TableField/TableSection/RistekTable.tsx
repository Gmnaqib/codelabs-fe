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
import { ristek } from "../headerConfig";
import DialogField from "../../DialogField";
import { Card } from "@/components/ui/card";
import { getAllResearchRecords } from "@/services/research/researchService";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RistekTableProps {
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

const RistekTable = ({
  activePage,
  onPageChange,
  showMenu = true,
}: RistekTableProps) => {

  const [researchData, setResearchData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // bisa diubah

  const ristekKey = Object.keys(ristek)[0];
  const ristekHeaders = ristek[ristekKey] ?? [];

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const data = await getAllResearchRecords();
        setResearchData(data);
      } catch (err) {
        console.error("Error fetching research:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, []);

  // HITUNG PAGINATION
  const totalPages = Math.ceil(researchData.length / itemsPerPage);

  const paginatedData = researchData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(ristek)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {ristekHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={ristekHeaders.length} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, i) => (
                <TableRow key={i}>
                  {/* 1. userId.name */}
                  <TableCell className="text-center">
                    {item?.userId?.name ?? "-"}
                  </TableCell>

                  {/* 2. status */}
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* 3. Dialog */}
                  <TableCell className="text-center">
                    <DialogField name="Review" title="Detail Plan">
                      <p><strong>Title:</strong> {item.title}</p>
                      <p><strong>Category:</strong> {item.category}</p>
                      <p><strong>Type:</strong> {item.research_type}</p>
                    </DialogField>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={ristekHeaders.length}
                  className="text-center py-6"
                >
                  Tidak ada data research
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>

              {/* Prev */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>

              {/* Page number */}
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

              {/* Ellipsis */}
              {totalPages > 5 && <PaginationEllipsis />}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </div>
  );
};

export default RistekTable;
