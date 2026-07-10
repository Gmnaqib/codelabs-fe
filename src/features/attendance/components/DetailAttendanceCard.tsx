
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusColor } from "@/utils/statusColor";
import { DocumentTextIcon, HeartIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export interface StatusRecord {
	date: string;
	reason?: string;
	approvalStatus?: string;
}

export interface StatusSummary {
	status: string;
	records: StatusRecord[];
}

interface DetailAttendanceCardProps {
	statusSummary: StatusSummary[];
}

const STATUS_LABELS: Record<string, { label: string; color: string; borderActive: string; borderInactive: string; bg: string; iconBg: string; radio: string; icon: React.ReactNode }> = {
	present: {
		label: "Present",
		color: "text-teal-600",
		borderActive: "border-teal-400",
		borderInactive: "border-teal-100",
		bg: "bg-teal-50",
		iconBg: "bg-teal-100 text-teal-600",
		radio: "border-teal-500",
		icon: <CheckCircleIcon className="w-7 h-7" />,
	},
	absent: {
		label: "Absent",
		color: "text-red-600",
		borderActive: "border-red-400",
		borderInactive: "border-red-100",
		bg: "bg-red-50",
		iconBg: "bg-red-100 text-red-600",
		radio: "border-red-500",
		icon: <ExclamationTriangleIcon className="w-7 h-7" />,
	},
	late: {
		label: "Late",
		color: "text-yellow-700",
		borderActive: "border-yellow-400",
		borderInactive: "border-yellow-100",
		bg: "bg-yellow-50",
		iconBg: "bg-yellow-100 text-yellow-700",
		radio: "border-yellow-500",
		icon: <ClockIcon className="w-7 h-7" />,
	},
	permit: {
		label: "Permit",
		color: "text-blue-600",
		borderActive: "border-blue-400",
		borderInactive: "border-blue-100",
		bg: "bg-blue-50",
		iconBg: "bg-blue-100 text-blue-600",
		radio: "border-blue-500",
		icon: <DocumentTextIcon className="w-7 h-7" />,
	},
	sick: {
		label: "Sick",
		color: "text-green-600",
		borderActive: "border-green-400",
		borderInactive: "border-green-100",
		bg: "bg-green-50",
		iconBg: "bg-green-100 text-green-600",
		radio: "border-green-500",
		icon: <HeartIcon className="w-7 h-7" />,
	},
};

// Matches the excess-to-No-Report logic in useTotalAttendanceCard.ts: once a
// status hits its monthly limit, further occurrences no longer count toward
// that status — they get folded into No Report instead.
const STATUS_LIMITS: Record<string, number> = { sick: 4, permit: 2, late: 4 };

function getDefaultSelected(
	menu: [string, (typeof STATUS_LABELS)[string]][],
	statusSummary: StatusSummary[]
): string {
	// Auto-activate the first status (in menu/priority order) that actually
	// has records, so opening the dialog doesn't land on an empty tab.
	const firstWithData = menu.find(([key]) => {
		const summary = statusSummary.find((s) => s.status === key);
		return (summary?.records.length ?? 0) > 0;
	});
	return firstWithData?.[0] ?? menu[0]?.[0] ?? "permit";
}

function RecordsList({ records, statusKey }: { records: StatusRecord[]; statusKey: string }) {
	if (records.length === 0) {
		return <div className="text-center text-gray-400 py-4">No data available.</div>;
	}

	return (
		<>
			{records.map((rec, idx) => {
				const limit = STATUS_LIMITS[statusKey];
				const isExcess = limit !== undefined && idx >= limit;
				return (
					<div
						key={idx}
						className={
							isExcess
								? "mb-4 p-3 rounded-lg border border-red-200 bg-red-50"
								: "mb-6 pb-4 border-b last:border-b-0"
						}
					>
						<div className={`font-semibold text-base mb-1 ${isExcess ? "text-red-700" : ""}`}>
							{new Date(rec.date).toLocaleDateString("en-US", {
								weekday: "long",
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}
						</div>
						<div className="text-xs text-gray-500 mb-1">
							{new Date(rec.date).toLocaleTimeString("en-US")}
						</div>
						{statusKey !== "absent" && statusKey !== "present" && (
							<>
								<div className="text-sm font-light mb-1">{rec.reason}</div>
								<div className={`text-sm ${getStatusColor(rec.approvalStatus ?? "")}`}>
									{rec.approvalStatus?.toUpperCase()}
								</div>
							</>
						)}
						{isExcess && (
							<div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 rounded-full px-2 py-0.5">
								Exceeds limit — counted as No Report
							</div>
						)}
					</div>
				);
			})}
		</>
	);
}

const DetailAttendanceCard: React.FC<DetailAttendanceCardProps> = ({ statusSummary }) => {
	const availableStatus = statusSummary.map((s) => s.status);
	const menu = Object.entries(STATUS_LABELS).filter(([key]) => availableStatus.includes(key));
	const [selected, setSelected] = useState<string>(() => getDefaultSelected(menu, statusSummary));
	const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

	const selectedSummary = statusSummary.find((s) => s.status === selected);

	return (
		<div className="w-full">
			{/* Desktop (lg+): category list on the left, records panel on the right */}
			<div className="hidden lg:flex gap-8 w-full max-h-96">
				<div className="flex flex-col gap-4 w-72 min-w-60 shrink-0">
					{menu.map(([key, { label, color, icon, borderActive, borderInactive, bg, iconBg, radio }]) => (
						<div
							key={key}
							className={`rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-center px-4 py-3 ${selected === key ? borderActive : borderInactive} ${selected === key ? bg : "bg-white"}`}
							onClick={() => setSelected(key)}
						>
							<div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBg} mr-4`}>
								{icon}
							</div>
							<div className="flex-1">
								<div className={`font-semibold text-lg ${color}`}>{label}</div>
							</div>
							<div className="ml-auto flex items-center">
								<span className={`w-6 h-6 rounded-full ${radio} flex items-center justify-center bg-white ${selected === key ? "border-2" : "border"}`}>
									{selected === key ? (
										<span className={`w-3.5 h-3.5 rounded-full ${color} bg-current`}></span>
									) : (
										<span className="w-3.5 h-3.5 rounded-full bg-white"></span>
									)}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className="flex-1 max-h-128 overflow-y-auto">
					<Card>
						<CardContent className="py-6 flex flex-col gap-2">
							<RecordsList records={selectedSummary?.records ?? []} statusKey={selected} />
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Mobile & tablet (below lg): tap a category to expand its records inline, tap again to collapse */}
			<div className="flex lg:hidden flex-col gap-3 max-h-112 overflow-y-auto">
				{menu.map(([key, { label, color, icon, borderActive, borderInactive, bg, iconBg }]) => {
					const summary = statusSummary.find((s) => s.status === key);
					const isExpanded = expandedMobile === key;
					return (
						<div key={key} className="flex flex-col">
							<div
								className={`rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-center px-4 py-3 ${isExpanded ? borderActive : borderInactive} ${isExpanded ? bg : "bg-white"}`}
								onClick={() => setExpandedMobile((prev) => (prev === key ? null : key))}
							>
								<div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg} mr-3`}>
									{icon}
								</div>
								<div className="flex-1">
									<div className={`font-semibold text-base ${color}`}>{label}</div>
								</div>
								<ChevronDownIcon
									className={`size-5 text-gray-400 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
								/>
							</div>
							{isExpanded && (
								<div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg">
									<RecordsList records={summary?.records ?? []} statusKey={key} />
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DetailAttendanceCard;
