"use client"

import React, { useEffect, useState } from 'react';
import MotionWrapper from '@/components/custom-ui/MotionWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputField from '@/components/custom-ui/InputField';
import { Input } from '@/components/ui/input';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useCheckIn } from '@/features/checkin/hooks/useCheckIn';

const CHECKIN_PAGE_PASSWORD_HASH =
  '5debea7fad845de9db2c7c6f0d0bd3fe3ac845eb78dbb3c12e991cb71361e031';

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const MAX_ATTEMPTS = 3;
const LOCK_DURATION_MS = 24 * 60 * 60 * 1000;
const LOCK_STORAGE_KEY = 'checkin_page_lock';

type LockState = { attempts: number; lockedUntil: number | null };

function readLockState(): LockState {
  try {
    const raw = window.localStorage.getItem(LOCK_STORAGE_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    const parsed = JSON.parse(raw);
    return {
      attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
      lockedUntil: typeof parsed.lockedUntil === 'number' ? parsed.lockedUntil : null,
    };
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function writeLockState(state: LockState) {
  window.localStorage.setItem(LOCK_STORAGE_KEY, JSON.stringify(state));
}

function formatRemaining(ms: number): string {
  const totalMinutes = Math.max(Math.ceil(ms / 60000), 1);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} jam ${minutes} menit` : `${minutes} menit`;
}

export default function CheckInPanel() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [search, setSearch] = useState('');

  const { usersWithoutAttendance, loading, checkingIn, handleCheckin, refetch } = useCheckIn(isUnlocked);

  useEffect(() => {
    const state = readLockState();
    if (state.lockedUntil && state.lockedUntil > Date.now()) {
      setLockedUntil(state.lockedUntil);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const isLocked = lockedUntil !== null && lockedUntil > now;

  const handleUnlock = async () => {
    if (isLocked) return;

    const hash = await sha256Hex(passwordInput);
    if (hash === CHECKIN_PAGE_PASSWORD_HASH) {
      setIsUnlocked(true);
      setPasswordError('');
      setLockedUntil(null);
      writeLockState({ attempts: 0, lockedUntil: null });
      return;
    }

    const state = readLockState();
    const attempts = state.attempts + 1;

    if (attempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_DURATION_MS;
      writeLockState({ attempts, lockedUntil: until });
      setLockedUntil(until);
      setNow(Date.now());
      setPasswordError(
        `Terlalu banyak percobaan salah. Coba lagi dalam ${formatRemaining(LOCK_DURATION_MS)}.`
      );
    } else {
      writeLockState({ attempts, lockedUntil: null });
      setPasswordError('Password salah.');
    }
  };

  const filtered = usersWithoutAttendance.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.nim.includes(search)
  );

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-[70vh]">
      {!isUnlocked && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[calc(100%-2rem)] max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Masukkan Password</h2>
            <div className="flex flex-col gap-3">
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUnlock();
                }}
                disabled={isLocked}
                autoFocus
              />
              {isLocked ? (
                <p className="text-sm text-red-500">
                  Terlalu banyak percobaan salah. Coba lagi dalam {formatRemaining(lockedUntil! - now)}.
                </p>
              ) : (
                passwordError && <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <Button onClick={handleUnlock} className="w-full" disabled={isLocked}>
                Masuk
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={!isUnlocked ? 'blur-sm pointer-events-none select-none' : ''}>
        <MotionWrapper>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Check In</h1>
                <p className="text-sm text-muted-foreground">{today}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>{usersWithoutAttendance.length} belum hadir</span>
                </div>
                <Button variant="outline" size="icon" onClick={refetch} disabled={loading}>
                  <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <InputField
              type="text"
              placeholder="Cari nama atau NIM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Card className="p-5">
              {loading ? (
                <p className="text-center py-8 text-sm text-muted-foreground">Loading...</p>
              ) : filtered.length === 0 ? (
                <p className="text-center py-8 text-sm text-muted-foreground">
                  {search ? 'Tidak ada anggota yang cocok.' : 'Semua anggota sudah hadir hari ini!'}
                </p>
              ) : (
                <div className="flex flex-col">
                  {filtered.map((user, i) => (
                    <div
                      key={user._id}
                      className={`flex items-center justify-between py-3 ${
                        i < filtered.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.nim} · {user.role}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCheckin(user._id)}
                        disabled={checkingIn === user._id}
                      >
                        {checkingIn === user._id ? '...' : 'Check In'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}
