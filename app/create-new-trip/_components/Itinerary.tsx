"use client";

import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";
import { TripInfo } from "./Chatbox";
import Image from "next/image";
import { div } from "motion/react-client";
import { ArrowLeft } from "lucide-react";

function Itinerary() {
  // @ts-ignore
  const { tripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);

  useEffect(() => {
    if (tripDetailInfo) {
      setTripData(tripDetailInfo);
    }
  }, [tripDetailInfo]);

  const data = tripData
  ? [
      {
        title: "Recommended Hotels",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(tripData.hotels ?? []).map((hotel, index) => (
              <HotelCardItem key={index} hotel={hotel} />
            ))}
          </div>
        ),
      },
      ...(tripData.itinerary ?? []).map((dayData) => ({
        title: `Day ${dayData.day}`,
        content: (
          <div>
            <p className="mb-2">
              Best Time: {dayData.best_time_to_visit_day}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(dayData.activities ?? []).map((activity, index) => (
                <PlaceCardItem key={index} activity={activity} />
              ))}
            </div>
          </div>
        ),
      })),
    ]
  : [];

        return (
        <div className="relative w-full h-[83vh] overflow-auto">
            {tripData ? (
            <Timeline data={data} tripData={tripData} />
            ) : (
            <div>
                <Image
                    src="/travel.jpg"
                    alt="travel"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover rounded-3xl"
                />
                <h2 className="flex gap-2 text-3xl text-white left-20 items-center absolute bottom-120"><ArrowLeft/>Start now and build your customised itinerary.</h2>
            </div>
            
            )}
        </div>
        );

    }

export default Itinerary;
