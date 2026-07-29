import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebarLateral"
import { AppSidebar } from "@/components/app-sidebar"
import MenuButton from "@/components/Menu/Menu";
import { LogoutButton } from "@/components/button/LogoutButton";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MobileBottomBar } from "@/components/BottomBar"
import { navigation } from "@/lib/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar className="list-none hidden md:flex"/>
      <MobileBottomBar/>
        <SidebarTrigger className="hidden md:flex"/>
        <nav className="md:hidden [&_svg]:size-8 corner-left">
          {navigation.header.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
              >
                <Icon className="bg-(--accent) rounded-full"/>
              </Link>
            );
          })}
        <button/>
        </nav>
        <MenuButton
          trigger={
          <button
            className="[&_svg]:size-8 pr-0 rounded-xs md:hover:bg-(--accent)"
          >
            <Menu/>
          </button>}>
          <button>
            Settings
          </button>
          <button>
            Language
          </button>
          <LogoutButton>
            Log out
          </LogoutButton>
          <Link
            href="/privacy-politics"
            target="_self"
            rel="noopener noreferrer"
            >
            Privacy
          </Link>
        </MenuButton>
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}