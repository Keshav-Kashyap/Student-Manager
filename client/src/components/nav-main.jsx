import { useLocation, NavLink } from "react-router-dom"
import {
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  label = "Navigation",
}) {
  const { pathname } = useLocation()

  const isActivePath = (targetPath) => {
    if (!targetPath) return false
    return pathname === targetPath || pathname.startsWith(`${targetPath}/`)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-1 text-[13px] font-semibold tracking-wide">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActivePath(item.url)}
                className="h-10 border border-transparent px-3 text-[15px] [&_svg]:size-5 data-[active=true]:border-sidebar-border/70 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary data-[active=true]:shadow-sm"
              >
                <NavLink to={item.url} className="flex w-full items-center gap-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                  <item.icon />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
