"use client";
import { GlobeIcon, MicIcon } from "lucide-react";
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
  PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputProps,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useModelsStore, useThreadStore } from "@/store";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "next-themes";
import { ChatStatus } from "ai";
import { cn } from "@/lib/utils";

export const ChatInput = ({
  onSubmit,
  status,
  className,
}: {
  onSubmit: (e: PromptInputMessage, model?: string) => void;
  status: ChatStatus;
  className?: string;
} & PromptInputProps) => {
  const [input, setInput] = useState("");
  const { theme } = useTheme();
  const { user } = useUser();

  //const [models, setModels] = useState<{ name: string; value: string }[]>([]);
  const [model, setModel] = useState<string | undefined>(undefined);
  const { models, isLoading } = useModelsStore();
  const [webSearch, setWebSearch] = useState(false);
  const [agentId, setAgentId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

  useEffect(() => {
    if (!model && models.length > 0) {
      setModel(models[0].id);
    }
  }, [models]);
  return (
    <PromptInput
      onSubmit={(e) => onSubmit(e, model)}
      className={cn("flex flex-col relative", className)}
      globalDrop
      multiple
    >
      <PromptInputBody className="flex-1">
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
        <PromptInputTextarea
          rows={4}
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
            onClick={() => setUseMicrophone(!useMicrophone)}
            variant={useMicrophone ? "default" : "ghost"}
          >
            <MicIcon size={16} />
            <span className="sr-only">Microphone</span>
          </PromptInputButton>
          <PromptInputButton
            variant={webSearch ? "default" : "ghost"}
            onClick={() => setWebSearch(!webSearch)}
          >
            <GlobeIcon size={16} />
          </PromptInputButton>

          <PromptInputModelSelect
            onValueChange={(value) => {
              if (value) setModel(value);
            }}
            value={model}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {models.map((model) => (
                <PromptInputModelSelectItem key={model.id} value={model.id}>
                  {model.name}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
        </PromptInputTools>
        <PromptInputSubmit disabled={!input && !status} status={status} />
      </PromptInputToolbar>
    </PromptInput>
  );
};
