"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThreadsList } from "@/lib/mastra/components/threads-list";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [optimisticPath, setOptimisticPath] = useOptimistic(pathname);
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (url: string) => {
    startTransition(() => {
      setOptimisticPath(url);
      router.push(url);
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent
        className="flex flex-col gap-2"
        data-pending={isPending ? "" : undefined}
      >
        {/* Quick create button */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 mb-4">
            <SidebarMenuButton
              onClick={() => handleNavigation("/create")}
              tooltip="Create"
              className="h-10 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Main navigation items */}
        <SidebarMenu>
          <ThreadsList></ThreadsList>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
