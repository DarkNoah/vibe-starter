"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconCaretUpFilled, IconCopyPlus } from "@tabler/icons-react";
import { FC, Fragment, use, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes, UIMessagePart, UITools } from "ai";
import Image from "next/image";
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
  usePromptInputAttachments,
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
import { AlertCircleIcon, CopyIcon, GlobeIcon, MicIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import AgentSelecter from "@/lib/mastra/components/agent-selecter";
import { useModelsStore, useThreadStore } from "@/store";
import { ChatInput } from "@/components/chat-ui/chat-input";

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

const ThreadPage: FC<ThreadPageProps> = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const [input, setInput] = useState("");
  const { theme } = useTheme();
  const { user } = useUser();
  const createThread = useThreadStore((s) => s.createThread);

  //const [models, setModels] = useState<{ name: string; value: string }[]>([]);
  const [model, setModel] = useState<string | undefined>(undefined);
  const { models, isLoading } = useModelsStore();
  const [webSearch, setWebSearch] = useState(false);
  const [agentId, setAgentId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const getFileUrl = useMutation(api.uploads.getFileUrl);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

  const { messages, setMessages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: (data) => {
        console.log(data);
        return {
          body: {
            id: data.id,
            message: data.messages[data.messages.length - 1],
            ...data.body,
          },
        };
      },
    }),
  });

  const handleSubmit = async (message: PromptInputMessage, _model?: string) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    for (const file of message.files || []) {
      const postUrl = await generateUploadUrl();
      const response = await fetch(file.url);
      const blob = await response.blob();
      const uploadfile = new File([blob], file.filename as string, {
        type: file.mediaType || "application/octet-stream",
      });
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.mediaType },
        body: uploadfile,
      });
      const data = await result.json();
      const storageId = data.storageId as string;

      const fileUrl = await getFileUrl({ storageId: storageId });
      file.url = fileUrl as string;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: _model || model,
          webSearch: webSearch,
          threadId: id,
          agentId: agentId,
        },
      }
    );
    setInput("");
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

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      const res = await fetch(`/api/threads/${id}/messages`);
      const thread = await res.json();
      console.log(thread);
      setMessages(thread.messages);
      setLoading(false);
      if (createThread && createThread.threadId == id) {
        if (createThread.model) setModel(createThread.model);
        handleSubmit(createThread.message, createThread.model);
      }
    };

    fetchThread();
  }, []);

  useEffect(() => {
    if (!model && models.length > 0) {
      setModel(models[0].id);
      if (createThread && createThread.threadId == id && createThread.model) {
        setModel(createThread.model);
      }
    }
  }, [models]);

  return (
    <div className="flex h-[calc(100vh-var(--header-height)-(var(--spacing)*8))] w-full flex-col items-center justify-center px-5">
      {loading && (
        <div className="flex flex-col space-y-3 p-4  w-full">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      )}
      {messages.length == 0 && !loading && (
        <div className="mx-auto mt-10 mb-6 max-w-screen-lg px-4 text-center sm:mt-16 sm:mb-8 md:mt-20 md:mb-10">
          <h1 className="text-[36px] font-medium md:text-[48px]">Vibe Agent</h1>
          <h2 className="mx-auto max-w-[300px] px-2 text-[14px] sm:max-w-none">
            Bring your weirdest, wildest, or most wonderful ideas to life with
            AI.
          </h2>
        </div>
      )}
      <Conversation className="h-full w-full relative">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" &&
                message.parts.filter((part) => part.type === "source-url")
                  .length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === "source-url"
                        ).length
                      }
                    />
                    {message.parts
                      .filter((part) => part.type === "source-url")
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}

              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <Response>{part.text}</Response>
                          </MessageContent>
                        </Message>
                        {message.role === "assistant" && (
                          <Actions className="mt-2">
                            {/* <Action
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action> */}
                            <Action
                              onClick={() =>
                                navigator.clipboard.writeText(part.text)
                              }
                              label="Copy"
                            >
                              <CopyIcon className="size-3" />
                            </Action>
                          </Actions>
                        )}
                      </Fragment>
                    );
                  case "file":
                    if (part.mediaType?.startsWith("image/")) {
                      return (
                        <div
                          key={`${message.id}-image-${i}`}
                          className={`w-full flex ${message.role == "user" ? "items-end justify-end" : ""}`}
                        >
                          <Image
                            src={part.url}
                            width={300}
                            height={300}
                            alt={`attachment-${i}`}
                          />
                        </div>
                      );
                    } else if (part.mediaType === "application/pdf") {
                      return (
                        <iframe
                          key={`${message.id}-pdf-${i}`}
                          src={part.url}
                          width={500}
                          height={600}
                          title={`pdf-${i}`}
                          className={`w-full flex ${message.role == "user" ? "items-end justify-end" : ""}`}
                        />
                      );
                    } else return null;

                  case "reasoning":
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full"
                        isStreaming={
                          status === "streaming" &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
          {status === "submitted" && <Loader />}
          {status == "error" && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <p>{error?.message}</p>
              </AlertDescription>
            </Alert>
          )}
        </ConversationContent>
        <ConversationScrollButton />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent ${theme === "dark" ? "to-black" : "to-white"} w-full h-14`}
        ></div>
      </Conversation>
      <div className="w-full flex justify-items-start mb-2">
        <AgentSelecter
          value={agentId}
          onChange={setAgentId}
          autoSelectFirst
        ></AgentSelecter>
      </div>
      <ChatInput
        onSubmit={(e) => handleSubmit(e, model)}
        status={status}
        className="flex flex-col relative"
        globalDrop
        multiple
      />
    </div>
  );
};

export default ThreadPage;
