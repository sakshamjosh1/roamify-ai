import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create or fetch a user using Clerk ID
 */
export const createNewUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existing) return existing;

    const id = await ctx.db.insert("UserTable", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
    });

    return await ctx.db.get(id);
  },
});

/**
 * Fetch Convex user by Clerk ID
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});
