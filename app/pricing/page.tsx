import React from 'react'
import { PricingTable } from '@clerk/nextjs'
import Header from '../_components/Header'
import { Zap, Star, Shield } from 'lucide-react'

function Pricing() {
  return (
    <>
      <Header />

      <div className='max-w-3xl mx-auto px-6 py-16'>

        {/* Header */}
        <div className='text-center mb-12'>
          <p className='text-xs tracking-[0.2em] uppercase text-gray-400 mb-3'>Pricing</p>
          <h1 className='text-4xl font-bold text-gray-900 tracking-tight mb-3'>
            Simple, honest pricing
          </h1>
          <p className='text-gray-500 text-base max-w-sm mx-auto leading-relaxed'>
            Start free. Upgrade when you need more trips.
          </p>
        </div>

        {/* Free tier callout */}
        <div className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-8'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center'>
              <Shield className='h-4 w-4 text-gray-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900'>Free plan</p>
              <p className='text-xs text-gray-400'>2 trips per day, no credit card required</p>
            </div>
          </div>
          <span className='text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full'>
            Current plan
          </span>
        </div>

        {/* Clerk Pricing Table */}
        <div className='border border-gray-200 rounded-2xl overflow-hidden'>
          <PricingTable />
        </div>

        {/* Bottom note */}
        <p className='text-xs text-gray-400 text-center mt-6'>
          All plans include hotel recommendations, interactive maps, and AI itinerary generation.
          Cancel anytime.
        </p>

      </div>
    </>
  )
}

export default Pricing