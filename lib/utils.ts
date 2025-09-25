import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserResource } from "@clerk/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAdminUser(user?: UserResource): boolean {
  if (!user) return false;
  return user.publicMetadata?.role === "admin";
}
