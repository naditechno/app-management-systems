"use client";

import * as React from "react";
import {
  IconCalendarStats,
  IconDashboard,
  IconDeviceDesktopCog,
  IconDevicesCog,
  IconReport,
  IconReportMoney,
  IconSettings,
  IconSettingsUp,
  IconShieldUp,
  IconUserCog,
  IconUsers,
  IconUserScan,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const NAV_DATA = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Manajemen",
      url: "#",
      icon: IconDeviceDesktopCog,
      children: [
        {
          title: "Program Kerja",
          url: "/management/program-kerja",
          icon: IconDevicesCog,
        },
        {
          title: "Inisiatif Strategis",
          url: "/management/inisiatif-strategis",
          icon: IconCalendarStats,
        },
        {
          title: "Anggaran",
          url: "/management/anggaran",
          icon: IconReportMoney,
        },
        {
          title: "Manajemen Resiko",
          url: "/management/resiko",
          icon: IconShieldUp,
        },
        {
          title: "Manajemen Isu",
          url: "/management/isu",
          icon: IconSettingsUp,
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      title: "Manajemen User",
      url: "#",
      icon: IconUserCog,
      children: [
        {
          title: "Manajemen User",
          url: "/users-management",
          icon: IconUsers,
        },
        {
          title: "Manajemen Role",
          url: "/users-management/roles-permissions",
          icon: IconUserScan,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/setting",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const userData = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "No Email",
    avatar: session?.user?.image || "/icon-marketing.png",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src="/icon-marketing.png"
                  alt="Marketing Systems"
                  width={32}
                  height={32}
                />
                <span className="text-base font-semibold">
                  Management Systems
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_DATA.navMain} />
        <NavSecondary items={NAV_DATA.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
