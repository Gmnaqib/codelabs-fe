import { ReactNode } from "react";

export interface DialogFieldProps {
  name: ReactNode,
  title: string,
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost",
  size?: "default" | "sm" | "lg" | "noPadding" | "icon"| "full",
  children: ReactNode,
  open?: boolean;
  noPadding?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (closeDialog?: () => void) => void;
  onCancel?: () => void;
  onTriggerClick?: () => void;
  submitDisabled?: boolean;
  disabled?: boolean;
}