import React from "react";
import { CheckCircle, Loader2, MapPin } from "lucide-react";
import { useTripDetail } from "@/app/provider";

interface FinalItineraryUIProps {
  planningText: string;
  isTripReady: boolean;
  tripStatus: "idle" | "created" | "updated";
  changeSummary: string | null;
}

function FinalItineraryUI({
  planningText,
  isTripReady,
  tripStatus,
  changeSummary,
}: FinalItineraryUIProps) {
  const { setViewMode } = useTripDetail();

  const handleViewTripClick = () => {
    if (!isTripReady) return;
    setViewMode("itinerary");
  };

  return (
    <div className='mt-2'>

      {/* Planning text bubble */}
      <div className='text-sm text-gray-700 bg-gray-100 px-4 py-3 rounded-xl rounded-tl-sm leading-relaxed mb-3 whitespace-pre-wrap'>
        {planningText}
      </div>

      {/* Status card */}
      <div className='bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center'>

        {isTripReady ? (
          <>
            {/* Ready state */}
            <div className='w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
            </div>
            <p className='text-sm font-semibold text-gray-900 mb-1'>Trip Ready!</p>
            <p className='text-xs text-gray-400 mb-4'>
              {changeSummary ?? "Your personalised itinerary is ready to explore."}
            </p>
            <button
              onClick={handleViewTripClick}
              className='w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors duration-150'
            >
              <MapPin className='h-4 w-4' />
              View Trip Itinerary
            </button>
          </>
        ) : (
          <>
            {/* Loading state */}
            <div className='w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-3'>
              <Loader2 className='h-5 w-5 text-orange-400 animate-spin' />
            </div>
            <p className='text-sm font-semibold text-gray-900 mb-1'>Building your trip…</p>
            <p className='text-xs text-gray-400'>
              Gathering destinations, hotels & activities for you.
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default FinalItineraryUI;