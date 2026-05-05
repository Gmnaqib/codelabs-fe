import DialogField from '@/components/custom-ui/DialogField';
import { Button } from '@/components/ui/button';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react'
import { getAttendanceToday, postCheckOutByOperational } from '@/services/attendance/attendanceService';
import { getAllUsers } from '@/services/users/userService';
import InputField from '@/components/custom-ui/InputField';
import { toast } from 'sonner';

const OperationalAttendance  = () => {
    const [mode, setMode] = useState<'Checkout' | 'Permit'>('Checkout');
    const [mainDialogOpen, setMainDialogOpen] = useState<boolean>(false);
    const [checkoutUserIds, setCheckoutUserIds] = useState<string[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);
    const [reason, setReason] = useState<string>('');
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch attendance
                const data = await getAttendanceToday();
                const filtered = (Array.isArray(data) ? data : [data]).filter(
                    (item: any) => item.checkIn && !item.checkOut && item.userId
                );
                const userIds = filtered.map((item: any) => item.userId);
                setCheckoutUserIds(userIds);

                // Fetch all users
                const users = await getAllUsers();
                // Build map: userId -> name
                const map: Record<string, string> = {};
                users.forEach((user: any) => {
                    map[user._id] = user.name;
                });
                setUserMap(map);
            } catch (err) {
                // handle error if needed
            }
        };
        fetchData();
    }, []);

    // Handler for opening dialog
    const handleOpenDialog = (userId: string) => {
        setOpenDialogUserId(userId);
        setReason('');
    };

    // Handler for submitting checkout
    const handleCheckout = async () => {
        if (!openDialogUserId || !reason) return;
        setLoadingUserId(openDialogUserId);
        try {
            await postCheckOutByOperational(openDialogUserId, reason);
            setOpenDialogUserId(null);
            setReason('');
            // Optionally, refresh attendance list here
        } catch (err) {
            // handle error if needed
        } finally {
            setLoadingUserId(null);
        }
    };

    return (
        <div>
            <DialogField
                name={<PencilSquareIcon className="size-5" />}
                title="Operational Mode"
                noPadding
                open={mainDialogOpen}
                onOpenChange={setMainDialogOpen}
            >
                <div className="flex justify-center mb-4">
                    <Button
                        variant="link"
                        className="w-80 flex items-center rounded-full relative select-none border border-gray-300 bg-gray-200 transition-colors duration-300"
                        onClick={() => setMode(mode === 'Checkout' ? 'Permit' : 'Checkout')}
                    >
                        <span
                            className="absolute left-1 h-10 w-40 rounded-full transition-transform duration-300 bg-primary"
                            style={{ transform: mode === 'Checkout' ? 'translateX(0)' : 'translateX(150px)' }}
                        />
                        <span className="w-full flex justify-between items-center relative z-10">
                            <span className={`w-40 text-center text-base font-semibold leading-6 transition-colors duration-300 -ml-5 ${mode === 'Checkout' ? 'text-white' : 'text-gray-600'}`}>Checkout</span>
                            <span className={`w-40 text-center text-base font-semibold leading-6 transition-colors duration-300 -mr-5 ${mode === 'Permit' ? 'text-white' : 'text-gray-600'}`}>Permit</span>
                        </span>
                    </Button>
                </div>
                {mode === 'Checkout' ? (
                    <div className="flex flex-col gap-2 mt-2 max-h-80 overflow-y-auto">
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
                        {/* Dialog for checkout reason */}
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
                                        setMainDialogOpen(false); // Close main dialog
                                    } catch (err) {
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
                ) : (
                    <p className="text-center text-lg font-medium">permit</p>
                )}
            </DialogField>
        </div>
    )
}

export default OperationalAttendance 
