"use client"
import Link from 'next/link';
import { navigation } from "@/lib/navigation";
import { Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebarLateral"
export function AppSidebar({className}: {
  className?: string;
}) {

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