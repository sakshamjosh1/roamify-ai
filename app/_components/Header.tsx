"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { usePathname } from 'next/navigation';

const menuOptions = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact us', path: '/contact-us' },
];

function Header() {
  const { user, isLoaded } = useUser();
  const path = usePathname();

  return (
    <div className='sticky top-0 z-50 bg-white border-b border-gray-100'>
      <div className='max-w-6xl mx-auto px-6 h-20 flex justify-between items-center'>

        {/* Logo */}
        <Link href="/" className='flex items-center gap-2.5 hover:opacity-80 transition-opacity'>
          <Image src={'/logo.png'} alt='logo' width={45} height={45} className='rounded-lg' />
          <span className='text-2xl font-semibold tracking-tight text-gray-900'>
            Roamify<span className='text-orange-500'>AI</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className='hidden md:flex items-center gap-1'>
          {menuOptions.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              className={`px-4 py-2 text-base rounded-md transition-colors ${
                path === menu.path
                  ? 'text-gray-900 bg-gray-100 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className='flex items-center gap-3'>
          {isLoaded && (
            !user ? (
              <SignInButton mode='modal'>
                <InteractiveHoverButton className='hover:cursor-pointer text-sm'>
                  Get Started
                </InteractiveHoverButton>
              </SignInButton>
            ) : (
              path === '/create-new-trip' ? (
                <Link href='/my-trips'>
                  <InteractiveHoverButton className='hover:cursor-pointer text-sm'>
                    My Trips
                  </InteractiveHoverButton>
                </Link>
              ) : (
                <Link href='/create-new-trip'>
                  <InteractiveHoverButton className='hover:cursor-pointer text-sm'>
                    Create New Trip
                  </InteractiveHoverButton>
                </Link>
              )
            )
          )}
          <UserButton />
        </div>

      </div>
    </div>
  );
}

export default Header;