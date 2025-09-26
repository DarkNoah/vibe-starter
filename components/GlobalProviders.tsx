"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useModelsStore, ModelItem } from "@/store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function GlobalProviders() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const setModels = useModelsStore((s) => s.setModels);
  const setLoading = useModelsStore((s) => s.setLoading);
  const setError = useModelsStore((s) => s.setError);
  const models = useQuery(api.providers.getAvailableModels, {});

  useEffect(() => {
    async function fetchModels() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setModels([]);
        setLoading(false);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        // 如果后端需要鉴权，可带上 Clerk token
        //const token = await getToken({ template: undefined }).catch(() => null);
        setModels(models?.map((x) => ({ id: x.id, name: x.name })) ?? []);
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
    return () => {};
  }, [isLoaded, isSignedIn, getToken, setModels, setLoading, setError]);

  return null;
}
