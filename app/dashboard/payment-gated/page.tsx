import { auth } from "@/auth";
import { redirect } from "next/navigation";

function UpgradeCard() {
  return (
    <>
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-center text-2xl font-semibold lg:text-3xl">
          Upgrade to a paid plan
        </h1>
        <p>This page is available on paid plans. Choose a plan that fits your needs.</p>
      </div>
      <div className="px-8 lg:px-12 text-center text-muted-foreground">
        Billing integration is not configured yet.
      </div>
    </>
  );
}

function FeaturesCard() {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Advanced features</h1>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Page with advanced features</h2>
          <p className="text-muted-foreground">Access to advanced features.</p>
        </div>
      </div>
    </div>
  );
}

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/payment-gated");
  }

  return (
    <>
      <UpgradeCard />
      <FeaturesCard />
    </>
  );
}
