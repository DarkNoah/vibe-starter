import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconCaretUpFilled } from "@tabler/icons-react";

export default function Page() {
  return (
    <div className="flex h-[calc(100vh-440px)] max-h-[800px] min-h-[600px] w-full flex-1 flex-col items-center justify-center px-5">
      <div className="mx-auto mt-10 mb-6 max-w-screen-lg px-4 text-center sm:mt-16 sm:mb-8 md:mt-20 md:mb-10">
        <h1 className="text-[36px] font-medium md:text-[48px]">Vibe Agent</h1>
        <h2 className="mx-auto max-w-[300px] px-2 text-[14px] sm:max-w-none">
          Bring your weirdest, wildest, or most wonderful ideas to life with AI.
        </h2>
      </div>
      <div className="3xl:max-w-[1280px] relative flex h-60 w-full max-w-[600px] flex-col items-center justify-center rounded-[20px] bg-white xl:max-w-[840px] p-4 gap-4">
        <Textarea
          placeholder="Reply to comment…"
          className="h-full outline-none"
        />
        <div className="flex flex-row justify-between w-full">
          <div></div>
          <Button size="icon" className="size-8">
            <IconCaretUpFilled />
          </Button>
        </div>
      </div>
    </div>
  );
}
