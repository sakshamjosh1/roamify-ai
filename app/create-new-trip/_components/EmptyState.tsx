import React from 'react'
import { suggestions } from '@/app/_components/Hero'

function EmptyState({onSelectOption}:any) {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-3xl text-center'>Start Planning new <strong className='text-primary'>Trip</strong> using AI.</h2>
      <p className='text-center text-gray-400 mt-2'>Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI. Let our smart assistant do the hard work while you enjoy the journey</p>
      <div className='flex flex-col gap-5 mt-5'>
                  {suggestions.map((suggestions,index)=>(
                      
                      <div key={index} 
                      onClick={()=>onSelectOption(suggestions.title)}
                      className='flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:border-primary hover:text-primary font-bold'>
                          {suggestions.icon}
                          <h2 className='text-lg'>{suggestions.title}</h2>
                      </div>
                  ))}
              </div>
    
    
    </div>
  )
}

export default EmptyState
