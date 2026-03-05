"use client";
import React, { useEffect, useState } from 'react'
import Chatbox from './_components/Chatbox'
import Header from '../_components/Header'
import Itinerary from './_components/Itinerary'
import GlobalMap from './_components/GlobalMap';
import { Globe2, Map } from 'lucide-react';
import { useTripDetail } from '../provider';

function Page() {
  const [activeIndex, setActiveIndex] = useState<0 | 1>(1); // 0 = Itinerary, 1 = Map
  const { viewMode, setViewMode } = useTripDetail();
  useEffect(() => {
  if (viewMode === 'itinerary') {
    setActiveIndex(0); // switch to itinerary tab
  }
}, [viewMode]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Chatbox panel ── */}
        <div className="w-full md:w-[420px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Plan your trip</h1>
            <p className="text-xs text-gray-400 mt-0.5">Answer a few questions and your itinerary appears.</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chatbox />
          </div>
        </div>

        {/* ── Right: Map / Itinerary panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tab switcher */}
          <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveIndex(1)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeIndex === 1
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Globe2 className="h-4 w-4" />
              Map
            </button>
            <button
              onClick={() => setActiveIndex(0)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeIndex === 0
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Map className="h-4 w-4" />
              Itinerary
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {activeIndex === 0 ? <Itinerary /> : <GlobalMap />}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Page;