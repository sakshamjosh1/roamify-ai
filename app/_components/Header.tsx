import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

const menuOptions=[
    {
        name:'Home',
        path:'/'
    },
    {
        name:'Pricing',
        path:'/pricing'
    },
    {
        name:'Contact us',
        path:'/contact-us'
    },
]

function Header() {
  return (
    <div className='flex justify-between items-center p-4'>
       {/* Logo */}
       <Link href="/" className='flex gap-2 items-center hover:cursor-pointer'>
           <Image src={'/logo.png'} alt='logo' width={40} height={40}/>
           <h2 className='font-extrabold text-2xl'>RoamifyAI</h2>
       </Link>
       
       {/* Menu Options */}
       <div className='flex gap-8 items-center '>
          {menuOptions.map((menu, index)=>(
              <Link key={menu.path} href={menu.path}>
                  <h2 className=' text-lg hover:scale-105 transition-transform hover:text-primary'>{menu.name}</h2>
              </Link>
            
          ))}
       </div>

       {/* Get Started */}
       <SignInButton mode='modal'>
          <InteractiveHoverButton className='hover:cursor-pointer'>Get Started</InteractiveHoverButton>
       </SignInButton>
       
    </div>
  )
}

export default Header;
