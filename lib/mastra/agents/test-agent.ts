import { createDeepSeek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { storage } from "../storage";
import { Memory } from "@mastra/memory";
import { londonWeatherTool } from "../tools/london-weather-tool";
const deepseek = createDeepSeek();

const memory = new Memory({
  storage: storage,
  options: {
    semanticRecall: false,
    workingMemory: {
      enabled: false,
    },
    threads: {
      generateTitle: true,
    },
    lastMessages: 5,
  },
});
export const testAgent = new Agent({
  name: "test-agent",
  instructions: "You are a helpful assistant.",
  model: deepseek("deepseek-reasoner"),
  tools: { londonWeatherTool },
  memory: memory,
});
