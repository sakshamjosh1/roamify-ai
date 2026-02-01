"use client";
import { Id } from "@/convex/_generated/dataModel";
import React, { useEffect, useState } from "react";
import Header from "../_components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "../provider";
import { TripInfo } from "../create-new-trip/_components/Chatbox";
import MyTripCardItem from "./_components/MyTripCardItem";

type Trip = {
  tripId: string;
  tripDetail: TripInfo;
  _id: string;
};

function MyTrips() {
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const { userDetail } = useUserDetail();
  const convex = useConvex();

  useEffect(() => {
    if (userDetail?._id) {
      getUserTrips();
    }
  }, [userDetail]);

  const getUserTrips = async () => {
  if (!userDetail?._id) return;

  const result = await convex.query(api.tripDetail.GetUserTrips, {
    uid: userDetail._id as Id<"UserTable">,
  });

  setMyTrips(result);
};


  return (
    <>
      <Header />
      <div className="px-10 py-10 md:px-24 lg:px-48">
        <h2 className="font-bold text-3xl my-5 text-center">My Trips</h2>

        {myTrips.length === 0 && (
          <div className="p-7 border rounded-2xl flex flex-col items-center justify-center gap-5 mt-6">
            <h2>You don't have any trip plan created</h2>
            <Link href="/create-new-trip">
              <Button>Create New Trip</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {myTrips.map((trip) => (
            <MyTripCardItem trip={trip} key={trip._id} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MyTrips;
