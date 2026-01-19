/**
 * Delete operational record by id
 * @param {string} id
 * @returns {Promise<any>}
 */
export const deleteOperationalRecord = async (id: string) => {
	const res = await axiosClient.delete(`/operational-records/${id}`);
	return res.data;
};
/**
 * Post operational record for picket
 * @param {Object} payload
 * @param {string} payload.scheduleId
 * @param {string} payload.userId
 * @param {string} payload.type
 * @param {string} payload.date
 * @returns {Promise<any>}
 */
export const postOperationalRecord = async (payload: {
	scheduleId: string;
	userId: string;
	type: string;
	date: string;
}) => {
	const res = await axiosClient.post('/operational-records', payload);
	return res.data;
};
import { axiosClient } from "@/lib/axiosClient";
/**
 * @returns {Promise<any[]>}
 */
export const getOperationalRecords = async () => {
	const res = await axiosClient.get('/operational-records?type=picket');
	return res.data.data;
};

export const getAllSchedules = async ({ year, month, day, type = 'picket' }: { year: string | number; month: string | number; day: string | number; type?: string }) => {
	const res = await axiosClient.get(`/schedules?year=${year}&month=${month}&day=${day}&type=${type}`);
	return res.data.data;
};