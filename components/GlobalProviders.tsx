"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useModelsStore, ModelItem } from "@/store";

export default function GlobalProviders() {
  const { status } = useSession();
  const isLoaded = status !== "loading";
  const isSignedIn = status === "authenticated";
  const setModels = useModelsStore((s) => s.setModels);
  const setLoading = useModelsStore((s) => s.setLoading);
  const setError = useModelsStore((s) => s.setError);

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
        setError(null);
        const res = await fetch("/api/models");
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as ModelItem[];
        setModels(data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load models");
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
    return () => {};
  }, [isLoaded, isSignedIn, setModels, setLoading, setError]);

  return null;
}
