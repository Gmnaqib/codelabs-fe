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

const DialogField = (props: DialogFieldProps) => {
  const {
    name,
    title,
    children,
    variant = "default",
    size = "default",
    open: controlledOpen,
    onOpenChange,
    onSubmit,
    onCancel,
    onTriggerClick,
    noPadding = false, 
    submitDisabled = false,
    disabled = false,
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
          className={noPadding ? "py-0" : ""} 
          size={size}
          disabled={disabled}
        >
          {name}
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-xs sm:max-w-xs md:max-w-lg lg:max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-3 text-left">
              {title}
            </DialogTitle>
          </DialogHeader>

          {isValidElement(children) && typeof (children.type) !== "string"
            ? React.cloneElement(children as ReactElement<{ closeDialog?: () => void }>, { closeDialog })
            : children}

          <div className="flex justify-center gap-4 mt-5">
            <Button variant="outline" onClick={handleCancel} className="text-lg">
              Batal
            </Button>
            {onSubmit && (
              <Button
                onClick={() => onSubmit(closeDialog)}
                disabled={submitDisabled}
              >
                Submit
              </Button>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogField;
