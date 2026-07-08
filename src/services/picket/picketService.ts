import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";
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

export const getOperationalRecords = async (): Promise<OperationalRecord[]> => {
	try {
		const res = await axiosClient.get('/operational-records?type=picket');
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getOperationalRecordsToday = async (
	year: string | number,
	month: string | number
): Promise<OperationalRecord[]> => {
	try {
		const res = await axiosClient.get(`/operational-records?type=picket&year=${year}&month=${month}`);
		const today = new Date();
		const todayStr = today.toISOString().slice(0, 10);
		const filtered = (res.data.data || []).filter((item: OperationalRecord) => {
			const dateStr = item.date ? item.date.slice(0, 10) : null;
			return dateStr === todayStr;
		});
		return filtered;
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

export const getAllSchedules2 = async (): Promise<RawPicketSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules?type=picket');
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getTodayPicketSchedule = async (): Promise<RawPicketSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules/today');
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
