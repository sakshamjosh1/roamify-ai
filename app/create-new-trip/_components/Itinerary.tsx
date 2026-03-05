"use client";

import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";
import { TripInfo } from "./Chatbox";
import { MapPin, Calendar, Users, Wallet, ArrowLeft } from "lucide-react";

function Itinerary() {
  //@ts-ignore
  const { tripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (tripDetailInfo) setTripData(tripDetailInfo);
  }, [tripDetailInfo]);

  useEffect(() => {
  if (tripDetailInfo) {
    setTripData(tripDetailInfo);
    setGlow(true);
    setTimeout(() => setGlow(false), 1000); // glow for 1 second
  }
}, [tripDetailInfo]);

  const data = tripData ? [
    {
      title: "Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className='flex items-center gap-1.5 mb-3'>
            <Calendar className='h-3.5 w-3.5 text-orange-400' />
            <p className='text-xs text-gray-500'>Best time: {dayData.best_time_to_visit_day}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(dayData.activities ?? []).map((activity, index) => (
              <PlaceCardItem key={index} activity={activity} />
            ))}
          </div>
        </div>
      ),
    })),
  ] : [];

  if (!tripData) {
    return (
      <div className={`w-full h-full flex flex-col overflow-hidden transition-all duration-300 rounded-xl ${
            glow ? 'ring-2 ring-orange-400 ring-offset-0 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : ''
          }`}>
        <div className='w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center'>
          <MapPin className='h-5 w-5 text-gray-400' />
        </div>
        <p className='text-sm font-medium text-gray-700'>No itinerary yet</p>
        <p className='text-xs text-gray-400 max-w-[200px] leading-relaxed'>
          Complete the chat on the left to generate your personalised trip.
        </p>
        <div className='flex items-center gap-1.5 text-xs text-gray-400 mt-1'>
          <ArrowLeft className='h-3.5 w-3.5' />
          Start from the chat
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>

      {/* Trip summary bar */}
      <div className='px-5 py-3 border-b border-gray-100 bg-white flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-1.5 text-xs text-gray-600'>
          <MapPin className='h-3.5 w-3.5 text-orange-400' />
          <span className='font-medium'>{tripData.origin}</span>
          <span className='text-gray-400'>→</span>
          <span className='font-medium'>{tripData.destination}</span>
        </div>
        {tripData.duration && (
          <div className='flex items-center gap-1.5 text-xs text-gray-500'>
            <Calendar className='h-3.5 w-3.5 text-gray-400' />
            {tripData.duration}
          </div>
        )}
        {tripData.group_size && (
          <div className='flex items-center gap-1.5 text-xs text-gray-500'>
            <Users className='h-3.5 w-3.5 text-gray-400' />
            {tripData.group_size}
          </div>
        )}
        {tripData.budget && (
          <div className='flex items-center gap-1.5 text-xs text-gray-500'>
            <Wallet className='h-3.5 w-3.5 text-gray-400' />
            {tripData.budget}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className='flex-1 overflow-y-auto'>
        <Timeline data={data} tripData={tripData} />
      </div>

    </div>
  );
}

export default Itinerary;