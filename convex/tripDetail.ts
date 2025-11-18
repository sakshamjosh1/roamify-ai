// convex/functions/tripDetail.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

type TripDetailDoc = {
  tripId: string;
  tripDetail: any;
  uid: string;
  createdAt: Date;
};

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
    const { tripId, tripDetail, uid } = args;

    // sanitize incoming payload so no Date objects slip in
    const sanitizedTripDetail = deepSanitize(tripDetail);

    // explicitly declare `doc` and its type so TS/VScode knows what it is
    const doc: TripDetailDoc = {
      tripId,
      tripDetail: sanitizedTripDetail,
      uid,
      createdAt: new Date(),
    };

    const id = await ctx.db.insert("TripDetailTable", doc);

    return { _id: id, ...doc };
  }
});
