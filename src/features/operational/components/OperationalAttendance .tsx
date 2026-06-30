import DialogField from '@/components/custom-ui/DialogField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react'
import { getAttendanceToday, postCheckOutByOperational, postCheckOutAllByOperational, postLeaveRequestByOperational } from '@/services/attendance/attendanceService';
import { getAllUsers } from '@/services/users/userService';
import InputField from '@/components/custom-ui/InputField';
import imageCompression from 'browser-image-compression';
import DateRangePicker from '@/components/custom-ui/DateRangePicker';
import { toast } from 'sonner';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { Textarea } from '@/components/ui/textarea';

const OperationalAttendance  = () => {
    const [mode, setMode] = useState<'Checkout' | 'Permit'>('Checkout');
    const [mainDialogOpen, setMainDialogOpen] = useState<boolean>(false);
    const [checkoutUserIds, setCheckoutUserIds] = useState<string[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);
    const [reason, setReason] = useState<string>('');
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
    const [openPermitDialogUserId, setOpenPermitDialogUserId] = useState<string | null>(null);
    // const [permitReason, setPermitReason] = useState<string>('');
    const [permitLoadingUserId, setPermitLoadingUserId] = useState<string | null>(null);
    // const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [permitUsers, setPermitUsers] = useState<User[]>([]);
    const [leaveType, setLeaveType] = useState<'sick' | 'permit'>('sick');
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [leaveAttachment, setLeaveAttachment] = useState<File | Blob | null>(null);
    const [showDateModal, setShowDateModal] = useState(false);
    const [checkoutAllDialogOpen, setCheckoutAllDialogOpen] = useState(false);
    const [checkoutAllReason, setCheckoutAllReason] = useState('');
    const [checkoutAllLoading, setCheckoutAllLoading] = useState(false);

    type User = { _id: string; name: string; status: string };
    type Attendance = { checkIn?: string; checkOut?: string; userId: string };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAttendanceToday();
                const attendanceArr: Attendance[] = Array.isArray(data) ? data : [data];
                // For checkout: checkIn exists, checkOut null
                const filtered = attendanceArr.filter(
                    (item) => item.checkIn && !item.checkOut && item.userId
                );
                const userIds = filtered.map((item) => item.userId);
                setCheckoutUserIds(userIds);

                const users: User[] = await getAllUsers();
                const map: Record<string, string> = {};
                users.forEach((user) => {
                    map[user._id] = user.name;
                });
                setUserMap(map);
                // Save active users
                const active = users.filter((user) => user.status === 'active');
                // setActiveUsers(active); // Not used

                // For permit: users who are active and have NO attendance record today at all
                const attendedUserIds = attendanceArr.map((item) => item.userId);
                const permit = active.filter((user) => !attendedUserIds.includes(user._id));
                setPermitUsers(permit);
            } catch {
            }
        };
        fetchData();
    }, []);

    const handleOpenDialog = (userId: string) => {
        setOpenDialogUserId(userId);
        setReason('');
    };
    const handleOpenPermitDialog = (userId: string) => {
        setOpenPermitDialogUserId(userId);
    };

    return (
        <div>
            <DialogField
                name={<PencilSquareIcon className="size-5" />}
                title="Attendance Control"
                noPadding
                open={mainDialogOpen}
                onOpenChange={setMainDialogOpen}
            >
                <div className="flex justify-center mb-4">
                    <Button
                        variant="link"
                        className="w-full flex items-center rounded-full relative select-none border border-gray-300 bg-gray-200 transition-colors duration-300 px-1"
                        onClick={() => setMode(mode === 'Checkout' ? 'Permit' : 'Checkout')}
                    >
                        <span
                            className="absolute left-1 h-10 w-[calc(50%-4px)] rounded-full transition-transform duration-300 bg-primary"
                            style={{ transform: mode === 'Checkout' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
                        />
                        <span className="w-full flex justify-between items-center relative z-10">
                            <span className={`w-1/2 text-center text-base font-semibold leading-6 transition-colors duration-300 ${mode === 'Checkout' ? 'text-white' : 'text-gray-600'}`}>Checkout</span>
                            <span className={`w-1/2 text-center text-base font-semibold leading-6 transition-colors duration-300 ${mode === 'Permit' ? 'text-white' : 'text-gray-600'}`}>Permit</span>
                        </span>
                    </Button>
                </div>
                {mode === 'Checkout' ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-sm text-gray-500">{checkoutUserIds.length} member{checkoutUserIds.length !== 1 ? 's' : ''} checked in</span>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={checkoutUserIds.length === 0}
                                onClick={() => { setCheckoutAllReason(''); setCheckoutAllDialogOpen(true); }}
                            >
                                Checkout All
                            </Button>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                        {checkoutUserIds.length > 0 ? (
                            checkoutUserIds.map((id) => (
                                <div key={id} className="flex flex-col gap-2">
                                    <div className="grid grid-cols-2 items-center justify-center">
                                        <p className="text-center">{userMap[id] || id}</p>
                                        <div className="flex justify-center">
                                            <Button type="button" className="px-6 py-2 text-base font-semibold w-fit" onClick={() => { setMainDialogOpen(true); handleOpenDialog(id); }}>
                                                Checkout
                                            </Button>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <span className="block text-xs font-normal text-gray-400">No users have checked in today</span>
                                <div></div>
                            </div>
                        )}
                        {openDialogUserId && (
                            <DialogField
                                name={userMap[openDialogUserId] || openDialogUserId}
                                title="Reasons For Member Checkout"
                                noPadding
                                open
                                onOpenChange={open => { if (!open) setOpenDialogUserId(null); }}
                                onSubmit={async (closeDialog) => {
                                    if (!reason) {
                                        return;
                                    }
                                    setLoadingUserId(openDialogUserId);
                                    try {
                                        await postCheckOutByOperational(openDialogUserId, reason);
                                        toast.success('Checkout successful');
                                        setMainDialogOpen(false);
                                    } catch {
                                        toast.error('Checkout failed');
                                    } finally {
                                        setOpenDialogUserId(null);
                                        setReason('');
                                        setLoadingUserId(null);
                                        closeDialog?.();
                                    }
                                }}
                                submitDisabled={loadingUserId === openDialogUserId || !reason}
                            >
                                <div className="p-4 flex flex-col gap-2">
                                    <InputField
                                        label=""
                                        type="text"
                                        placeholder="permission to go home early due to illness"
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                    />
                                </div>
                            </DialogField>
                        )}
                        </div>
                        <Dialog open={checkoutAllDialogOpen} onOpenChange={setCheckoutAllDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Checkout All</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 py-2">
                                    <InputField
                                        label="Reason"
                                        type="text"
                                        placeholder="e.g. end of operational hours"
                                        value={checkoutAllReason}
                                        onChange={e => setCheckoutAllReason(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setCheckoutAllDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={checkoutAllLoading || !checkoutAllReason}
                                        onClick={async () => {
                                            setCheckoutAllLoading(true);
                                            try {
                                                const result = await postCheckOutAllByOperational(checkoutAllReason);
                                                toast.success(`${result.data?.checkedOut ?? 0} user(s) checked out`);
                                                setCheckoutAllDialogOpen(false);
                                                setMainDialogOpen(false);
                                            } catch {
                                                toast.error('Checkout all failed');
                                            } finally {
                                                setCheckoutAllLoading(false);
                                            }
                                        }}
                                    >
                                        {checkoutAllLoading ? 'Processing...' : 'Confirm'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 mt-2 max-h-80 overflow-y-auto">
                        {permitUsers.length > 0 ? (
                            permitUsers.map((user) => (
                                <div key={user._id} className="flex flex-col gap-2">
                                    <div className="grid grid-cols-2 items-center justify-center">
                                        <p className="text-center">{user.name}</p>
                                        <div className="flex justify-center">
                                            <Button type="button" className="px-6 py-2 text-base font-semibold w-fit" onClick={() => { setMainDialogOpen(true); handleOpenPermitDialog(user._id); }}>
                                                Permit
                                            </Button>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <span className="block text-xs font-normal text-gray-400 text-center">No users available for permit</span>
                        )}
                        {openPermitDialogUserId && (
                            <DialogField
                                name='Add Permission'
                                title='Permission'
                                variant='link'
                                size='noPadding'
                                noPadding
                                open
                                onOpenChange={open => {
                                    if (!open) setOpenPermitDialogUserId(null);
                                }}
                                onSubmit={async (closeDialog) => {
                                    if (!leaveType || !leaveReason || !leaveStartDate || !leaveAttachment) {
                                        toast.error('All fields are required');
                                        return;
                                    }
                                    setPermitLoadingUserId(openPermitDialogUserId);
                                    try {
                                        const finalEndDate = leaveEndDate || leaveStartDate;
                                        await postLeaveRequestByOperational({
                                            userId: openPermitDialogUserId,
                                            type: leaveType,
                                            reason: leaveReason,
                                            attachment: leaveAttachment,
                                            start_date: leaveStartDate,
                                            end_date: finalEndDate,
                                        });
                                        toast.success('Permit request submitted successfully');
                                        setMainDialogOpen(false);
                                    } catch {
                                        toast.error('Permit request failed');
                                    } finally {
                                        setOpenPermitDialogUserId(null);
                                        setPermitLoadingUserId(null);
                                        setLeaveType('sick');
                                        setLeaveReason('');
                                        setLeaveStartDate('');
                                        setLeaveEndDate('');
                                        setLeaveAttachment(null);
                                        closeDialog?.();
                                    }
                                }}
                                submitDisabled={permitLoadingUserId === openPermitDialogUserId || !leaveType || !leaveReason || !leaveStartDate || !leaveAttachment}
                            >
                                <div>
                                    <p className='mb-1'>Select Permission</p>
                                    <DropdownField
                                        title={leaveType === 'sick' ? 'Sick' : 'Permit'}
                                        menu={["Sick", "Permit"]}
                                        onSelect={v => setLeaveType(v === 'Sick' ? 'sick' : 'permit')}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Textarea
                                        label="Reason"
                                        placeholder="Enter reason..."
                                        value={leaveReason}
                                        onChange={e => setLeaveReason(e.target.value)}
                                    />
                                    <div>
                                        <label className="block mb-1">Leave Date</label>
                                        <Button className='w-full flex p-1'
                                            onClick={() => {
                                                if (!showDateModal) {
                                                    setShowDateModal(true);
                                                }
                                            }}
                                        >
                                            {leaveStartDate && leaveEndDate && leaveStartDate !== leaveEndDate
                                                ? `${leaveStartDate} s/d ${leaveEndDate}`
                                                : leaveStartDate
                                                    ? leaveStartDate
                                                    : 'Select Leave Date'}
                                        </Button>
                                        {showDateModal && (
                                            <div
                                                className="fixed inset-0 z-50 flex items-center justify-center"
                                                style={{ background: 'transparent' }}
                                                onClick={() => setShowDateModal(false)}
                                            >
                                                <div
                                                    className="bg-white rounded shadow-lg p-4"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <DateRangePicker
                                                        startDate={leaveStartDate || null}
                                                        endDate={leaveEndDate || null}
                                                        minDate={new Date().toISOString().split('T')[0]}
                                                        onChange={(start, end) => {
                                                            setLeaveStartDate(start || '');
                                                            setLeaveEndDate(end || '');
                                                        }}
                                                    />
                                                    <div className="flex gap-2 mt-4 justify-end">
                                                        <Button type="button" onClick={() => {
                                                            if (leaveStartDate) {
                                                                setShowDateModal(false);
                                                            }
                                                        }}>
                                                            Pilih
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {!leaveAttachment ? (
                                        <div>
                                            <label className="block text-base font-light mb-1">Choose Picture</label>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg"
                                                className="block w-full rounded-lg border border-gray-700 p-1 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#232329] file:text-white hover:file:bg-primary/80"
                                                onChange={async e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    if (["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
                                                    try {
                                                        const compressedFile = await imageCompression(file, {
                                                        maxSizeMB: 0.5, 
                                                        maxWidthOrHeight: 1280,
                                                        useWebWorker: true
                                                        });
                                                        setLeaveAttachment(compressedFile);
                                                    } catch {
                                                        setLeaveAttachment(file); 
                                                    }
                                                    } else {
                                                    setLeaveAttachment(file);
                                                    }
                                                }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-base text-center mt-1 text-primary">Foto sudah diambil</span>
                                    )}
                                </div>
                            </DialogField>
                        )}
                    </div>
                )}
            </DialogField>
        </div>
    )
}

export default OperationalAttendance 
