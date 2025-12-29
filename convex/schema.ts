import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    clerkId: v.string(),           // Clerk user.id
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    subscription: v.optional(v.string()),
  }),

  TripDetailTable: defineTable({
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.id("UserTable"),        // Convex UserTable._id ONLY
    createdAt: v.string(),         // ISO string
  }),
});
