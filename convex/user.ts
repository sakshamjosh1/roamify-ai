import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create or fetch user by Clerk ID
 */
export const createNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existing) return existing;

    const id = await ctx.db.insert("UserTable", {
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      clerkId: args.clerkId,
    });

    return await ctx.db.get(id);
  },
});

/**
 * Fetch Convex user using Clerk ID
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
