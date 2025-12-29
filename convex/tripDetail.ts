// convex/functions/tripDetail.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTripDetail = mutation({
  args: {
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.id("UserTable"), // Ensure uid references a valid UserTable document
  },
  handler: async (ctx, args) => {
    // Validate that the uid exists in the UserTable
    const user = await ctx.db.get(args.uid);
    if (!user) {
      throw new Error(`User with ID ${args.uid} does not exist in UserTable`);
    }

    // Insert the trip detail into the TripDetailTable
    const id = await ctx.db.insert("TripDetailTable", {
      tripId: args.tripId,
      tripDetail: args.tripDetail,
      uid: args.uid,
      createdAt: new Date().toISOString(), // Add a timestamp
    });

    return await ctx.db.get(id);
  },
});
