import React from 'react'
import Image from 'next/image'
import { Clock, ExternalLink, Ticket } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Activity } from './Chatbox'

type Props={
    activity:Activity
}

function PlaceCardItem({activity}:Props) {
  return (
    <div>
        <Image src={'/logo.png'} width={400} height={200} alt={activity?.place_name || 'Place image'} className='object-cover rounded-xl'/>
        <h2 className='font-semibold text-lg'>{activity?.place_name}</h2>
        <p className='text-gray-500 line-clamp-2'>{activity?.place_details}</p>
        <h2 className='flex gap-2 text-blue-500 line-clamp-1'><Ticket/> {activity?.ticket_pricing}</h2>
        <p className='flex text-orange-400 gap-2 line-clamp-1'><Clock/>{activity?.best_time_to_visit}</p>
        <Link href={'https://www.google.com/maps/search/?api=1&query='+activity?.place_name} target='_blank'>
            <Button size={'sm'} variant={'outline'} className='w-full mt-2 hover:cursor-pointer'><ExternalLink/>View</Button>
        </Link>
    </div>
  )
}

export default PlaceCardItem
