import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { showErrorToast } from '@/lib/toastHelper';
import { useTableStore } from '@/shared/state';
import { handleError } from '@/shared/services';
import { getAllUsers } from '@/services/users/userService';
import {
  getAllLeaveRequests,
  getTodayLeaveRequests,
  getAttendanceSummary,
  getLeaveRequestById,
  reviewLeaveRequest,
  getAttendanceSummaryByUserId,
} from '@/services/attendance/attendanceService';
import type { StatusSummary } from '@/features/attendance/components/DetailAttendanceCard';
import type {
  AttendanceRow,
  AttendanceSummaryCounts,
  AttendanceTab,
  LeaveRequestRow,
} from '@/features/attendance/types';

interface RawLeaveItem {
  _id: string;
  userId: string;
  start_date?: string | Date;
  startDate?: string | Date;
  end_date?: string | Date;
  endDate?: string | Date;
  approval_status?: string;
  approvalStatus?: string;
  status?: string;
  type?: string;
  reason?: string;
  attachment_url?: string;
}

interface RawUser {
  _id: string;
  name: string;
  change_device_id?: string;
}

interface RawSummaryItem {
  userId: string;
  counts?: AttendanceSummaryCounts;
}

interface AttendanceDetailData {
  statusSummary: StatusSummary[];
}

const ITEMS_PER_PAGE = 10;

function mapLeave(item: RawLeaveItem, userMap: Record<string, string>): LeaveRequestRow {
  return {
    _id: item._id,
    userId: item.userId,
    userName: userMap[item.userId] || '-',
    startDate: item.start_date || item.startDate || '',
    endDate: item.end_date || item.endDate || '',
    approvalStatus: item.approval_status || item.approvalStatus || '',
    type: item.status || item.type || '',
    reason: item.reason,
    attachment_url: item.attachment_url,
  };
}

export function useAttendanceTable() {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const searchQuery = useTableStore((s) => s.searchQuery);

  const [activeTab, setActiveTab] = useState<AttendanceTab>('Permissions');
  const [todayData, setTodayData] = useState<LeaveRequestRow[]>([]);
  const [allData, setAllData] = useState<LeaveRequestRow[] | AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showToday, setShowToday] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestRow | null>(null);
  const [summary, setSummary] = useState<RawSummaryItem[] | null>(null);
  const [detailDialogUserId, setDetailDialogUserId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<AttendanceDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchSummaryCards = async () => {
      try {
        setLoading(true);
        const res = (await getAttendanceSummary(year, month)) as RawSummaryItem[];
        setSummary(res);
      } catch (err) {
        console.error('Error fetching attendance summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummaryCards();
  }, [year, month]);

  const fetchTableData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'Permissions') {
        const [todayRaw, allRaw, users] = await Promise.all([
          getTodayLeaveRequests(),
          getAllLeaveRequests(year, month),
          getAllUsers(),
        ]);

        const userMap: Record<string, string> = Object.fromEntries(
          (users as RawUser[]).map((u) => [u._id, u.name])
        );

        setTodayData((todayRaw as RawLeaveItem[]).map((item) => mapLeave(item, userMap)));
        setAllData((allRaw as RawLeaveItem[]).map((item) => mapLeave(item, userMap)));
      } else {
        const [summaryRaw, users] = await Promise.all([
          getAttendanceSummary(year, month),
          getAllUsers(),
        ]);

        const summaryByUserId: Record<string, RawSummaryItem> = {};
        (summaryRaw as RawSummaryItem[]).forEach((s) => {
          summaryByUserId[s.userId] = s;
        });

        const merged: AttendanceRow[] = (users as RawUser[]).map((u) => ({
          _id: u._id,
          userId: u._id,
          userName: u.name || '-',
          changeDevice: u.change_device_id ? 'True' : 'False',
          counts: summaryByUserId[u._id]?.counts ?? {
            present: 0,
            permit: 0,
            sick: 0,
            late: 0,
            absent: 0,
          },
        }));

        setAllData(merged);
        setTodayData([]);
      }
    } catch (e) {
      setError(handleError(e));
    } finally {
      setLoading(false);
    }
  }, [activeTab, year, month]);

  useEffect(() => {
    fetchTableData();
    setCurrentPage(1);
  }, [fetchTableData]);

  const query = searchQuery.trim().toLowerCase();

  const filteredTodayData = useMemo(
    () => todayData.filter((item) => item.userName?.toLowerCase().includes(query)),
    [todayData, query]
  );

  const filteredData = useMemo(
    () => allData.filter((item) => item.userName?.toLowerCase().includes(query)),
    [allData, query]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenDialog = useCallback(async (id: string) => {
    setSelectedLeave(null);
    const detail = (await getLeaveRequestById(id)) as RawLeaveItem;
    let userName = '-';
    try {
      const users = (await getAllUsers()) as RawUser[];
      const userMap: Record<string, string> = Object.fromEntries(users.map((u) => [u._id, u.name]));
      userName = userMap[detail.userId] || '-';
    } catch {
      userName = '-';
    }
    setSelectedLeave(mapLeave(detail, { [detail.userId]: userName }));
  }, []);

  const handleReview = useCallback(
    async (status: string) => {
      if (!selectedLeave?._id) return;
      try {
        const payloadStatus = status.toLowerCase();
        await reviewLeaveRequest(selectedLeave._id, payloadStatus);
        toast.success('Update Data berhasil!');
        setSelectedLeave((prev) => (prev ? { ...prev, approvalStatus: payloadStatus } : prev));
        await fetchTableData();
      } catch {
        showErrorToast('Gagal memperbarui data.', { duration: 5000 });
      }
    },
    [selectedLeave, fetchTableData]
  );

  const handleOpenDetail = useCallback(
    async (userId: string) => {
      setDetailDialogUserId(userId);
      setDetailLoading(true);
      try {
        const res = await getAttendanceSummaryByUserId(userId, year, month);
        setDetailData(res as AttendanceDetailData);
      } catch {
        setDetailData(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [year, month]
  );

  return {
    activeTab,
    setActiveTab,
    todayData: filteredTodayData,
    loading,
    error,
    showToday,
    setShowToday,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    selectedLeave,
    handleOpenDialog,
    handleReview,
    summary,
    detailDialogUserId,
    detailData,
    detailLoading,
    handleOpenDetail,
  };
}
