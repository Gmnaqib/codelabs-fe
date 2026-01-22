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

export const getAllSchedules = async ({ year, month, day, type = 'picket' }: { year: string | number; month: string | number; day: string | number; type?: string }) => {
	const res = await axiosClient.get(`/schedules?year=${year}&month=${month}&day=${day}&type=${type}`);
	return res.data.data;
};

export const getRangeSchedules = async ({type = 'picket' }: { type?: string }) => {
	const today = new Date();
	const endDate = new Date(today);
	endDate.setDate(today.getDate() + 14);
	const endDateStr = endDate.toISOString().slice(0, 10);
	const res = await axiosClient.get(`/schedules?type=${type}&endDate=${endDateStr}`);
	return res.data.data;
};