import { axiosClient } from "@/lib/axiosClient";

export const editProduct = async (id: string, payload: { productManager: string; name: string; description: string; status: string }) => {
    const res = await axiosClient.patch(`/products/${id}`, payload);
    return res.data;
};

export const postProduct = async (payload: { name: string; description: string; status: string }) => {
    const res = await axiosClient.post('/products', payload);
    return res.data;
};

export const getProducts = async () => {
    const res = await axiosClient.get('/products/');
    return res.data.data;
};

