import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawKPIItem {
	_id: string;
	category: string;
	code: string;
	point: number;
	[key: string]: unknown;
}

export const KPIItem = async (): Promise<RawKPIItem[]> => {
	try {
		const res = await axiosClient.get('/kpi/item/');
		const data = res.data.data as RawKPIItem[];
		if (Array.isArray(data)) {
			data.sort((a, b) => {
				if (a.category < b.category) return -1;
				if (a.category > b.category) return 1;
				return 0;
			});
		}
		return data;
	} catch (error) {
		throw handleError(error);
	}
};

export const createKPIItem = async (payload: {
	category: string;
	code: string;
	point: number;
}): Promise<unknown> => {
	try {
		const res = await axiosClient.post('/kpi/item', payload);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};

export const updateKPIItem = async (
	id: string,
	payload: { category: string; code: string; point: number }
): Promise<unknown> => {
	try {
		const res = await axiosClient.put(`/kpi/item/${id}`, payload);
		return res.data;
	} catch (error) {
		throw handleError(error);
	}
};
