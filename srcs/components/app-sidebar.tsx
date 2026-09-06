"use client"
import Link from 'next/link';
import { useGameSocket } from "@/hooks/useGameSocket";
import { getNavigation } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebarLateral"
import { cn } from "@/lib/utils";

export function AppSidebar({className}: {
  className?: string;
}) {
  const pathname = usePathname();
  const { waitingRoom, matchRoom } = useGameSocket();
  const navigation = getNavigation(Boolean(waitingRoom || matchRoom));
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        {navigation.header.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.label}
                render={<Link href={item.href} />}
              >
                <Icon className="bg-(--accent) rounded-full" />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarHeader>

      <SidebarContent className="flex justify-center gap-10">
        {navigation.content.map((item) => {
          const Icon = item.icon;
          const isDisabled = Boolean(item.disabled);

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={isDisabled ? "Crea o únete a una sala antes" : item.label}
                render={isDisabled ? undefined : <Link href={item.href} />}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                className={cn(
                  pathname === item.href && !isDisabled && "text-(--accent)",
                  isDisabled
                )}
                >
                <Icon />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        {navigation.footer.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.label}
                render={<Link href={item.href} />}
                className={cn(pathname === item.href && "text-(--accent)")}
              >
                <Icon />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarFooter>

    </Sidebar>
  )
}