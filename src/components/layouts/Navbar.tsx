import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { menuNavbar } from '@/config/menu'
import { getMe } from '@/services/users/userService'
import { getMyBanners } from '@/services/banner/bannerService'
import { UserType } from '@/types/user'
import { resolveImageUrl } from '@/lib/utils'

interface NavbarProps {
  isActive: boolean,
  setIsActive: Dispatch<SetStateAction<boolean>>,
}

const Navbar = ({ isActive }: NavbarProps) => {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBar, setShowBar] = useState(false);
  const [activeFrame, setActiveFrame] = useState<string | null>(null);

  useEffect(() => {
    getMe().then((res) => {
      setUser(res);
      setLoading(false);
    }).catch(() => setLoading(false));

    getMyBanners()
      .then((data) => {
        const frame = data.owned.find((o) => o.type === "profile_frame" && o.active);
        setActiveFrame(frame?.image ?? null);
      })
      .catch(() => setActiveFrame(null));

    const handlePhotoUpdate = () => {
      getMe().then(setUser).catch(() => {});
    };
    window.addEventListener("user-photo-updated", handlePhotoUpdate);
    return () => window.removeEventListener("user-photo-updated", handlePhotoUpdate);
  }, []);

  useEffect(() => {
    setShowBar(true);
    const timeout = setTimeout(() => setShowBar(false), 700);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (loading) return null;
  if (!user) return null;

  const current = menuNavbar.find(item => item.path === pathname);
  let title = current?.title || '';
  if (pathname === "/") {
    title = "Dashboard";
  }

  return (
    <div className='flex w-full justify-between p-5 items-center shadow-sm shadow-gray-300 bg-white fixed top-0 z-41'>
      <AnimatePresence>
        {showBar && (
          <motion.div
            key={pathname}
            className="absolute h-1 w-full flex top-0 right-0 z-50 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ left: 0 }}
          />
        )}
      </AnimatePresence>
      <div className="flex w-full justify-between items-center">
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={pathname}
              className={`font-normal text-xl transition-all ${user?.role === 'user' ? (isActive ? 'ml-15 lg:ml-67.5' : 'lg:ml-15') : (isActive ? 'ml-15 lg:ml-67.5' : 'ml-15')}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {title}
            </motion.p>
          </AnimatePresence>
        </div>
        <Link href="/profile">
          <div className="flex items-center gap-3">
            <div className="relative" style={{ width: 35, height: 35 }}>
              {activeFrame && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(activeFrame)}
                  alt="frame"
                  className="pointer-events-none absolute -inset-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.75rem)] max-w-none object-contain"
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveImageUrl(user?.image)} alt="profile" className='relative rounded-full object-cover w-full h-full' />
            </div>
            <div className='hidden md:flex flex-col'>
              <p className='text-sm'>{user ? user.name : "Loading..."}</p>
              <p className='text-xs text-[#5C5C5C]'>
                <span className="hidden md:inline font-medium">
                  as a {user ? user.role : "Loading..."}
                </span>
                <span className="inline md:hidden font-medium">
                  as a {user ? (
                    user.role?.toLowerCase() === "vice president"
                      ? user.role
                      : user.role?.split(" ").slice(-1)[0]
                  ) : "Loading..."}
                </span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
