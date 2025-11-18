// convex/functions/user.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Export with lowercase createNewUser so client useMutation(api.user.createNewUser) matches.
 * Accept simple string args; return inserted record including _id so client gets the id.
 */
export const createNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Find existing user by email
    const existing = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (existing?.length === 0) {
      const userData = {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        createdAt: new Date()
      };

      // Insert into table and return the inserted id + user data
      const id = await ctx.db.insert("UserTable", userData);
      return { _id: id, ...userData };
    }

    // return the existing record (Convex returns objects from query)
    return existing[0];
  }
});
