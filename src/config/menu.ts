import {
  ArrowLeftStartOnRectangleIcon as ArrowLeftSolid,
  BuildingOfficeIcon as BuildingSolid,
  ChartBarIcon as ChartSolid,
  CheckCircleIcon as CheckSolid,
  ClipboardDocumentCheckIcon as ClipboardCheckSolid,
  ClipboardDocumentListIcon as ClipboardListSolid,
  ComputerDesktopIcon as ComputerSolid,
  IdentificationIcon as IdentificationSolid,
  PaintBrushIcon as PaintSolid,
  Squares2X2Icon as SquaresSolid,
  TrophyIcon as TrophySolid,
} from "@heroicons/react/24/solid";

import {
  ArrowLeftStartOnRectangleIcon as ArrowLeftOutline,
  BuildingOfficeIcon as BuildingOutline,
  ChartBarIcon as ChartOutline,
  CheckCircleIcon as CheckOutline,
  ClipboardDocumentCheckIcon as ClipboardCheckOutline,
  ClipboardDocumentListIcon as ClipboardListOutline,
  ComputerDesktopIcon as ComputerOutline,
  IdentificationIcon as IdentificationOutline,
  PaintBrushIcon as PaintOutline,
  Squares2X2Icon as SquaresOutline,
  TrophyIcon as TrophyOutline,
} from "@heroicons/react/24/outline";

export const menuItems = [
  {
    title: "Dashboard",
    iconSolid: SquaresSolid,
    iconOutline: SquaresOutline,
    route: "/",
  },
  {
    title: "Weekly Report",
    iconSolid: ClipboardListSolid,
    iconOutline: ClipboardListOutline,
    route: "/report",
  },
  {
    title: "KPI Scoring",
    iconSolid: ChartSolid,
    iconOutline: ChartOutline,
    route: "/scoring",
  },
  {
    title: "Operasional",
    iconSolid: BuildingSolid,
    iconOutline: BuildingOutline,
    route: "/operasional",
  },
  {
    title: "Attendance",
    iconSolid: ClipboardCheckSolid,
    iconOutline: ClipboardCheckOutline,
    route: "/attendance",
  },
  {
    title: "Assessments",
    iconSolid: CheckSolid,
    iconOutline: CheckOutline,
    route: "/assessments",
  },
  {
    title: "Members",
    iconSolid: IdentificationSolid,
    iconOutline: IdentificationOutline,
    route: "/members",
  },
  {
    title: "Resarch & Tech",
    iconSolid: ComputerSolid,
    iconOutline: ComputerOutline,
    route: "/ristek",
  },
  {
    title: "Competition",
    iconSolid: TrophySolid,
    iconOutline: TrophyOutline,
    route: "/competition",
  },
  {
    title: "Branding",
    iconSolid: PaintSolid,
    iconOutline: PaintOutline,
    route: "/branding",
  },
  {
    title: "Log Out",
    iconSolid: ArrowLeftSolid,
    iconOutline: ArrowLeftOutline,
    route: "/logout",
  },
];

export const menuNavbar = [
  { path: '/dashboard', title: 'Home' },
  { path: '/academy', title: 'Academy' },
  { path: '/report', title: 'Weekly Report' },
  { path: '/scoring', title: 'KPI Scoring' },
  { path: '/operasional', title: 'Operasional' },
  { path: '/attendance', title: 'Attendance' },
  { path: '/operasional/picketSchedule', title: 'Picket Schedule' },
  { path: '/profile', title: 'Profile' },
]
