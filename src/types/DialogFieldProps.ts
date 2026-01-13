import { ReactNode } from "react";

export interface DialogFieldProps {
  name: string,
  title: string,
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost",
  size?: "default" | "sm" | "lg",
  children: ReactNode,
  open?: boolean;
  noPadding?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: () => void; 
  onCancel?: () => void;
  onTriggerClick?: () => void;
}