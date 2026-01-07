"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NavUser() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="text-sm text-muted-foreground">
            {t("loading", "Loading")}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!session?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">{t("login", "Login")}</Link>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{session.user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {session.user.email}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            {t("logout", "Logout")}
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
