"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, ExternalLink, Ticket, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Activity } from './Chatbox'
import axios from 'axios'

type Props = { activity: Activity }

function PlaceCardItem({ activity }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => { activity && GetGooglePlaceDetail(); }, [activity]);

  const GetGooglePlaceDetail = async () => {
    const result = await axios.post('/api/google-place-detail', {
      placeName: activity?.place_name + ':' + activity?.place_address,
    });
    if (result?.data.e) return;
    setPhotoUrl(result?.data);
  };

  return (
    <div className='flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-150'>

      {/* Image */}
      <div className='relative w-full aspect-[16/10] overflow-hidden bg-gray-100'>
        <Image
          src={photoUrl ?? '/logo.png'}
          alt={activity?.place_name ?? 'Place'}
          fill
          className='object-cover'
        />
      </div>

      {/* Content */}
      <div className='p-3 flex flex-col gap-1.5 flex-1'>
        <h3 className='font-semibold text-sm text-gray-900 leading-tight line-clamp-1'>{activity?.place_name}</h3>
        <p className='text-xs text-gray-400 line-clamp-2 leading-relaxed'>{activity?.place_details}</p>

        <div className='flex items-center gap-1 text-blue-500'>
          <Ticket className='h-3 w-3 flex-shrink-0' />
          <p className='text-xs line-clamp-1'>{activity?.ticket_pricing}</p>
        </div>

        <div className='flex items-center gap-1 text-orange-400'>
          <Clock className='h-3 w-3 flex-shrink-0' />
          <p className='text-xs line-clamp-1'>{activity?.best_time_to_visit}</p>
        </div>

        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${activity?.place_name}`}
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

export default PlaceCardItem;