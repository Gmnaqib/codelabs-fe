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

export const getAllSchedules = async ({ year, month, day, type = 'picket' }: { year: string | number; month: string | number; day: string | number; type?: string }) => {
	const res = await axiosClient.get(`/schedules?year=${year}&month=${month}&day=${day}&type=${type}`);
	return res.data.data;
};


export const getAllSchedules2 = async () => {
	const res = await axiosClient.get('/schedules?type=picket');
	return res.data.data;
};

export const getRangeSchedules = async ({type = 'picket' }: { type?: string }) => {
	const today = new Date();
	const startDate = new Date(today);
	startDate.setDate(today.getDate() + 1);
	const endDate = new Date(today);
	endDate.setDate(today.getDate() + 14);
	const startDateStr = startDate.toISOString().slice(0, 10);
	const endDateStr = endDate.toISOString().slice(0, 10);

	type AssignedUser = { _id: string; name: string };
	type Schedule = { _id: string; date: string | Date; assignedUsers: AssignedUser[] };

	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	const todayRes = await axiosClient.get(`/schedules?year=${year}&month=${month}&day=${day}&type=${type}`);
	const todaySchedules: Schedule[] = todayRes.data.data || [];
	const todayAssignedUserIds = new Set<string>();
	todaySchedules.forEach((schedule: Schedule) => {
		if (schedule.assignedUsers && Array.isArray(schedule.assignedUsers)) {
			schedule.assignedUsers.forEach((user: AssignedUser) => {
				todayAssignedUserIds.add(user._id);
			});
		}
	});

	const res = await axiosClient.get(`/schedules?type=${type}&startDate=${startDateStr}&endDate=${endDateStr}`);
	const rangeSchedules: Schedule[] = res.data.data || [];
	const filteredSchedules = rangeSchedules.map((schedule: Schedule) => {
		if (schedule.assignedUsers && Array.isArray(schedule.assignedUsers)) {
			const filteredUsers = schedule.assignedUsers.filter((user: AssignedUser) => !todayAssignedUserIds.has(user._id));
			return { ...schedule, assignedUsers: filteredUsers };
		}
		return schedule;
	});
	return filteredSchedules;
};

export const postSchedulePicket = async (payload: any) => {
	const res = await axiosClient.post('/schedules/batch', payload);
	return res.data;
};