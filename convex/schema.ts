import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { paymentAttemptSchemaValidator } from "./paymentAttemptTypes";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
    emailAddress: v.optional(v.string()),
  }).index("byExternalId", ["externalId"]),

  paymentAttempts: defineTable(paymentAttemptSchemaValidator)
    .index("byPaymentId", ["payment_id"])
    .index("byUserId", ["userId"])
    .index("byPayerUserId", ["payer.user_id"]),

  // Providers configuration for LLM vendors
  providers: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    providerType: v.string(), // e.g. "openai", "deepseek", "google"
    apiKey: v.string(),
    baseUrl: v.optional(v.string()),
    models: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        isActive: v.boolean(),
      })
    ),
    isActive: v.optional(v.boolean()),
    metadata: v.optional(v.any()),
    settings: v.optional(
      v.object({
        timeoutMs: v.optional(v.number()),
        headers: v.optional(v.record(v.string(), v.string())),
      })
    ),
  })
    .index("byName", ["name"]) // filter by vendor type
    .index("byActive", ["isActive"]), // quick active selection
});
