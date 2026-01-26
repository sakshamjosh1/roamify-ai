"use client";
import React, { useState } from 'react'
import Chatbox from './_components/Chatbox'
import Header from '../_components/Header'
import { div } from 'motion/react-client'
import Itinerary from './_components/Itinerary'
import GlobalMap from './_components/GlobalMap';
import { Globe2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function page() {
  const [activeIndex, setActiveIndex]=useState(1); 
  return (

    <div>
        <Header/>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-5 p-8 h-1'>
            <div className='col-span-2'>
                <Chatbox/>
            </div>
            <div className='col-span-3 relative'>
                {activeIndex==0 ? <Itinerary/> : <GlobalMap/>}
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={'lg'}
                    onClick={()=>setActiveIndex(activeIndex==0?1:0)}
                    className='absolute bottom-10 left-[50%]'>{activeIndex==0 ? <Plane/>:  <Globe2/>}</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Switch between Map & Trip</p>
                    </TooltipContent>
                </Tooltip>
                
            </div>
        </div>
    </div>
  )
}

export default page
