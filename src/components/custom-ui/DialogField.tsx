"use client";
import React, { useState, ReactElement, isValidElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogFieldProps } from "@/types/DialogFieldProps";

interface ExtendedDialogFieldProps extends DialogFieldProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogField = (props: ExtendedDialogFieldProps) => {
  const { name, title, children, open: controlledOpen, onOpenChange } = props;

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled) onOpenChange?.(nextOpen);
    else setInternalOpen(nextOpen);
  };

  // buat fungsi agar bisa dipanggil dari child
  const closeDialog = () => handleOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="w-full text-center">
        <DialogTrigger asChild>
          <button className="bg-[#2080d9] rounded-full text-white font-medium text-lg py-3 w-fit px-5 hover:bg-[#1a6cb8] transition-all">
            {name}
          </button>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>
            {/* pastikan children bisa menerima prop closeDialog */}
            {isValidElement(children)
              ? React.cloneElement(children as ReactElement<any>, { closeDialog })
              : children}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogField;
