export async function register() {
  // 仅在 Node.js runtime 生效（Edge 不支持 undici 代理）
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { setGlobalDispatcher, ProxyAgent } = await import("undici");

    // 从环境变量读取代理地址（示例：HTTP_PROXY=https://user:pass@host:port）
    const proxyUrl =
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy ||
      process.env.https_proxy;

    if (proxyUrl) {
      const agent = new ProxyAgent(proxyUrl);
      setGlobalDispatcher(agent);
    }
  }
}
