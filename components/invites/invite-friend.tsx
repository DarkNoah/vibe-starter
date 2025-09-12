import { cn } from "@/lib/utils";

export type InviteFriendProps = {
  children?: React.ReactNode;
  className?: string;
};

export function InviteFriend({ children, className }: InviteFriendProps) {
  return (
    <div
      className={cn(
        " rounded-lg p-4 flex flex-col shadow m-2 cursor-pointer ",
        className
      )}
    >
      <span>Invite Friend</span>
      <small className="text-gray-400">credits</small>
    </div>
  );
}
