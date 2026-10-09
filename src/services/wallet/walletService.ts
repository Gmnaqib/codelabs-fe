import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface PointWallet {
  totalEarned: number;
  totalSpent: number;
  balance: number;
}

export const getMyWallet = async (): Promise<PointWallet> => {
  try {
    const res = await axiosClient.get("/wallet/me");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface PointTransaction {
  _id: string;
  userId: string;
  amount: number;
  reason: string;
  createdBy: { _id: string; name: string } | string;
  createdAt: string;
}

export const getMyWalletHistory = async (): Promise<PointTransaction[]> => {
  try {
    const res = await axiosClient.get("/wallet/me/history");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};
