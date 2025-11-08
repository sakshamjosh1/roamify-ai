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

function GroupSizeUI({onSelectedOption}:any) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-2">
      {SelectTravelesList.map((item) => (
        <div key={item.id} className="p-3 border rounded-2xl bg-white hover:border-primary cursor-pointer"
        onClick={()=>onSelectedOption(item.title+":"+item.people)}
        >
          <h2 className="text-2xl">{item.icon}</h2>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default GroupSizeUI;
