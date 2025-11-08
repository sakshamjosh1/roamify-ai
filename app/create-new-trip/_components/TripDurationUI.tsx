import React, { useState } from 'react';

// Props: onSelectedOption is the function to send the confirmed duration back to the chat
interface TripDurationProps {
    onSelectedOption: (value: string) => void;
}

function TripDurationUI({ onSelectedOption }: TripDurationProps) {
    const [duration, setDuration] = useState(3); // Start with a default of 3 days

    // Handlers for incrementing and decrementing the duration
    const handleIncrement = () => {
        setDuration(prev => prev + 1);
    };

    const handleDecrement = () => {
        // Prevent duration from going below 1 day
        if (duration > 1) {
            setDuration(prev => prev - 1);
        }
    };

    // Handler for the Confirm button
    const handleConfirm = () => {
        // Send the confirmed duration back to the AI
        onSelectedOption(`${duration} Days`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-3 w-full max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">How many days do you want to travel?</h3>
            <div className="flex items-center justify-center space-x-4 mb-6">
                
                {/* Minus Button */}
                <button
                    onClick={handleDecrement}
                    className="p-3 text-4xl font-light text-gray-700 bg-gray-200 rounded-full hover:bg-red-700 hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={duration <= 1}
                >
                    &minus;
                </button>

                {/* Duration Display */}
                <span className="text-5xl font-extrabold text-primary w-32 text-center select-none">
                    {duration} Day{duration !== 1 && 's'}
                </span>

                {/* Plus Button */}
                <button
                    onClick={handleIncrement}
                    className="p-3 text-4xl font-light text-gray-700 bg-gray-200 rounded-full hover:bg-green-700 hover:text-white transition duration-200"
                >
                    +
                </button>
            </div>

            {/* Confirm Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleConfirm}
                    // 💥 Applied bg-primary and hover:bg-primary/90 for a slight contrast on hover
                    className="w-full max-w-[200px] py-3 text-lg font-semibold text-white bg-primary rounded-xl shadow-xl hover:bg-primary/90 transition duration-200 transform hover:scale-[1.02]"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default TripDurationUI;