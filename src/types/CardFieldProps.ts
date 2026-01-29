import { ReactElement, ReactNode, SVGProps } from "react";

export interface CardFieldProps {
  title: string,
  children: ReactNode,
  icon?: ReactElement<SVGProps<SVGSVGElement>>,
  noGap?: boolean,
  filterYear?: boolean,
  bg?: boolean,
}
