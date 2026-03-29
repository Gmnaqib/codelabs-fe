import { axiosClient } from "@/lib/axiosClient";

export const KPIItem = async () => {
	const res = await axiosClient.get('/kpi/item/');
	const data = res.data.data;
	if (Array.isArray(data)) {
		data.sort((a, b) => {
			if (a.category < b.category) return -1;
			if (a.category > b.category) return 1;
			return 0;
		});
	}
	return data;
};

export const createKPIItem = async (payload: { category: string; code: string; point: number }) => {
	const res = await axiosClient.post('/kpi/item', payload);
	return res.data;
};

export const updateKPIItem = async (id: string, payload: { category: string; code: string; point: number }) => {
	const res = await axiosClient.put(`/kpi/item/${id}`, payload);
	return res.data;
};

