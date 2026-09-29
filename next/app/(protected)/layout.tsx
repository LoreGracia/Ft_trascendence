import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebarLateral"
import { AppSidebar } from "@/components/app-sidebar"
import MenuButton from "@/components/Menu/Menu";
import { LogoutButton } from "@/components/button/LogoutButton";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { MobileBottomBar } from "@/components/BottomBar"
import { MobileProfile } from "@/components/Avatar/MobileProfile";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/login");
	if (!session.user.name) redirect("/complete-profile");

	const user = { name: session.user.name, image: session.user.image };

	return (
		<SidebarProvider>
		<AppSidebar className="list-none hidden md:flex" user={user} />
		<MobileBottomBar />
		<MobileProfile user={user}/>
		<LogoutButton className="absolut flex flex-col items-end corner-right z-50 p-2 rounded-lg hover:bg-(--accent)"><LogOut/></LogoutButton>
		<SidebarInset>
			{children}
		</SidebarInset>
		</SidebarProvider>
	);
}