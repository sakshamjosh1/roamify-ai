"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Hotel } from './Chatbox'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, Wallet } from 'lucide-react'
import axios from 'axios'

type Props={
    hotel:Hotel
}

function HotelCardItem({hotel}:Props) {
  const [photoUrl,setPhotoUrl]=useState<string>();
  useEffect(()=>{
      hotel&&GetGooglePlaceDetail();
  },[hotel])

  const GetGooglePlaceDetail=async()=>{
    const result = await axios.post('/api/google-place-detail',{
      placeName:hotel?.hotel_name
    });
    if(result?.data.e){
      return;
    }
    setPhotoUrl(result?.data);
  }

  return (
    <div className='flex h-full flex-col gap-1 '>
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={photoUrl ? photoUrl : "/logo.png"}
              alt={hotel?.hotel_name || "Place image"}
              fill
              className="object-cover"
            />
        </div>
                        <h2 className='font-semibold text-lg'>{hotel?.hotel_name}</h2>
                        <h2 className='text-gray-500'>{hotel?.hotel_address}</h2>
                        <div className='flex justify-between items-center'>
                            <p className='flex gap-2 text-green-800'><Wallet/>{hotel.price_per_night}</p>
                            <p className='text-yellow-500 flex gap-2'><Star/>{hotel.rating}</p>
                        </div>
                        <p className='line-clamp-2 text-gray-500'>{hotel?.description}</p>
                        <div className='mt-auto'>
                          <Link href={'https://www.google.com/maps/search/?api=1&query='+hotel?.hotel_name} target='_blank'>
                            <Button variant="outline" className='mt-1 w-full hover:cursor-pointer'>View</Button>
                          </Link>
                        </div>                   
    </div>
  )
}

export default HotelCardItem
