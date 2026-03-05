import React from 'react'
import { suggestions } from '@/app/_components/Hero'
import { Sparkles } from 'lucide-react'

function EmptyState({ onSelectOption }: any) {
  return (
    <div className='flex flex-col h-full px-2 py-4'>

      {/* Top section */}
      <div className='text-center mb-6'>
        <div className='w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3'>
          <Sparkles className='h-5 w-5 text-orange-500' />
        </div>
        <h2 className='font-semibold text-gray-900 text-lg'>Start planning with AI</h2>
        <p className='text-xs text-gray-400 mt-1 leading-relaxed max-w-[220px] mx-auto'>
          Tell me where you want to go and I'll build your perfect itinerary.
        </p>
      </div>

      {/* Suggestions */}
      <p className='text-[11px] tracking-widest uppercase text-gray-400 mb-2 px-1'>Try asking</p>
      <div className='flex flex-col gap-2'>
        {suggestions.map((s, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(s.title)}
            className='flex items-center gap-3 px-3 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-all duration-150 text-left w-full'
          >
            <span className='flex-shrink-0'>{s.icon}</span>
            {s.title}
          </button>
        ))}
      </div>

    </div>
  )
}

export default EmptyState