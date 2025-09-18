import React from 'react';

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole travelers in exploration',
    icon: '🧍',
    people: '1'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '🏡',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '🎉',
    people: '5 to 10 People'
  },
];

function GroupSizeUI() {
  return (
    <div>
      {SelectTravelesList.map((item, index) => (
        <div key={index} className='p-3 border rounded-2xl bg-white hover:border-primary cursor-pointer'>
          <h2>{item.icon}</h2>
          <h2>{item.title}</h2>
        </div>
      ))}
    </div>
  );
}

export default GroupSizeUI;
