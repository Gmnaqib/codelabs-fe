"use client";

import React, { useState, ReactElement, isValidElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { DialogFieldProps } from "@/types/DialogFieldProps";
import { Button } from "../ui/button";

interface ExtendedDialogFieldProps extends DialogFieldProps {
  noPadding?: boolean; 
}

const DialogField = (props: ExtendedDialogFieldProps) => {
  const {
    name,
    title,
    children,
    variant = "default",
    open: controlledOpen,
    onOpenChange,
    onSubmit,
    onCancel,
    onTriggerClick,
    noPadding = false, 
  } = props;

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
      <DialogTrigger asChild>
        <Button
          variant={variant}
          onClick={onTriggerClick}
          className={noPadding ? "py-0" : ""} // ✅
        >
          {name}
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-3">
              {title}
            </DialogTitle>
          </DialogHeader>

          {isValidElement(children) && typeof (children as any).type !== "string"
            ? React.cloneElement(children as ReactElement<any>, { closeDialog })
            : children}

          <div className="flex justify-center gap-4 mt-5">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {onSubmit && <Button onClick={onSubmit}>Submit</Button>}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogField;
