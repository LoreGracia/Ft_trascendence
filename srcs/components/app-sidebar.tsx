"use client"
import Link from 'next/link';
import { navigation } from "@/lib/navigation";
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