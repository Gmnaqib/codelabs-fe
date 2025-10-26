import { axiosClient } from "@/lib/axiosClient";

export async function getAllUsers() {
    const {data} = await axiosClient.get("/users")
    return data.data
}