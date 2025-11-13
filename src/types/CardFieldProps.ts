import { ReactElement, ReactNode } from "react";

export interface CardFieldProps {
  title: string,
  children: ReactNode,
  icon?: ReactElement,
  noGap?: boolean,
}
