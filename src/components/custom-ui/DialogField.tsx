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
import { Button } from "../ui/button";

interface ExtendedDialogFieldProps extends DialogFieldProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: () => void; 
  onCancel?: () => void;
}

const DialogField = (props: ExtendedDialogFieldProps) => {
  const { name, title, children, open: controlledOpen, onOpenChange, onSubmit, onCancel } = props;

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled) onOpenChange?.(nextOpen);
    else setInternalOpen(nextOpen);
  };

  const closeDialog = () => handleOpenChange(false);

  const handleCancel = () => {
    if (onCancel) onCancel();
    closeDialog();
  };

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

          {isValidElement(children) && typeof (children as any).type !== "string"
          ? React.cloneElement(children as ReactElement<any>, { closeDialog })
          : children}


          <div className="flex justify-center gap-4 mt-3">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogField;
