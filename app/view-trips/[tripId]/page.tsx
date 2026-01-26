"use client";

import Header from "@/app/_components/Header";
import Itinerary from "@/app/create-new-trip/_components/Itinerary";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

function ViewTrip() {
  const params = useParams();
  const tripId = Array.isArray(params.tripId)
    ? params.tripId[0]
    : params.tripId;

  const { userDetail } = useUserDetail();
  const { setTripDetailInfo } = useTripDetail();
  const convex = useConvex();

  useEffect(() => {
  console.log("params:", params);
  console.log("tripId:", tripId);
  console.log("userDetail:", userDetail);

  if (typeof tripId === "string" && userDetail?._id) {
    getTrip(tripId);
  }
}, [userDetail, tripId]);

  const getTrip = async (id: string) => {
  const result = await convex.query(api.tripDetail.GetTripById, {
    uid: userDetail!._id,
    tripid: tripId,
  });

  setTripDetailInfo(result?.tripDetail ?? null);
};


  return (
    <>
      <Header />
      <Itinerary />
    </>
  );
}

export default ViewTrip;
