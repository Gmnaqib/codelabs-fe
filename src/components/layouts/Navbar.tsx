import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Dispatch, SetStateAction } from 'react'
import { menuNavbar } from '@/config/menu' // sesuaikan path
import { useAuth } from '@/context/AuthContext'

interface NavbarProps {
  isActive: boolean,
  setIsActive: Dispatch<SetStateAction<boolean>>,
}

const Navbar = ({ isActive }: NavbarProps) => {
  const pathname = usePathname()
  const { user } = useAuth()

  const current = menuNavbar.find(item => item.path === pathname)
  const title = current?.title || ''

  return (
    <div className='flex w-full justify-between p-5 items-center shadow-lg shadow-gray-300 bg-white fixed top-0'>
      <div className="flex w-full justify-between items-center">
        <div>
          <p className='font-bold text-lg'>{title}</p>
        </div>
        <Link href="/profile">
          <div className="flex items-center gap-3">
            <div>
              <Image src="/icon/profile.png" alt="profile" width={25} height={0} className='rounded-full' />
            </div>
            <div>
              <p className='text-sm'>{user ? user.name : "Loading..."}</p>
              <p className='text-xs'>
               as a <span className='font-bold'>{user? user?.role : "Loading..."}</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
