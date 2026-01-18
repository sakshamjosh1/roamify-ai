"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { usePathname } from 'next/navigation';

const menuOptions = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'Contact us',
    path: '/contact-us'
  },
];

function Header() {
  const { user, isLoaded } = useUser();
  const path=usePathname();
  console.log(path);



  return (
    <div className='flex justify-between items-center p-4'>
      {/* Logo */}
      <Link href="/" className='flex gap-2 items-center hover:cursor-pointer'>
        <Image src={'/logo.png'} alt='logo' width={40} height={40} />
        <h2 className='font-extrabold text-2xl'>RoamifyAI</h2>
      </Link>

      {/* Menu Options */}
      <div className='flex gap-8 items-center '>
        {menuOptions.map((menu) => (
          <Link key={menu.path} href={menu.path}>
            <h2 className=' text-lg hover:scale-105 transition-transform hover:text-primary'>{menu.name}</h2>
          </Link>
        ))}
      </div>

      {/* Get Started / Create New Trip */}
      <div className='flex gap-5 items-center'>
        {isLoaded && (
        !user ? (
          <SignInButton mode='modal'>
            <InteractiveHoverButton className='hover:cursor-pointer'>Get Started</InteractiveHoverButton>
          </SignInButton>
        ) : (
          path=='/create-new-trip'? 
          <Link href={'/my-trips'}>
            <InteractiveHoverButton className='hover:cursor-pointer'>My Trips</InteractiveHoverButton>
          </Link>
          : <Link href={'/create-new-trip'}>
            <InteractiveHoverButton className='hover:cursor-pointer'>Create New Trip</InteractiveHoverButton>
          </Link>
        )
      )}
      <UserButton/>
      </div>
      
    </div>
  );
}

export default Header;
