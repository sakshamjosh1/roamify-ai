"use client"
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CableCar, MountainSnow, Plane, Globe2,Send, ArrowDown, TreePalm, Hotel, HandCoins } from "lucide-react";
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { SparklesText } from "@/components/magicui/sparkles-text";


const suggestions=[
    {
        title:'Plan my next vacation',
        icon:<TreePalm className='text-green-400 h-5 2-5'/>
    },
    {
        title:'Find the best hotels for my trip',
        icon:<Hotel className='text-blue-400 h-5 2-5'/>
    },
    {
        title:'Plan a budget friendly trip',
        icon:<HandCoins className='text-orange-400 h-5 2-5'/>
    },
    {
        title:'Suggest a weekend gateway',
        icon:<CableCar className='text-red-400 h-5 2-5'/>
    },
]



function Hero() {

    const { user } = useUser();
    const router=useRouter();
    const onSend=()=>{
        if(!user)
        {
            router.push('/sign-in');
            return ;
        }
        //Navigate to Create Trip Planner Web Page
    }

  return (
    <div className='mt-24 flex items-center justify-center'>
        {/* Content */}
        
        <div className='max-w-3xl w-full text-center space-y-6'>
            <div className='flex justify-center'>
                <div className='w-fit group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"'>
                    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">✨ AI powered Trip Planning</AnimatedShinyText>
                </div>
            </div>
            <h1 className='text-xl md:text-4xl'>Your Perfect Trip, <SparklesText className='text-primary text-5xl font-extrabold'>Planned by AI</SparklesText></h1>
            <p className='text-1xl'>Your personal travel genie - one wish, and your entire trip appears.</p>
            
            
        

        {/* Input Box */}
        <div>
            <div className='border rounded-2xl p-4 shadow-2xs relative'>
                
                <Textarea placeholder="Create a trip from Paris to New York" className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none" />
                              
                <Button size="icon" className="absolute bottom-6 right-6 hover:cursor-pointer" onClick={onSend}>
                  <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Suggestion List */}
        <div className='flex gap-5'>
            {suggestions.map((suggestions,index)=>(
                <div key={index} className='flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white font-bold'>
                    {suggestions.icon}
                    <h2 className='text-xs'>{suggestions.title}</h2>
                </div>
            ))}
        </div>

        <div className='flex items-center justify-center flex-col'>
            <h2 className='my-7 mt-14 flex gap-2 text-center hover:cursor-pointer'>Not sure what’s next?  <strong>I’ll walk you through it.</strong> <ArrowDown/> </h2>

        {/* Video Section */}
            <HeroVideoDialog
                className="block dark:hidden"
                animationStyle="from-center"
                videoSrc="https://www.example.com/dummy-video"
                thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
                thumbnailAlt="Dummy Video Thumbnail"
            />
        </div>
        
        </div>
    </div>
  )
}

export default Hero
