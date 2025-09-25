import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// export const uploadFile = mutation({
// args: { storageId: v.id("_storage"), author: v.string() },
// handler: async (ctx, args) => {
//     await ctx.db.insert("messages", {
//     body: args.storageId,
//     author: args.author,
//     format: "image",
//     });
// },
// });
