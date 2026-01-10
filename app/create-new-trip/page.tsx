import React from 'react'
import Chatbox from './_components/Chatbox'
import Header from '../_components/Header'
import { div } from 'motion/react-client'
import Itinerary from './_components/Itinerary'

function page() {
  return (

    <div>
        <Header/>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 p-8 h-1'>
            <div>
                <Chatbox/>
            </div>
            <div className='col-span-2'>
                <Itinerary/>
            </div>
        </div>
    </div>
  )
}

export default page
