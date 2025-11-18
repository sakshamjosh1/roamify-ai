// convex/functions/tripDetail.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

type TripDetailDoc = {
  tripId: string;
  tripDetail: any;
  uid: string;
  createdAt: Date;
};

// remove any 'createdAt' keys recursively from objects/arrays
function removeCreatedAtKeys(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(removeCreatedAtKeys);
  if (typeof obj === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === "createdAt") continue;
      out[k] = removeCreatedAtKeys(v);
    }
    return out;
  }
  return obj;
}

// safe deep sanitize to strip Dates -> strings, functions, undefined etc.
function deepSanitize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export const createTripDetail = mutation({
  args: {
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    // 1) Remove any createdAt keys anywhere in the incoming args object
    const cleanedArgs = removeCreatedAtKeys(args);

    // 2) Pull only the expected fields (they will be clean)
    const { tripId, tripDetail, uid } = cleanedArgs as {
      tripId: string;
      tripDetail: any;
      uid: string;
    };

    // 3) Sanitize tripDetail to remove any leftover non-serializable values
    const sanitizedTripDetail = deepSanitize(tripDetail);

    // 4) Build server-only document and set authoritative createdAt here
    const doc: TripDetailDoc = {
      tripId,
      tripDetail: sanitizedTripDetail,
      uid,
      createdAt: new Date()
    };

    // 5) Insert into Convex table
    const id = await ctx.db.insert("TripDetailTable", doc);

    return { _id: id, ...doc };
  }
});
