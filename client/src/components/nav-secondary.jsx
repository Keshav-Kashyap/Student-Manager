"use client"

import * as React from "react"
import { NavLink } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}) {
  const isInternalRoute = (url) => typeof url === "string" && url.startsWith("/")

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="h-10 px-3 text-[15px] [&_svg]:size-5">
                {isInternalRoute(item.url) ? (
                  <NavLink to={item.url} className="flex w-full items-center gap-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                    {item.icon}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </NavLink>
                ) : (
                  <a href={item.url} className="flex w-full items-center gap-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                    {item.icon}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </a>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
