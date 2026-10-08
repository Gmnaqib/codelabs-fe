import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";
import { wibTodayDateString } from "@/shared/utils";
import type { OperationalRecord } from "@/types/domain";
import type { CreateOperationalRecordResponse } from "@/services/operational/operationalService";

export const swapPicketUsers = async ({
	schedule1Id,
	schedule1UserId,
	schedule2Id,
	schedule2UserId,
}: {
	schedule1Id: string;
	schedule1UserId: string;
	schedule2Id: string;
	schedule2UserId: string;
}): Promise<unknown> => {
	try {
		const res = await axiosClient.post('/schedules/swap-users', {
			schedule1Id,
			schedule1UserId,
			schedule2Id,
			schedule2UserId,
		});
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const deleteOperationalRecord = async (id: string): Promise<unknown> => {
	try {
		const res = await axiosClient.delete(`/operational-records/${id}`);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const postOperationalRecord = async (payload: {
	scheduleId: string;
	userId: string;
	type: string;
	date: string;
}): Promise<CreateOperationalRecordResponse> => {
	try {
		const res = await axiosClient.post('/operational-records', payload);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getOperationalRecords = async (filters?: {
	scheduleId?: string;
	userId?: string;
	year?: string | number;
	month?: string | number;
}): Promise<OperationalRecord[]> => {
	try {
		const params: Record<string, string> = { type: 'picket' };
		if (filters?.scheduleId) params.scheduleId = filters.scheduleId;
		if (filters?.userId) params.userId = filters.userId;
		if (filters?.year !== undefined) params.year = String(filters.year);
		if (filters?.month !== undefined) params.month = String(filters.month);
		const res = await axiosClient.get('/operational-records', { params });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getOperationalRecordsToday = async (): Promise<OperationalRecord[]> => {
	try {
		const res = await axiosClient.get('/operational-records', { params: { type: 'picket', date: wibTodayDateString() } });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export interface RawPicketSchedule {
	_id: string;
	date: string;
	description: string;
	assignedUsers?: { _id: string; name: string; nim?: string }[];
}

export const getPicketSchedulesForMonth = async (year: number, month: number): Promise<RawPicketSchedule[]> => {
	try {
		const lastDay = new Date(year, month, 0).getDate();
		const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
		const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
		const res = await axiosClient.get('/schedules', { params: { type: 'picket', startDate, endDate } });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

// From today onward, no upper bound — for listing/deleting future schedules
// without re-fetching the ever-growing history of past ones.
export const getUpcomingPicketSchedules = async (): Promise<RawPicketSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules', { params: { type: 'picket', startDate: wibTodayDateString() } });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getTodayPicketSchedule = async (date?: string): Promise<RawPicketSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules/today', { params: date ? { date } : undefined });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getUpcomingPicketScheduleForSwap = async (): Promise<RawPicketSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules/swap');
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

type SchedulePicketPayload = {
	type: string;
	startDate: string;
	endDate: string;
	patterns: {
		daysOfWeek: number[];
		assignedUsers: string[];
		description: string;
	}[];
};

export const postSchedulePicket = async (payload: SchedulePicketPayload): Promise<unknown> => {
	try {
		const res = await axiosClient.post('/schedules/batch', payload);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const deleteSchedulePicket = async (id: string): Promise<unknown> => {
	try {
		const res = await axiosClient.delete(`/schedules/${id}`);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

// Adds member(s) to a specific day's picket team (creating that day's
// schedule first if it doesn't exist yet) without touching any other day.
export const addPicketMembers = async (date: string, userIds: string[]): Promise<RawPicketSchedule> => {
	try {
		const res = await axiosClient.post('/schedules/picket/add-members', { date, userIds });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};
