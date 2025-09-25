"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ProviderTypes, type ProviderType } from "@/types/provider";

type ProviderDoc = {
  _id: string;
  _creationTime: number;
  name: string;
  icon?: string;
  providerType: string;
  apiKey: string;
  baseUrl?: string;
  models?: { id: string; name: string; isActive: boolean };
  isActive?: boolean;
  metadata?: any;
  settings?: { timeoutMs?: number; headers?: Record<string, string> };
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<null | boolean>(null);

  const providers = useQuery((api as any).providers.list, {
    search: search || undefined,
    isActive: filterActive,
  }) as ProviderDoc[] | undefined;

  const create = useMutation((api as any).providers.create);
  const update = useMutation((api as any).providers.update);
  const remove = useMutation((api as any).providers.remove);

  // Create/Edit form handled via the edit sheet component

  type Model = { id: string; name: string; isActive: boolean };
  const [modelsOpen, setModelsOpen] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsSaving, setModelsSaving] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [currentProvider, setCurrentProvider] = useState<ProviderDoc | null>(
    null
  );

  // Edit provider state
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editProvider, setEditProvider] = useState<ProviderDoc | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    icon: "",
    providerType: "openai" as ProviderType,
    apiKey: "",
    baseUrl: "",
    isActive: true,
    timeoutMs: "",
    headers: "",
  });

  const canCreateSubmit = useMemo(() => {
    return editForm.name.trim() !== "" && editForm.apiKey.trim() !== "";
  }, [editForm.name, editForm.apiKey]);

  function openEdit(p: ProviderDoc) {
    setEditProvider(p);
    setEditForm({
      name: p.name ?? "",
      icon: p.icon ?? "",
      providerType: (p.providerType as ProviderType) ?? "openai",
      apiKey: p.apiKey ?? "",
      baseUrl: p.baseUrl ?? "",
      isActive: p.isActive ?? true,
      timeoutMs:
        typeof p.settings?.timeoutMs === "number"
          ? String(p.settings?.timeoutMs)
          : "",
      headers: p.settings?.headers ? JSON.stringify(p.settings.headers) : "",
    });
    setEditOpen(true);
  }

  function openCreate() {
    setEditProvider(null);
    setEditForm({
      name: "",
      icon: "",
      providerType: "openai",
      apiKey: "",
      baseUrl: "",
      isActive: true,
      timeoutMs: "",
      headers: "",
    });
    setEditOpen(true);
  }

  async function saveEdit() {
    setEditSaving(true);
    const headersRec = parseJsonRecord(editForm.headers);
    try {
      if (editProvider) {
        const patch: any = {
          name: editForm.name,
          icon: emptyToUndefined(editForm.icon),
          providerType: editForm.providerType,
          apiKey: editForm.apiKey,
          baseUrl: emptyToUndefined(editForm.baseUrl),
          isActive: editForm.isActive,
          settings: {
            timeoutMs: editForm.timeoutMs
              ? Number(editForm.timeoutMs)
              : undefined,
            headers: headersRec ?? undefined,
          },
        };
        await update({ id: editProvider._id, patch });
        await fetch(`/api/admin/providers/${editProvider._id}`, {
          method: "GET",
        });
      } else {
        await create({
          name: editForm.name,
          icon: emptyToUndefined(editForm.icon),
          providerType: editForm.providerType,
          apiKey: editForm.apiKey,
          baseUrl: emptyToUndefined(editForm.baseUrl),
          models: [],
          isActive: editForm.isActive,
          settings: {
            timeoutMs: editForm.timeoutMs
              ? Number(editForm.timeoutMs)
              : undefined,
            headers: headersRec ?? undefined,
          },
        });
      }
      setEditOpen(false);
    } finally {
      setEditSaving(false);
    }
  }

  async function openModelsManager(p: ProviderDoc) {
    setCurrentProvider(p);
    setModelsOpen(true);
    setModelsError(null);
    setModelsLoading(true);
    setModels([]);
    try {
      const res = await fetch(`/api/admin/providers/${p._id}/models`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Model[];
      setModels(data);
    } catch (e: any) {
      setModelsError(e?.message ?? "Failed to load models");
    } finally {
      setModelsLoading(false);
    }
  }

  async function refreshModels() {
    if (!currentProvider) return;
    await openModelsManager(currentProvider);
  }

  async function saveModels() {
    if (!currentProvider) return;
    setModelsSaving(true);
    setModelsError(null);
    try {
      const res = await fetch(
        `/api/admin/providers/${currentProvider._id}/models`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(models),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      await fetch(`/api/admin/providers/${currentProvider._id}`, {
        method: "GET",
      });
      setModelsOpen(false);
    } catch (e: any) {
      setModelsError(e?.message ?? "Failed to save models");
    } finally {
      setModelsSaving(false);
    }
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Providers</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Select
              value={
                filterActive === null
                  ? "all"
                  : filterActive
                    ? "active"
                    : "inactive"
              }
              onValueChange={(v) =>
                setFilterActive(
                  v === "all" ? null : v === "active" ? true : false
                )
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreate}>Create</Button>
          </div>
        </div>

        <div className="space-y-2">
          {providers?.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No providers yet.
            </div>
          )}
          <div className="grid gap-3">
            {providers?.map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-4 flex items-center gap-3"
              >
                {p.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.icon} alt="icon" className="w-6 h-6 rounded" />
                ) : (
                  <div className="w-6 h-6 rounded bg-muted" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.providerType} {p.baseUrl ? `· ${p.baseUrl}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Active</span>
                  </div>
                  <Switch
                    checked={Boolean(p.isActive)}
                    onCheckedChange={async (v) => {
                      await update({ id: p._id, patch: { isActive: v } });
                    }}
                  />
                  <Button variant="secondary" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => openModelsManager(p)}
                  >
                    Models
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await remove({ id: p._id });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Sheet open={modelsOpen} onOpenChange={setModelsOpen}>
        <SheetContent side="right" className="min-w-lg">
          <SheetHeader>
            <SheetTitle>
              Manage models{currentProvider ? ` · ${currentProvider.name}` : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-3 overflow-y-auto">
            {modelsError && (
              <div className="text-sm text-red-500">{modelsError}</div>
            )}
            {modelsLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : models.length === 0 ? (
              <div className="text-sm text-muted-foreground">No models.</div>
            ) : (
              <div className="space-y-2">
                {models.map((m, idx) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 border rounded-md p-2"
                  >
                    <div className="flex-1 grid w-full max-w-sm items-center gap-3">
                      <Label>{m.id}</Label>
                      <Input
                        value={m.name}
                        onChange={(e) => {
                          const v = e.target.value;
                          setModels((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], name: v };
                            return next;
                          });
                        }}
                        className="flex-1"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!m.isActive}
                        onCheckedChange={(v) => {
                          setModels((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], isActive: v };
                            return next;
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <SheetFooter>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={refreshModels}
                disabled={modelsLoading}
              >
                Refresh
              </Button>
              <Button
                onClick={saveModels}
                disabled={modelsSaving || modelsLoading}
              >
                {modelsSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {editProvider
                ? `Edit provider · ${editProvider.name}`
                : "Create provider"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-4 overflow-y-auto">
            <Input
              placeholder="Name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((s) => ({ ...s, name: e.target.value }))
              }
            />
            <Input
              placeholder="Icon URL (optional)"
              value={editForm.icon}
              onChange={(e) =>
                setEditForm((s) => ({ ...s, icon: e.target.value }))
              }
            />
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Type</span>
              <Select
                value={editForm.providerType}
                onValueChange={(v) =>
                  setEditForm((s) => ({
                    ...s,
                    providerType: v as ProviderType,
                  }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ProviderTypes).map((type) => (
                    <SelectItem value={type[0]}>{type[1]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 ml-auto">
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(v) =>
                    setEditForm((s) => ({ ...s, isActive: v }))
                  }
                />
              </div>
            </div>
            <Label>API Key</Label>
            <Textarea
              placeholder="API Key"
              value={editForm.apiKey}
              onChange={(e) =>
                setEditForm((s) => ({ ...s, apiKey: e.target.value }))
              }
            />
            <Input
              placeholder="Base URL (optional)"
              value={editForm.baseUrl}
              onChange={(e) =>
                setEditForm((s) => ({ ...s, baseUrl: e.target.value }))
              }
            />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Advanced (optional)
              </div>
              <Input
                placeholder="Timeout ms"
                value={editForm.timeoutMs}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, timeoutMs: e.target.value }))
                }
              />
              <Textarea
                placeholder="Headers JSON (key/value)"
                value={editForm.headers}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, headers: e.target.value }))
                }
              />
            </div>
          </div>
          <SheetFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveEdit}
                disabled={editSaving || (!editProvider && !canCreateSubmit)}
              >
                {editSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function parseJsonRecord(input: string): Record<string, string> | null {
  if (!input.trim()) return null;
  try {
    const obj = JSON.parse(input);
    if (typeof obj !== "object" || obj === null) return null;
    const rec: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof k === "string" && typeof v === "string") rec[k] = v;
    }
    return rec;
  } catch {
    return null;
  }
}

function emptyToUndefined<T extends string>(v: T | ""): T | undefined {
  return (v as string).trim() === "" ? undefined : (v as T);
}
