import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    search: v.optional(v.string()),
    isActive: v.optional(v.union(v.boolean(), v.null())),
  },
  returns: v.array(
    v.object({
      _id: v.id("providers"),
      _creationTime: v.number(),
      name: v.string(),
      icon: v.optional(v.string()),
      providerType: v.string(),
      apiKey: v.string(),
      baseUrl: v.optional(v.string()),
      models: v.array(
        v.object({ id: v.string(), name: v.string(), isActive: v.boolean() })
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
  ),
  handler: async (ctx, args) => {
    // Use indexes when possible
    let q;
    if (args.isActive === true) {
      q = ctx.db
        .query("providers")
        .withIndex("byActive", (q) => q.eq("isActive", true));
    } else if (args.isActive === false) {
      q = ctx.db
        .query("providers")
        .withIndex("byActive", (q) => q.eq("isActive", false));
    } else {
      q = ctx.db.query("providers");
    }

    const providers = await q.collect();

    if (!args.search || args.search.trim() === "") return providers;

    const s = args.search.toLowerCase();
    return providers.filter((p) =>
      [p.name, p.providerType, p.baseUrl ?? ""].some((f) =>
        f.toLowerCase().includes(s)
      )
    );
  },
});

export const get = query({
  args: { id: v.id("providers") },
  returns: v.union(
    v.object({
      _id: v.id("providers"),
      _creationTime: v.number(),
      name: v.string(),
      icon: v.optional(v.string()),
      providerType: v.string(),
      apiKey: v.string(),
      baseUrl: v.optional(v.string()),
      models: v.array(
        v.object({ id: v.string(), name: v.string(), isActive: v.boolean() })
      ),
      isActive: v.optional(v.boolean()),
      metadata: v.optional(v.any()),
      settings: v.optional(
        v.object({
          timeoutMs: v.optional(v.number()),
          headers: v.optional(v.record(v.string(), v.string())),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    providerType: v.string(),
    apiKey: v.string(),
    baseUrl: v.optional(v.string()),
    models: v.array(
      v.object({ id: v.string(), name: v.string(), isActive: v.boolean() })
    ),
    isActive: v.optional(v.boolean()),
    metadata: v.optional(v.any()),
    settings: v.optional(
      v.object({
        timeoutMs: v.optional(v.number()),
        headers: v.optional(v.record(v.string(), v.string())),
      })
    ),
  },
  returns: v.id("providers"),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("providers", {
      name: args.name,
      icon: args.icon,
      providerType: args.providerType,
      apiKey: args.apiKey,
      baseUrl: args.baseUrl,
      models: args.models,
      isActive: args.isActive ?? true,
      metadata: args.metadata,
      settings: args.settings,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("providers"),
    patch: v.object({
      name: v.optional(v.string()),
      icon: v.optional(v.string()),
      providerType: v.string(),
      apiKey: v.optional(v.string()),
      baseUrl: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
      metadata: v.optional(v.any()),
      settings: v.optional(
        v.object({
          timeoutMs: v.optional(v.number()),
          headers: v.optional(v.record(v.string(), v.string())),
        })
      ),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
    return null;
  },
});

export const updateModels = mutation({
  args: {
    id: v.id("providers"),
    patch: v.object({
      models: v.array(
        v.object({ id: v.string(), name: v.string(), isActive: v.boolean() })
      ),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("providers") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return null;
  },
});
