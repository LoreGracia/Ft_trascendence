"use client"
import Link from "next/link";
import { Avatar } from "@/components/Avatar/Avatar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type MobileProfileProps = {
    className?: string;
	user: { name: string | null; image: string | null };
};


export function MobileProfile({ user,  className = "" }: MobileProfileProps) {
        const pathname = usePathname();
        const isProfilePage = pathname === "/profile" || pathname.startsWith("/profile/");
    return(
		<Link href="/profile" className={cn("md:hidden [&_svg]:size-10 corner-left z-50",
		isProfilePage && "hidden")}>
			<Avatar image={user.image} name={user.name} size="sm" />
		</Link>
    )
};