"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ComponentProps,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { type StorageThreadType } from "@mastra/core/memory";
import { Button } from "@/components/ui/button";
import {
  IconDots,
  IconShare,
  IconTransfer,
  IconTrashX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { t } from "i18next";
import emitter from "@/lib/events/event-bus";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
export type ThreadsListProps = {
  className?: string;
};

export const ThreadsList = ({ className }: ThreadsListProps) => {
  const router = useRouter();
  const [items, setItems] = useState<StorageThreadType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const pathname = usePathname();
  const [optimisticPath, setOptimisticPath] = useOptimistic(pathname);
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (url: string) => {
    startTransition(() => {
      setOptimisticPath(url);
      router.push(url);
    });
  };

  const [threadPendingDeletion, setThreadPendingDeletion] =
    useState<StorageThreadType | null>(null);
  const params = useParams();

  useEffect(() => {
    const param = params?.id;
    if (typeof param === "string") {
      setCurrentId(param);
      return;
    }
    if (Array.isArray(param) && param.length > 0) {
      setCurrentId(param[param.length - 1] ?? null);
      return;
    }
    setCurrentId(null);
  }, [params]);

  const loadMore = async () => {
    setLoading(true);

    const res = await fetch("/api/threads/page", {
      method: "POST",
      body: JSON.stringify({
        page: page,
      }),
    });
    const data = await res.json();
    setItems(data.threads);
    setHasMore(data.hasMore);
    setLoading(false);
  };

  const onDeleteThread = async (id: string) => {
    const res = await fetch(`/api/threads/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.error) {
      return false;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (currentId === id) router.push("/threads");
    return true;
  };

  // useEffect(() => {
  //   loadMore();
  // }, []);

  useEffect(() => {
    const handleThreadCreated = (data: { id: string }) => {
      loadMore();
    };

    emitter.on("threads:created", handleThreadCreated);
    loadMore();
    return () => {
      emitter.off("threads:created", handleThreadCreated);
    };
  }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="p-2 flex flex-col gap-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 mt-4">{t("no_more")}</p>
        }
      >
        {items.map((item) => (
          <SidebarMenuItem
            key={item.id}
            className="group/item mb-1 cursor-pointer"
          >
            <SidebarMenuButton
              asChild
              isActive={optimisticPath.startsWith(`/threads/${item.id}`)}
              className="truncate w-full flex flex-row justify-between"
            >
              <div
                className="truncate w-full flex flex-row justify-between"
                onClick={() => handleNavigation(`/threads/${item.id}`)}
              >
                {item.title}
                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-6 cursor-pointer"
                      >
                        <IconDots></IconDots>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      sideOffset={8}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <IconShare /> {t("share")}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(event) => {
                          setThreadPendingDeletion(item);
                        }}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <IconTrashX /> {t("delete")}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </InfiniteScroll>
      <AlertDialog
        open={threadPendingDeletion !== null}
        onOpenChange={(open) => {
          if (!open) {
            setThreadPendingDeletion(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_chat")}</AlertDialogTitle>
            <AlertDialogDescription>
              {threadPendingDeletion?.title}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              color="red"
              onClick={async (event) => {
                event.preventDefault();
                const item = threadPendingDeletion;
                if (!item) {
                  return;
                }
                const success = await onDeleteThread(item.id);
                if (success) {
                  setThreadPendingDeletion(null);
                }
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
