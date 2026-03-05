"use client"
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { CableCar, Send, TreePalm, Hotel, HandCoins, ArrowUpRight, MapPin, Star } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";

export const suggestions = [
  { title: 'Plan my next vacation', icon: <TreePalm className='text-green-500 h-4 w-4' /> },
  { title: 'Find the best hotels', icon: <Hotel className='text-blue-500 h-4 w-4' /> },
  { title: 'Budget friendly trip', icon: <HandCoins className='text-orange-500 h-4 w-4' /> },
  { title: 'Weekend getaway', icon: <CableCar className='text-red-400 h-4 w-4' /> },
];

// Dummy avatars for social proof — replace srcs with real ones if you have them
const avatars = [
  { imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", profileUrl: "#" },
  { imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", profileUrl: "#" },
  { imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia", profileUrl: "#" },
  { imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", profileUrl: "#" },
];

// Floating destination badges
const floatingBadges = [
  { label: "Kyoto, Japan", emoji: "🏯", position: "top-10 left-6 md:left-16" },
  { label: "Amalfi, Italy", emoji: "🌊", position: "top-24 right-6 md:right-16" },
  { label: "Rajasthan, India", emoji: "🏰", position: "bottom-10 left-6 md:left-24" },
  { label: "Patagonia", emoji: "🏔️", position: "bottom-24 right-6 md:right-20" },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();
  const [input, setInput] = useState('');

  const onSend = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    router.push('/create-new-trip');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className='relative flex flex-col items-center justify-center px-6 pt-16 pb-20 overflow-hidden'>

      {/* ── Background texture / gradient ── */}
      <div className='absolute inset-0 -z-10 bg-white'>
        {/* Soft radial glow in center */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60' />
        {/* Grid pattern */}
        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Floating destination badges ── */}
      {floatingBadges.map((badge) => (
        <div
          key={badge.label}
          className={`absolute ${badge.position} hidden lg:flex items-center gap-2 bg-white border border-gray-100 shadow-md px-3 py-2 rounded-full text-xs text-gray-600 font-medium z-10`}
        >
          <span>{badge.emoji}</span>
          {badge.label}
          <MapPin className='h-3 w-3 text-orange-400' />
        </div>
      ))}

      <div className='max-w-3xl w-full space-y-8 relative z-10'>

        {/* ── Badge ── */}
        <div className='flex justify-center'>
          <div className={cn(
            "group rounded-full border border-black/5 bg-neutral-100 text-sm transition-all ease-in hover:bg-neutral-200",
          )}>
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 gap-2">
              <Star className='h-3.5 w-3.5 fill-orange-400 text-orange-400' />
              Trusted by 10,000+ travellers
            </AnimatedShinyText>
          </div>
        </div>

        {/* ── Headline ── */}
        <div className='text-center space-y-2'>
          <h1 className='text-6xl md:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight'>
            Your perfect trip,
          </h1>
          <SparklesText className='text-6xl md:text-7xl font-bold tracking-tight'>
            planned by AI
          </SparklesText>
          <p className='text-lg text-gray-500 pt-3 font-normal max-w-lg mx-auto leading-relaxed'>
            Describe your dream trip — get a full itinerary, curated hotels, and a live map in seconds.
          </p>
        </div>

        {/* ── Social proof ── */}
        <div className='flex items-center justify-center gap-3'>
          <AvatarCircles numPeople={2400} avatarUrls={avatars} />
          <div className='text-left'>
            <div className='flex items-center gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className='h-3.5 w-3.5 fill-orange-400 text-orange-400' />
              ))}
            </div>
            <p className='text-xs text-gray-500 mt-0.5'>Loved by travellers worldwide</p>
          </div>
        </div>

        {/* ── Input Box with BorderBeam ── */}
        <div className='relative'>
          <div className='relative border border-gray-200 bg-white shadow-lg overflow-hidden rounded-xl'>
            <BorderBeam size={200} duration={8} colorFrom="#f97316" colorTo="#fb923c" />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='e.g. Plan a 5-day trip to Bali for 2 people, mid-range budget…'
              className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none px-5 pt-5 pb-10 text-base text-gray-800 placeholder:text-gray-400'
            />
            <button
              onClick={onSend}
              disabled={!input.trim()}
              className='absolute bottom-4 right-4 flex items-center gap-2 bg-gray-900 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200'
            >
              <Send className='h-3.5 w-3.5' />
              Plan it
            </button>
            <p className='absolute bottom-5 left-5 text-xs text-gray-400'>
              Press <kbd className='bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[10px]'>Enter</kbd> to generate
            </p>
          </div>
        </div>

        {/* ── Suggestion Chips ── */}
        <div className='flex flex-wrap gap-2 justify-center'>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s.title)}
              className='flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-150 rounded-full shadow-sm'
            >
              {s.icon}
              {s.title}
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className='grid grid-cols-3 gap-4'>
          {[
            { num: '10k+', label: 'Trips planned', emoji: '✈️' },
            { num: '120+', label: 'Destinations', emoji: '🗺️' },
            { num: '<10s', label: 'To your itinerary', emoji: '⚡' },
          ].map(({ num, label, emoji }) => (
            <div key={label} className='text-center py-4 px-3 bg-gray-50 rounded-xl border border-gray-100'>
              <div className='text-xl mb-1'>{emoji}</div>
              <div className='text-2xl font-bold text-gray-900'>{num}</div>
              <div className='text-xs text-gray-400 tracking-wide uppercase mt-1'>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Hero;