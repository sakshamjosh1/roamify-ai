import React from 'react';

export const SelectTravelesList = [
  { id: 1, title: 'Just Me', desc: 'Solo explorer', icon: '🧍', people: '1', accent: 'hover:border-blue-400 hover:bg-blue-50' },
  { id: 2, title: 'A Couple', desc: 'Two in tandem', icon: '🥂', people: '2 People', accent: 'hover:border-pink-400 hover:bg-pink-50' },
  { id: 3, title: 'Family', desc: '3 to 5 people', icon: '🏡', people: '3 to 5 People', accent: 'hover:border-green-400 hover:bg-green-50' },
  { id: 4, title: 'Friends', desc: '5 to 10 people', icon: '🎉', people: '5 to 10 People', accent: 'hover:border-orange-400 hover:bg-orange-50' },
];

function GroupSizeUI({ onSelectedOption }: any) {
  return (
    <div className='grid grid-cols-2 gap-2 mt-2'>
      {SelectTravelesList.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectedOption(item.title + ':' + item.people)}
          className={`flex flex-col items-start p-3 border border-gray-200 bg-white rounded-xl cursor-pointer transition-all duration-150 text-left ${item.accent}`}
        >
          <span className='text-2xl mb-1.5'>{item.icon}</span>
          <span className='text-sm font-semibold text-gray-800'>{item.title}</span>
          <span className='text-[11px] text-gray-400 mt-0.5'>{item.desc}</span>
        </button>
      ))}
    </div>
  );
}

export default GroupSizeUI;