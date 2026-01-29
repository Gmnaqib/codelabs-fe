"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoringTableProps } from "@/types/ScoringTableProps";
import { Textarea } from "@/components/ui/textarea";
import { Menubar } from "@/components/custom-ui/MenuBar";
import { scoring } from "../../headerConfig";
import DialogField from "@/components/custom-ui/DialogField";
import InputField from "@/components/custom-ui/InputField";
import { DropdownField } from "@/components/custom-ui/DropdownField";

const ScoringTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: ScoringTableProps) => {
  const scoringHeaders = scoring[activePage] ?? [];

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
          {data.map((row, i) => (
            <TableRow key={i}>
              {scoringHeaders.map((header, j) => (
                <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoringTable;
