import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawSPSettingRecord {
    _id: string;
    name: string;
    point: number;
    [key: string]: unknown;
}

export const getSPSettings = async (): Promise<RawSPSettingRecord[]> => {
    try {
        const res = await axiosClient.get('/sp-setting');
        return res.data.data;
    } catch (error) {
        throw handleError(error);
    }
};

export const postSPSetting = async (payload: {
    name: string;
    point: number;
}): Promise<unknown> => {
    try {
        const res = await axiosClient.post('/sp-setting', payload);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateSPSetting = async (
    id: string,
    payload: { name: string; point: number }
): Promise<unknown> => {
    try {
        const res = await axiosClient.patch(`/sp-setting/${id}`, payload);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteSPSetting = async (id: string): Promise<unknown> => {
    try {
        const res = await axiosClient.delete(`/sp-setting/${id}`);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};
