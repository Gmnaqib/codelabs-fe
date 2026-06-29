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
}) => {
	const res = await axiosClient.post('/schedules/swap-users', {
		schedule1Id,
		schedule1UserId,
		schedule2Id,
		schedule2UserId,
	});
	return res.data;
};
import { axiosClient } from "@/lib/axiosClient";

export const deleteOperationalRecord = async (id: string) => {
	const res = await axiosClient.delete(`/operational-records/${id}`);
	return res.data;
};

export const postOperationalRecord = async (payload: {
	scheduleId: string;
	userId: string;
	type: string;
	date: string;
}) => {
	const res = await axiosClient.post('/operational-records', payload);
	return res.data;
};

export const getOperationalRecords = async () => {
	const res = await axiosClient.get('/operational-records?type=picket');
	return res.data.data;
};

export const getOperationalRecordsToday = async (year: string | number, month: string | number) => {
	const res = await axiosClient.get(`/operational-records?type=picket&year=${year}&month=${month}`);
	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);
	type OperationalRecord = { date?: string; userId?: string; scheduleId?: string; type?: string };
	const filtered = (res.data.data || []).filter((item: OperationalRecord) => {
		const dateStr = item.date ? item.date.slice(0, 10) : null;
		return dateStr === todayStr;
	});
	return filtered;
};

export const getAllSchedules2 = async () => {
	const res = await axiosClient.get('/schedules?type=picket');
	return res.data.data;
};

export const getTodayPicketSchedule = async () => {
	const res = await axiosClient.get('/schedules/today');
	return res.data.data;
};

export const getUpcomingPicketScheduleForSwap = async () => {
	const res = await axiosClient.get('/schedules/swap');
	return res.data.data;
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

export const postSchedulePicket = async (payload: SchedulePicketPayload) => {
	const res = await axiosClient.post('/schedules/batch', payload);
	return res.data;
};

export const deleteSchedulePicket = async (id: string) => {
  const res = await axiosClient.delete(`/schedules/${id}`);
  return res.data;
};
