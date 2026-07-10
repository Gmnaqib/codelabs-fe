import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawProductRecord {
    _id: string;
    name: string;
    description: string;
    status: string;
    [key: string]: unknown;
}

export const editProduct = async (
    id: string,
    payload: { productManager: string; name: string; description: string; status: string }
): Promise<unknown> => {
    try {
        const res = await axiosClient.patch(`/products/${id}`, payload);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

export const postProduct = async (payload: {
    name: string;
    description: string;
    status: string;
}): Promise<unknown> => {
    try {
        const res = await axiosClient.post('/products', payload);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getProducts = async (): Promise<RawProductRecord[]> => {
    try {
        const res = await axiosClient.get('/products/');
        return res.data.data;
    } catch (error) {
        throw handleError(error);
    }
};
