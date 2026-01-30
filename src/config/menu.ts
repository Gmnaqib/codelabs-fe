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
  UserGroupIcon as UserGroupSolid,
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
  UserGroupIcon as UserGroupOutline,
} from "@heroicons/react/24/outline";

export const menuItems = [
  {
    title: "Dashboard",
    iconSolid: SquaresSolid,
    iconOutline: SquaresOutline,
    route: "/",
    roles: [
      "admin", "lecturer", "minister of research", "minister of competition", "minister of branding", "minister of operation", "president", "vice president", "user"
    ],
  },
  {
    title: "Weekly Report",
    iconSolid: ClipboardListSolid,
    iconOutline: ClipboardListOutline,
    route: "/report",
    roles: [
      "admin", "minister of research", "minister of competition", "minister of branding", "minister of operation", "president", "vice president", "user"
    ], 
  },
  {
    title: "KPI Scoring",
    iconSolid: ChartSolid,
    iconOutline: ChartOutline,
    route: "/scoring",
    roles: [
      "admin", "minister of research", "minister of competition", "minister of branding", "minister of operation", "president", "vice president", "user"
    ],
  },
  {
    title: "Operasional",
    iconSolid: BuildingSolid,
    iconOutline: BuildingOutline,
    route: "/operasional",
    roles: ["admin", "minister of operation"],
  },
  {
    title: "Attendance",
    iconSolid: ClipboardCheckSolid,
    iconOutline: ClipboardCheckOutline,
    route: "/attendance",
    roles: ["admin", "minister of operation"],
  },
  {
    title: "Picket Schedule",
    iconSolid: UserGroupSolid,
    iconOutline: UserGroupOutline,
    route: "/picket-schedule",
    roles: ["admin", "minister of operation"],
  },
  {
    title: "Assessments",
    iconSolid: CheckSolid,
    iconOutline: CheckOutline,
    route: "/assessments",
    roles: ["admin", "lecturer"],
  },
  {
    title: "Members",
    iconSolid: IdentificationSolid,
    iconOutline: IdentificationOutline,
    route: "/members",
    roles: ["admin", "president", "vice president", "minister of research"],
  },
  {
    title: "Resarch & Tech",
    iconSolid: ComputerSolid,
    iconOutline: ComputerOutline,
    route: "/ristek",
    roles: ["admin", "minister of research"],
  },
  {
    title: "Competition",
    iconSolid: TrophySolid,
    iconOutline: TrophyOutline,
    route: "/competition",
    roles: ["admin", "minister of competition"],
  },
  {
    title: "Branding",
    iconSolid: PaintSolid,
    iconOutline: PaintOutline,
    route: "/branding",
    roles: ["admin", "minister of branding"],
  },
  {
    title: "Log Out",
    iconSolid: ArrowLeftSolid,
    iconOutline: ArrowLeftOutline,
    route: "/logout",
    roles: [
      "admin", "lecturer", "minister of research", "minister of competition", "minister of branding", "minister of operation", "president", "vice president", "user"
    ],
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
