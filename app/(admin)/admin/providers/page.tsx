"use client";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Providers</h1>
      <p className="text-sm text-muted-foreground">
        Provider management is disabled because Convex has been removed. Configure
        providers via environment variables instead.
      </p>
    </div>
  );
}
