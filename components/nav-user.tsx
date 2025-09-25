"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  OrganizationList,
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  SignOutButton,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import router from "next/router";
import { Button } from "./ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function NavUser() {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const { openUserProfile, signOut, openOrganizationProfile } = useClerk();
  const { theme } = useTheme();
  const { user: clerkUser } = useUser();

  const appearance = {
    baseTheme: theme === "dark" ? dark : undefined,
  };
  const onLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <div className="flex flex-row items-center gap-2">
            <UserButton appearance={appearance}></UserButton>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {clerkUser?.fullName}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {clerkUser?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>

          {/* <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={clerkUser?.imageUrl || ""}
                  alt={clerkUser?.fullName || ""}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {clerkUser?.fullName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={8}
            style={{
              width: "calc(var(--sidebar-width)-2rem)",
            }}
          >
            <DropdownMenuItem onClick={() => openUserProfile({ appearance })}>
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={clerkUser?.imageUrl || ""}
                  alt={clerkUser?.fullName || ""}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {clerkUser?.fullName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onLogout()}
              className="cursor-pointer"
            >
              <SignOutButton></SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
