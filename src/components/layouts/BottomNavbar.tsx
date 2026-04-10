"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/config/menu";
import { useEffect, useState } from "react";
import { getMe } from "@/services/users/userService";
import type { UserType } from "@/types/user";

const bottomMenuKeys = ["Dashboard", "Weekly Report", "KPI Scoring"];

const BottomNavbar = () => {
	const pathname = usePathname();
	const [user, setUser] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getMe().then((res) => {
			setUser(res);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);

	if (loading || !user) return null;

	const filteredMenu = menuItems.filter(
		item => bottomMenuKeys.includes(item.title) && (!item.roles || item.roles.includes(user.role))
	);

	return (
		<nav className="fixed -bottom-2 left-0 right-0  bg-white flex justify-around items-center h-20 z-20 shadow-lg">
			{filteredMenu.map(({ title, iconSolid: IconSolid, iconOutline: IconOutline, route }) => {
				const isMenuActive = pathname === route;
				const Icon = isMenuActive ? IconSolid : IconOutline;
				return (
					<Link href={route} key={title} className="flex flex-col items-center justify-center text-white">
						<Icon className={`mb-1 ${isMenuActive ? 'opacity-100 text-primary' : 'opacity-50 text-gray-700'} size-6`} />
						<span className={`text-xs ${isMenuActive ? 'opacity-100 text-primary' : 'opacity-50 text-gray-700'}`}>{title}</span>
					</Link>
				);
			})}
		</nav>
	);
};

export default BottomNavbar;
