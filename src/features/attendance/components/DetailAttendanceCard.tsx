
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusColor } from "@/utils/statusColor";

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

const STATUS_LABELS: Record<string, { label: string; color: string; borderActive: string; borderInactive: string; bg: string; iconBg: string; radio: string }> = {
    absent: {
		label: "Absent",
		color: "text-red-600",
		borderActive: "border-red-400",
		borderInactive: "border-red-100",
		bg: "bg-red-50",
		iconBg: "bg-red-100 text-red-600",
		radio: "border-red-500",
	},
    late: {
		label: "Late",
		color: "text-yellow-700",
		borderActive: "border-yellow-400",
		borderInactive: "border-yellow-100",
		bg: "bg-yellow-50",
		iconBg: "bg-yellow-100 text-yellow-700",
		radio: "border-yellow-500",
	},
	permit: {
		label: "Permit",
		color: "text-blue-600",
		borderActive: "border-blue-400",
		borderInactive: "border-blue-100",
		bg: "bg-blue-50",
		iconBg: "bg-blue-100 text-blue-600",
		radio: "border-blue-500",
	},
	sick: {
		label: "Sick",
		color: "text-green-600",
		borderActive: "border-green-400",
		borderInactive: "border-green-100",
		bg: "bg-green-50",
		iconBg: "bg-green-100 text-green-600",
		radio: "border-green-500",
	},
};

const DetailAttendanceCard: React.FC<DetailAttendanceCardProps> = ({ statusSummary }) => {
	const [selected, setSelected] = useState<string>("permit");

	// Get all available status types from the data
	const availableStatus = statusSummary.map((s) => s.status);
	// Only show menu for available status
	const menu = Object.entries(STATUS_LABELS).filter(([key]) => availableStatus.includes(key));
	const selectedSummary = statusSummary.find((s) => s.status === selected);

	return (
			<div className="flex gap-8 w-full max-h-96">
				{/* Left menu */}
				<div className="flex flex-col gap-4 w-72 min-w-60 shrink-0">
					{menu.map(([key, { label, color, borderActive, borderInactive, bg, iconBg, radio }]) => (
						<div
							key={key}
							className={`rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-center px-4 py-3 ${selected === key ? borderActive : borderInactive} ${selected === key ? bg : "bg-white"}`}
							onClick={() => setSelected(key)}
						>
							<div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBg} mr-4`}>
								<span className="text-2xl font-bold">{label[0]}</span>
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

				{/* Right data panel */}
				<div className="flex-1 max-h-[32rem] overflow-y-auto">
					<Card>
						<CardContent className="py-6 flex flex-col gap-2">
							{selectedSummary && selectedSummary.records.length > 0 ? (
								selectedSummary.records.map((rec, idx) => (
									<div key={idx} className="mb-6 pb-4 border-b last:border-b-0">
										<div className="font-semibold text-base mb-1">
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
										{selected !== "absent" && (
                                            <>
                                                <div className="text-sm font-light mb-1">{rec.reason}</div>
                                                <div className={`text-sm ${getStatusColor(rec.approvalStatus ?? "")}`}>
                                                    {rec.approvalStatus?.toUpperCase()}
                                                </div>
                                            </>
										)}
                                        </div>
								))
							) : (
								<div className="text-center text-gray-400">No data available.</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
	);
};

export default DetailAttendanceCard;
