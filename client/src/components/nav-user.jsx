import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { EllipsisVerticalIcon, CircleUserRoundIcon, InfoIcon, CircleHelpIcon, LogOutIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "@/Utils/auth"

function getInitials(name) {
  if (!name) return "U"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  let localUser = null
  try {
    const storedUser = localStorage.getItem("user")
    localUser = storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error("Failed to parse local user:", error)
  }

  const profile = {
    name: localUser?.name || localUser?.firstName || user?.name || "User",
    email: localUser?.email || user?.email || "",
    avatar: localUser?.profileImage || user?.avatar || "",
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  const handleLogout = async () => {
    await logoutUser(navigate)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="rounded-lg">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{profile.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {profile.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{profile.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {profile.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNavigate("/app/edit")}>
                <CircleUserRoundIcon />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("/app/about")}>
                <InfoIcon />
                About
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("/app/help")}>
                <CircleHelpIcon />
                Help
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
