"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconCaretUpFilled, IconCopyPlus } from "@tabler/icons-react";
import { Fragment, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes, UIMessagePart, UITools } from "ai";
import { transformersJS } from "@built-in-ai/transformers-js";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon, GlobeIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { useRouter } from "next/navigation";
import emitter from "@/lib/events/event-bus";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const models = [
    {
      name: "GPT 4o",
      value: "openai/gpt-4o",
    },
    {
      name: "Deepseek Chat",
      value: "deepseek/deepseek-chat",
    },
    {
      name: "Deepseek R1",
      value: "deepseek/deepseek-r1",
    },
  ];

  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    const res = await fetch("/api/threads", {
      method: "POST",
    });
    const thread = await res.json();
    console.log(thread);
    emitter.emit("threads:created", { id: thread.id });
    // 跳转
    await router.push(`/threads/${thread.id}`);

    // sendMessage(
    //   {
    //     text: message.text || "Sent with attachments",
    //     files: message.files,
    //   },
    //   {
    //     body: {
    //       model: model,
    //       webSearch: webSearch,
    //     },
    //   }
    // );
    // setInput("");
  };

  async function convertFilesToDataURLs(files: FileList) {
    return Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<{
            type: "file";
            mediaType: string;
            url: string;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                type: "file",
                mediaType: file.type,
                url: reader.result as string,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
  }

  return (
    <div className="flex h-[calc(100vh-440px)] max-h-[800px] min-h-[600px] w-full flex-1 flex-col items-center justify-center px-5">
      <div className="mx-auto mt-10 mb-6 max-w-screen-lg px-4 text-center sm:mt-16 sm:mb-8 md:mt-20 md:mb-10">
        {user && (
          <h1 className="text-[36px] font-medium md:text-[48px] animate-in fade-in-0 duration-300">
            Hello, {user?.fullName}
          </h1>
        )}
        <h2 className="mx-auto max-w-[300px] px-2 text-[14px] sm:max-w-none">
          Bring your weirdest, wildest, or most wonderful ideas to life with AI.
        </h2>
      </div>

      <PromptInput
        onSubmit={handleSubmit}
        className="mt-4 3xl:max-w-[1280px] xl:max-w-[840px] max-w-[600px]"
        globalDrop
        multiple
      >
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputButton
              variant={webSearch ? "default" : "ghost"}
              onClick={() => setWebSearch(!webSearch)}
            >
              <GlobeIcon size={16} />
            </PromptInputButton>
            <PromptInputModelSelect
              onValueChange={(value) => {
                setModel(value);
              }}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((model) => (
                  <PromptInputModelSelectItem
                    key={model.value}
                    value={model.value}
                  >
                    {model.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!input && !status} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
