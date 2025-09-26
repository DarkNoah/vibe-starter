import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { testAgent } from "./agents/test-agent";
import { storage } from "./storage";

const mastra = new Mastra({
  agents: { testAgent },
  storage: storage,
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
});

declare global {
  var _mastra: Mastra | undefined;
}
if (!global._mastra) {
  global._mastra = mastra;
}

export default global._mastra ?? mastra;
