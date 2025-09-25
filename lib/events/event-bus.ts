import mitt, { Emitter } from "mitt";

// 定义事件类型（可选：强类型）
type Events = {
  "threads:updated": { id: string; name: string };
  "threads:created": { id: string };
};

declare global {
  // 为 HMR 缓存
  // eslint-disable-next-line no-var
  var __EVENT_BUS__: Emitter<Events> | undefined;
}

const emitter: Emitter<Events> =
  globalThis.__EVENT_BUS__ ?? (globalThis.__EVENT_BUS__ = mitt<Events>());

export default emitter;
export type { Events };
