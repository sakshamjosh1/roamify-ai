import React from 'react'
import Chatbox from './_components/Chatbox'
import Header from '../_components/Header'
import { div } from 'motion/react-client'

function page() {
  return (

    <div>
        <Header/>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-10'>
            <div>
                <Chatbox/>
            </div>
            <div>
            Map and trip plan to display
            </div>
        </div>
    </div>
  )
}

export default page
