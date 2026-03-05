import React from 'react'

export const SelectBudgetOptions = [
  { id: 1, title: 'Cheap', desc: 'Stay conscious of costs', icon: '🪙', accent: 'hover:border-green-400 hover:bg-green-50' },
  { id: 2, title: 'Moderate', desc: 'Average spend', icon: '💰', accent: 'hover:border-yellow-400 hover:bg-yellow-50' },
  { id: 3, title: 'Luxury', desc: "Don't worry about cost", icon: '💸', accent: 'hover:border-purple-400 hover:bg-purple-50' },
];

function BudgetUI({ onSelectedOption }: any) {
  return (
    <div className='grid grid-cols-3 gap-2 mt-2'>
      {SelectBudgetOptions.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectedOption(item.title + ':' + item.desc)}
          className={`flex flex-col items-center text-center p-3 border border-gray-200 bg-white rounded-xl cursor-pointer transition-all duration-150 ${item.accent}`}
        >
          <span className='text-2xl mb-1'>{item.icon}</span>
          <span className='text-sm font-semibold text-gray-800'>{item.title}</span>
          <span className='text-[11px] text-gray-400 mt-0.5 leading-tight'>{item.desc}</span>
        </button>
      ))}
    </div>
  )
}

export default BudgetUI