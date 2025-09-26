"use client";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePlans } from "@clerk/nextjs/experimental";

export default function CustomClerkPricing() {
  const { theme } = useTheme();
  const { data, isLoading, hasNextPage, fetchNext } = usePlans({
    for: "user",
    infinite: true,
    pageSize: 2,
  });
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {data && data.length > 0 && (
        <PricingTable
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              pricingTableCardTitle: {
                // title
                fontSize: 20,
                fontWeight: 400,
              },
              pricingTableCardDescription: {
                // description
                fontSize: 14,
              },
              pricingTableCardFee: {
                // price
                fontSize: 36,
                fontWeight: 800,
              },
              pricingTable: {
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              },
            },
          }}
        />
      )}
    </>
  );
}
