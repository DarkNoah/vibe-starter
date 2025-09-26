"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Agent = {
  id: string;
  name: string;
};

export type AgentSelecterProps = {
  className?: string;
  value?: string;
  onChange?: (agentId: string | undefined) => void;
  placeholder?: string;
  autoSelectFirst?: boolean;
  disabled?: boolean;
  size?: "sm" | "default";
};

export default function AgentSelecter({
  className,
  value,
  onChange,
  placeholder = "选择 Agent",
  autoSelectFirst = true,
  disabled,
  size = "default",
}: AgentSelecterProps) {
  const [agents, setAgents] = useState<Array<Agent>>([]);
  const [internalValue, setInternalValue] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const isControlled = typeof value !== "undefined";

  const selectedValue = isControlled ? value : internalValue;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/agents", {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("加载 agents 失败");
        const data = (await res.json()) as Array<Agent>;
        if (!isMounted) return;
        setAgents(data);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        // 静默失败，保留空列表
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadAgents();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [autoSelectFirst, isControlled]);

  useEffect(() => {
    if (autoSelectFirst && !selectedValue && agents.length > 0) {
      const firstId = agents[0]?.id;
      if (firstId) {
        if (!isControlled) {
          setInternalValue(firstId);
        }
        onChange?.(firstId);
      }
    }
  }, [agents, autoSelectFirst, isControlled, onChange, selectedValue]);

  const handleValueChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const currentLabel = useMemo(() => {
    const found = agents.find((a) => a.id === selectedValue);
    return found?.name ?? undefined;
  }, [agents, selectedValue]);

  return (
    <Select
      value={selectedValue}
      onValueChange={handleValueChange}
      disabled={disabled || isLoading || agents.length === 0}
    >
      <SelectTrigger className={cn("min-w-[180px]", className)} size={size}>
        <SelectValue placeholder={isLoading ? "加载中..." : placeholder}>
          {currentLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { AgentSelecter };
