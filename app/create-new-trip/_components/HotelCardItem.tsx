"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Hotel } from './Chatbox'
import Link from 'next/link'
import { Star, Wallet, MapPin, ExternalLink } from 'lucide-react'
import axios from 'axios'

type Props = { hotel: Hotel }

function HotelCardItem({ hotel }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => { hotel && GetGooglePlaceDetail(); }, [hotel]);

  const GetGooglePlaceDetail = async () => {
    const result = await axios.post('/api/google-place-detail', { placeName: hotel?.hotel_name });
    if (result?.data.e) return;
    setPhotoUrl(result?.data);
  };

  return (
    <div className='flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-150'>

      {/* Image */}
      <div className='relative w-full aspect-[16/10] overflow-hidden bg-gray-100'>
        <Image
          src={photoUrl ?? '/logo.png'}
          alt={hotel?.hotel_name ?? 'Hotel'}
          fill
          className='object-cover'
        />
        {/* Rating badge */}
        <div className='absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full'>
          <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
          <span className='text-xs font-semibold text-gray-800'>{hotel.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className='p-3 flex flex-col gap-1 flex-1'>
        <h3 className='font-semibold text-sm text-gray-900 leading-tight line-clamp-1'>{hotel?.hotel_name}</h3>

        <div className='flex items-start gap-1 text-gray-400'>
          <MapPin className='h-3 w-3 mt-0.5 flex-shrink-0' />
          <p className='text-xs line-clamp-1'>{hotel?.hotel_address}</p>
        </div>

        <div className='flex items-center gap-1 text-green-600 mt-0.5'>
          <Wallet className='h-3 w-3' />
          <p className='text-xs font-medium'>{hotel.price_per_night}</p>
        </div>

        <p className='text-xs text-gray-400 line-clamp-2 leading-relaxed'>{hotel?.description}</p>

        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotel_name}`}
          target='_blank'
          className='mt-auto pt-2'
        >
          <button className='w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-orange-400 hover:text-orange-500 transition-all duration-150'>
            <ExternalLink className='h-3 w-3' />
            View on Maps
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HotelCardItem;