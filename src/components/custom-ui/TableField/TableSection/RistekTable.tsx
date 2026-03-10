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
import {
  getAllResearchRecords,
  updateResearchStatus,
} from "@/services/research/researchService";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DropdownField } from "../../DropdownField";

interface RistekTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  searchQuery?: string;
  filterContentType?: string;
  filterWeek?: string;
  month?: number;
  year?: number;
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
  searchQuery = "",
  filterContentType = "All SubResearch",
  filterWeek = "All Week",
  month,
  year,
}: RistekTableProps) => {
  type RistekResearchItem = {
    _id: string;
    userId?: { name?: string };
    status?: string;
    title?: string;
    week?: string | number;
    progress?: string;
    challenge?: string;
    link?: string;
  };
  const [researchData, setResearchData] = useState<RistekResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const ristekKey = Object.keys(ristek)[0];
  const ristekHeaders = ristek[ristekKey] ?? [];

  const fetchResearchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const y = typeof year === 'number' ? year : now.getFullYear();
      const m = typeof month === 'number' ? month : now.getMonth() + 1;
      const data = await getAllResearchRecords(y, m);
      setResearchData(data);
    } catch (err) {
      console.error("Error fetching research:", err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchResearchData();
  }, [month, year, fetchResearchData]);

  const filteredData = researchData
    .filter((item) =>
      !searchQuery || (item.userId?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) =>
      filterContentType === "All SubResearch" ? true : (item.progress ?? "").toLowerCase() === filterContentType.toLowerCase()
    )
    .filter((item) =>
      filterWeek === "All Week" ? true : `Week ${item.week}` === filterWeek
    );

  const handleReview = async (id: string, value: string) => {
    try {
      await updateResearchStatus(id, value);
      fetchResearchData();
    } catch (err) {
      console.error("Gagal update research:", err);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(ristek)}
          activeMenu={activePage}
          onChange={onPageChange}
          filter
          filterProps={{
            // No-op, filter state handled in page and passed as props
            onChange: () => {},
            defaultYear: year ?? new Date().getFullYear(),
            defaultMonth: typeof month === 'number' ? month : new Date().getMonth(),
          }}
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
                <TableCell
                  colSpan={ristekHeaders.length}
                  className="text-center py-6"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">
                    {item?.userId?.name ?? "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClass(
                        item.status ?? ""
                      )}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <DialogField name="Review" title="Detail Plan" variant="outline" noPadding>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <p className="font-semibold mt-2">Title</p>
                          <p>{item.title}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Week</p>
                          <p>{item.week}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Progress</p>
                          <p>{item.progress}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Challenge</p>
                          <p>{item.challenge}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Output Link</p>
                          <p>{item.link}</p>
                        </div>

                        <div className="w-fit">
                          <p className="font-semibold mt-4">Status</p>
                          <div className="mt-2">
                            <DropdownField
                              title={item.status}
                              menu={["Approved", "Rejected"]}
                              onSelect={(value) =>
                                handleReview(item._id, value)
                              }
                            />
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

export default RistekTable;
