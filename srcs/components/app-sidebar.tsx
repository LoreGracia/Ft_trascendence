import { User, Menu, Home, Podium, Dices } from "lucide-react";
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Menu"
          >
            <Menu/>
            Menu
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Profile"
            render={<Link
              href={'/profile'}/>
            }
          >
            <User/>
            Profile
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent className="flex justify-center gap-10">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Lobby"
            render={<Link
              href={'/game-selection'}/>
            }
          >
            <Home/>
            Lobby
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
        <SidebarMenuButton
            tooltip="Leaderboard"
            render={<Link
              href={'/leaderboard'}/>
            }
          >
            <Podium/>
            Leaderboard
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
        <SidebarMenuButton
            tooltip="Lobby"
            render={<Link
              href={'/lobby'}/>
            }
          >
            <Dices/>
            Lobby
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarFooter>Footer</SidebarFooter>
    </Sidebar>
  )
}