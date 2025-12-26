// convex/functions/tripDetail.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Remove any client-sent `createdAt` keys recursively.
 * Convex does NOT allow Date objects, and we control createdAt server-side.
 */
function removeCreatedAtKeys(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(removeCreatedAtKeys);
  if (typeof obj === "object") {
    const out: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === "createdAt") continue;
      out[key] = removeCreatedAtKeys(value);
    }
    return out;
  }
  return obj;
}

/**
 * Deep sanitize to remove Dates, functions, undefined, etc.
 */
function deepSanitize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export const createTripDetail = mutation({
  args: {
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.id("UserTable"), // ✅ MUST be Convex document ID
  },

  handler: async (ctx, args) => {
    // 1️⃣ Remove any client-created createdAt fields
    const cleanedTripDetail = removeCreatedAtKeys(args.tripDetail);

    // 2️⃣ Deep sanitize payload
    const sanitizedTripDetail = deepSanitize(cleanedTripDetail);

    // 3️⃣ Build document strictly matching schema
    const doc = {
      tripId: args.tripId,
      tripDetail: sanitizedTripDetail,
      uid: args.uid, // ✅ Convex ID
      createdAt: new Date().toISOString(), // ✅ STRING ONLY
    };

    // 4️⃣ Insert into DB
    const id = await ctx.db.insert("TripDetailTable", doc);

    return {
      _id: id,
      ...doc,
    };
  },
});
