"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      if (!response.ok) {
        throw new Error("Billing portal session failed");
      }
      const { url } = (await response.json()) as { url?: string };
      if (url) {
        window.location.assign(url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} disabled={loading}>
      {loading ? "Opening..." : "Manage billing"}
    </Button>
  );
}
