import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { menuNavbar } from '@/config/menu'
import { getMe } from '@/services/users/userService'
import { UserType } from '@/types/user'

interface NavbarProps {
  isActive: boolean,
  setIsActive: Dispatch<SetStateAction<boolean>>,
}

const Navbar = ({ isActive }: NavbarProps) => {
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getMe().then((res) => {
        setUser(res);
        setLoading(false);
      }).catch(() => setLoading(false));
    }, []);

    if (loading) return null;

  if (!user) return null;

  const current = menuNavbar.find(item => item.path === pathname)
  let title = current?.title || ''
  if (pathname === "/") {
  title = "Dashboard"
}

  return (
    <div className='flex w-full justify-between p-5 items-center shadow-lg shadow-gray-300 bg-white fixed top-0 z-20'>
      <div className="flex w-full justify-between items-center">
        <div>
          <p className={`font-normal text-xl transition-all ${isActive? "ml-[270px]" : "ml-[60px]" }`}>{title}</p>
        </div>
        <Link href="/profile">
          <div className="flex items-center gap-3">
            <div>
              <Image src="/icon/profile.png" alt="profile" width={35} height={0} className='rounded-full' />
            </div>
            <div>
              <p className='text-sm'>{user ? user.name : "Loading..."}</p>
              <p className='text-xs text-[#5C5C5C]'>
                as a <span className='font-medium'>{user? user?.role : "Loading..."}</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
