import { ReactNode } from "react";

export interface DialogFieldProps {
  name: string,
  title: string,
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost",
  size?: "default" | "sm" | "lg" | "noPadding" | "icon",
  children: ReactNode,
  open?: boolean;
  noPadding?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: () => void; 
  onCancel?: () => void;
  onTriggerClick?: () => void;
}