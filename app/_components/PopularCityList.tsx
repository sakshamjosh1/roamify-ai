"use client";

import React, { useRef } from "react";
import { MapPin, Clock, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const data = [
  {
    category: "France",
    city: "Paris",
    title: "City of Lights",
    duration: "5–7 days",
    budget: "₹80k–₹1.2L",
    bestTime: "Apr–Jun",
    emoji: "🗼",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
  },
  {
    category: "USA",
    city: "New York",
    title: "The City That Never Sleeps",
    duration: "6–8 days",
    budget: "₹1L–₹1.6L",
    bestTime: "Sep–Nov",
    emoji: "🗽",
    src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop",
  },
  {
    category: "Japan",
    city: "Tokyo",
    title: "Where Tradition Meets Future",
    duration: "7–10 days",
    budget: "₹90k–₹1.4L",
    bestTime: "Mar–May",
    emoji: "🌸",
    src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop",
  },
  {
    category: "Italy",
    city: "Rome",
    title: "The Eternal City",
    duration: "4–6 days",
    budget: "₹70k–₹1.1L",
    bestTime: "Apr–Jun",
    emoji: "🏛️",
    src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop",
  },
  {
    category: "UAE",
    city: "Dubai",
    title: "Luxury in the Desert",
    duration: "4–5 days",
    budget: "₹80k–₹1.5L",
    bestTime: "Nov–Mar",
    emoji: "🏙️",
    src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop",
  },
  {
    category: "India",
    city: "Rajasthan",
    title: "Land of Maharajas",
    duration: "8–10 days",
    budget: "₹30k–₹70k",
    bestTime: "Oct–Mar",
    emoji: "🏯",
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop",
  },
];

export function PopularCityList() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  const handlePlan = (city: string) => {
    if (!user) { router.push("/sign-in"); return; }
    router.push(`/create-new-trip?prompt=Plan a trip to ${city}`);
  };

  return (
    <div className="w-full pt-20 pb-10 px-6">

      {/* Header row */}
      <div className="max-w-7xl mx-auto flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Explore the world</p>
          <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
        </div>
        {/* Scroll buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-150"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-150"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 max-w-7xl mx-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {data.map((dest) => (
          <div
            key={dest.city}
            className="relative flex-shrink-0 w-64 h-[420px] rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => handlePlan(dest.city)}
          >
            {/* Background image */}
            <img
              src={dest.src}
              alt={dest.city}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/20">
                {dest.category}
              </span>
            </div>

            {/* Emoji */}
            <div className="absolute top-4 right-4 text-2xl">{dest.emoji}</div>

            {/* Bottom content — slides up on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white/70 text-xs tracking-wide mb-1">{dest.city}</p>
              <h3 className="text-white font-bold text-lg leading-tight mb-4">{dest.title}</h3>

              {/* Meta — hidden until hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Clock className="h-3 w-3" /> {dest.duration}
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Wallet className="h-3 w-3" /> {dest.budget}
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <MapPin className="h-3 w-3" /> Best time: {dest.bestTime}
                </div>
              </div>

              {/* CTA button */}
              <button className="w-full bg-white text-gray-900 text-xs font-semibold tracking-wide py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white">
                Plan this trip →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularCityList;