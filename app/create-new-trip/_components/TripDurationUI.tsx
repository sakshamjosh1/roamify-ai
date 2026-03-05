import React, { useState } from 'react';

interface TripDurationProps {
  onSelectedOption: (value: string) => void;
}

function TripDurationUI({ onSelectedOption }: TripDurationProps) {
  const [duration, setDuration] = useState(3);

  const handleIncrement = () => setDuration(prev => prev + 1);
  const handleDecrement = () => { if (duration > 1) setDuration(prev => prev - 1); };
  const handleConfirm = () => onSelectedOption(`${duration} Days`);

  return (
    <div className='mt-2 p-4 bg-white border border-gray-200 rounded-xl'>
      <p className='text-sm font-medium text-gray-700 mb-4 text-center'>How many days?</p>

      {/* Stepper */}
      <div className='flex items-center justify-center gap-5 mb-5'>
        <button
          onClick={handleDecrement}
          disabled={duration <= 1}
          className='w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-lg font-medium'
        >
          −
        </button>

        <div className='text-center min-w-[80px]'>
          <span className='text-4xl font-bold text-gray-900'>{duration}</span>
          <p className='text-xs text-gray-400 mt-0.5'>{duration === 1 ? 'day' : 'days'}</p>
        </div>

        <button
          onClick={handleIncrement}
          className='w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-500 transition-all duration-150 text-lg font-medium'
        >
          +
        </button>
      </div>

      {/* Quick presets */}
      <div className='flex gap-2 justify-center mb-4'>
        {[3, 5, 7, 10].map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-3 py-1 text-xs rounded-full border transition-all duration-150 ${
              duration === d
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        className='w-full py-2.5 bg-gray-900 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors duration-150'
      >
        Confirm {duration} {duration === 1 ? 'day' : 'days'}
      </button>
    </div>
  );
}

export default TripDurationUI;