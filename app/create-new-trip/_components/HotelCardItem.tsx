"use client"
import React, { useEffect } from 'react'
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

  useEffect(()=>{
      hotel&&GetGooglePlaceDetail();
  },[hotel])

  const GetGooglePlaceDetail=async()=>{
    const result = await axios.post('/api/google-place-detail',{
      placeName:hotel?.hotel_name
    });
    console.log(result?.data);
  }

  return (
    <div className='flex flex-col gap-1 '>
                        <Image src={'/logo.png'} alt='place-image' width={400} height={200} 
                        className='rounded-xl shadow object-cover mb-2'/>
                        <h2 className='font-semibold text-lg'>{hotel?.hotel_name}</h2>
                        <h2 className='text-gray-500'>{hotel?.hotel_address}</h2>
                        <div className='flex justify-between items-center'>
                            <p className='flex gap-2 text-green-800'><Wallet/>{hotel.price_per_night}</p>
                            <p className='text-yellow-500 flex gap-2'><Star/>{hotel.rating}</p>
                        </div>
                        <p className='line-clamp-2 text-gray-500'>{hotel?.description}</p>
                        <Link href={'https://www.google.com/maps/search/?api=1&query='+hotel?.hotel_name} target='_blank'>
                            <Button variant="outline" className='mt-1 w-full hover:cursor-pointer'>View</Button>
                        </Link>
                        
    </div>
  )
}

export default HotelCardItem
