"use client";
import { FC, Fragment, use, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import {
  type PromptInputMessage,
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
import { AlertCircleIcon, CopyIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import AgentSelecter from "@/lib/mastra/components/agent-selecter";
import { useThreadStore } from "@/store";
import { ChatInput, ChatInputRef } from "@/components/chat-ui/chat-input";
import { toast } from "sonner";

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
  const createThread = useThreadStore((s) => s.createThread);
  const chatInputRef = useRef<ChatInputRef>(null);
  //const [models, setModels] = useState<{ name: string; value: string }[]>([]);
  // const [model, setModel] = useState<string | undefined>(undefined);
  const [webSearch, setWebSearch] = useState(false);
  const [agentId, setAgentId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
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

  const handleSubmit = async (message: PromptInputMessage, model?: string) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }
    if (!model) {
      toast.error("Please select a model");
      return;
    }

    // Convex uploads removed; keep attachment URLs as-is (data/blob URLs).

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
          threadId: id,
          agentId: agentId,
        },
      }
    );
    setInput("");
    chatInputRef.current?.attachmentsClear();
  };

  const handleAbort = () => {
    console.log("handleAbort");
    stop();
  };

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      const res = await fetch(`/api/threads/${id}/messages`);
      const thread = await res.json();
      console.log(thread);
      setMessages(thread.messages);
      setLoading(false);
      if (createThread && createThread.threadId == id) {
        handleSubmit(createThread.message, createThread.model);
      }
    };

    fetchThread();
  }, []);

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
                        {part.state}
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
      </Conversation>
      <div className="w-full flex justify-items-start mb-2">
        <AgentSelecter
          value={agentId}
          onChange={setAgentId}
          autoSelectFirst
        ></AgentSelecter>
      </div>
      <ChatInput
        ref={chatInputRef}
        onSubmit={(e, model) => handleSubmit(e, model)}
        onAbort={handleAbort}
        status={status}
        className="flex flex-col relative"
        globalDrop
        multiple
        input={input}
        setInput={setInput}
      />
    </div>
  );
};

export default ThreadPage;
