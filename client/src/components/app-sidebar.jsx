import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { getSidebarNavigationItems } from "@/constants/navigationItems"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Settings2Icon, CircleHelpIcon, SearchIcon, Sparkles, ChevronRight } from "lucide-react"

function SidebarCollapseButton() {
  const { state, toggleSidebar } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-sidebar-border/70 bg-sidebar-accent/40 text-sidebar-foreground transition-all duration-300 ease-in-out hover:bg-sidebar-accent"
    >
      <ChevronRight className={`h-4 w-4 transition-transform duration-300 ease-in-out ${state === "expanded" ? "rotate-180" : "rotate-0"}`} />
    </button>
  )
}

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon />
      ),
    },
    {
      title: "Get Help",
      url: "/app/help",
      icon: (
        <CircleHelpIcon />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon />
      ),
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { state, toggleSidebar } = useSidebar()

  const navMain = getSidebarNavigationItems().map((item) => ({
    title: item.name,
    url: item.path || item.href,
    icon: item.icon,
  }))

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/80 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95" {...props}>
      <SidebarHeader className="gap-2 p-3 pb-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        {state === "expanded" ? (
          <div className="relative flex h-14 w-full items-center justify-center rounded-xl border border-sidebar-border/70 bg-sidebar-accent/35 p-2 shadow-sm backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <div className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="px-12 text-center">
              <p className="truncate text-sm font-semibold tracking-wide text-sidebar-foreground">CampusFlow</p>
            </div>
            <div className="absolute right-2 hidden md:flex">
              <SidebarCollapseButton />
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center py-0.5">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="group/collapsed-brand relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all duration-300 ease-in-out hover:scale-[1.02]"
            >
              <Sparkles className="h-5 w-5 transition-opacity duration-200 ease-in-out group-hover/collapsed-brand:opacity-0" />
              <ChevronRight className="pointer-events-none absolute h-4 w-4 opacity-0 transition-opacity duration-200 ease-in-out group-hover/collapsed-brand:opacity-100" />
            </button>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="px-2 pb-2 pt-1 group-data-[collapsible=icon]:px-1">
        <NavMain items={navMain} />

        <SidebarSeparator className="my-3 group-data-[collapsible=icon]:my-2" />

        <SidebarGroup className="mt-auto group-data-[collapsible=icon]:px-1">
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 bg-sidebar/70 p-3 backdrop-blur-sm group-data-[collapsible=icon]:p-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
