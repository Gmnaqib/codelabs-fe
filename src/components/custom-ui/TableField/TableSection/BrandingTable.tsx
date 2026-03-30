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
import { branding } from "../headerConfig";
import DialogField from "../../DialogField";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getAllBranding,
  getBrandingById,
  updateBrandingStatus,
} from "@/services/branding/brandingService";
import { DropdownField } from "../../DropdownField";
import { getStatusColor } from "@/utils/statusColor";
import { toast } from "sonner";

interface Branding {
  _id: string;
  name: string;
  status: string;
  level: string;
  research: string;
  link: string;
  description: string;
  createdAt?: string;
  week?: number | string;
}

interface BrandingTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  filterWeek?: string;
  filterContentType?: string;
  searchQuery?: string;
  month?: number;
  year?: number;
}

const BrandingTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  filterWeek = "All",
  filterContentType = "All",
  searchQuery = "",
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
}: BrandingTableProps) => {
  const [brandingData, setBrandingData] = useState<Branding[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<Branding | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const brandingKey = Object.keys(branding)[0];
  const brandingHeaders = branding[brandingKey] ?? [];

  const fetchBranding = async () => {
    setLoading(true);
    try {
      const date = `${year}-${String(month).padStart(2, "0")}`;
      const params = {
        date,
      };
      const data = await getAllBranding(params);
      setBrandingData(data);
    } catch (err) {
      console.error("Error fetching branding:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);


  // Filtering logic
  const filteredData = brandingData.filter((item) => {
    // Filter by month and year if item.createdAt exists
    let matchMonth = true;
    let matchYear = true;
    if (item.createdAt) {
      const date = new Date(item.createdAt);
      matchMonth = date.getMonth() + 1 === month;
      matchYear = date.getFullYear() === year;
    }
    // Filter by week if available
    let matchWeek = true;
    if (filterWeek !== "All") {
      if (item.week !== undefined && item.week !== null) {
        matchWeek = `Week ${item.week}` === filterWeek;
      } else {
        matchWeek = false;
      }
    }
    // Filter by content type (level or research)
    let matchContentType = true;
    if (filterContentType !== "All") {
      matchContentType = (item.level === filterContentType || item.research === filterContentType);
    }
    // Filter by searchQuery prop (name)
    let matchSearch = true;
    if (searchQuery) {
      matchSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return matchMonth && matchYear && matchWeek && matchContentType && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleOpenDialog(id: string) {
    const detail = await getBrandingById(id);
    setSelectedId(detail); // detail adalah OBJECT -> sudah benar
  }
  async function handleReview(newStatus: string) {
    if (!selectedId?._id) {
      console.error("ID tidak ditemukan. selectedId:", selectedId);
      return;
    }

    try {
      await updateBrandingStatus(selectedId._id, newStatus);
      await fetchBranding();
      toast.success(`Branding ${newStatus.toLowerCase()} successfully!`);
    } catch {
      toast.error(`Failed to update branding ${newStatus.toLowerCase()}.`);
    }
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(branding)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {brandingHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={brandingHeaders.length}
                  className="text-center py-6"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">{item.name}</TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <DialogField
                      name="Review"
                      title="Detail Branding"
                      onTriggerClick={() => handleOpenDialog(item._id)}
                      variant="outline"
                      noPadding
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <p className="font-semibold">Title</p>
                          <p>{item.name}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Level Type</p>
                          <p>{item.level}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Description</p>
                          <p>{item.description}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Content Link</p>
                          <p>{item.link}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Research Category</p>
                          <p>{item.research}</p>
                        </div>

                        <div className="">
                          <p className="font-semibold mt-2">Status</p>
                        <div className="mt-1">
                          <DropdownField
                            title={item.status}
                            menu={["Approved", "Rejected"]}
                            onSelect={(value) => handleReview(value)}
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
                  colSpan={brandingHeaders.length}
                  className="text-center py-6"
                >
                  Tidak ada data branding
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4 mb-4">
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

export default BrandingTable;
