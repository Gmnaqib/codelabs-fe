export const getAllSchedules = async ({ year, month, day, type = 'picket' }: { year: string | number; month: string | number; day: string | number; type?: string }) => {
	const res = await axiosClient.get(`/schedules?year=${year}&month=${month}&day=${day}&type=${type}`);
	return res.data.data;
};
import { axiosClient } from "@/lib/axiosClient";