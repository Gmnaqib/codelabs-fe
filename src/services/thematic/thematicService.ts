import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export const swapThematicGroups = async ({
	schedule1Id,
	schedule2Id,
}: {
	schedule1Id: string;
	schedule2Id: string;
}): Promise<unknown> => {
	try {
		const res = await axiosClient.post('/schedules/swap-groups', {
			schedule1Id,
			schedule2Id,
		});
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export interface RawThematicSchedule {
	_id: string;
	date: string;
	description: string;
	assignedUsers?: { _id: string; name: string; nim?: string }[];
}

export const getAllSchedulesThematic = async (): Promise<RawThematicSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules?type=thematic');
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getTodayThematicSchedule = async (date?: string): Promise<RawThematicSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules/today-thematic', { params: date ? { date } : undefined });
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const getUpcomingThematicScheduleForSwap = async (): Promise<RawThematicSchedule[]> => {
	try {
		const res = await axiosClient.get('/schedules/swap-thematic');
		return res.data.data;
	} catch (error) {
		throw handleError(error);
	}
};

// Unlike picket (a weekly recurring pattern expanded over a date range),
// each thematic entry is a specific, one-off date with its own team — no
// day-of-week/rotation logic involved.
export type ThematicScheduleEntry = {
	date: string;
	assignedUsers: string[];
	description?: string;
};

export const postScheduleThematicBatch = async (entries: ThematicScheduleEntry[]): Promise<unknown> => {
	try {
		const res = await axiosClient.post('/schedules/batch-thematic', { entries });
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const deleteScheduleThematic = async (id: string): Promise<unknown> => {
	try {
		const res = await axiosClient.delete(`/schedules/${id}`);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};
