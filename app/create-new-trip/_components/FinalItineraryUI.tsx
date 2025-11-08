import React from 'react';
import { PlaneTakeoff } from 'lucide-react';

// Props: The onSelectedOption prop is used here to acknowledge the user's click 
// and potentially trigger a modal or navigation in a full application.
interface FinalItineraryProps {
    onSelectedOption: (value: string) => void;
    // We can optionally pass the AI's final planning text to display above the card
    planningText: string; 
}

function FinalItineraryUI({ onSelectedOption, planningText }: FinalItineraryProps) {
    
    const handleViewTripClick = () => {
        onSelectedOption("View Trip Itinerary Now");
        // In a real app, this would open a modal or navigate to the itinerary view
    };

    return (
        <div className="mt-4 w-full">
            {/* AI Confirmation Text Bubble (Grey background) */}
            <div className="bg-gray-200 text-gray-800 p-4 rounded-xl rounded-tl-sm shadow-md mb-4 whitespace-pre-wrap">
                {planningText}
            </div>

            {/* Loading/Planning Card (White background) */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
                
                {/* Placeholder Logo/Icon */}
                <div className="p-3 mb-4 rounded-full" style={{ backgroundColor: 'oklch(95% 0.05 234)' }}>
                    {/* Placeholder for a logo or small icon, styled to match the color theme */}
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'oklch(30.082% 0.05182 234.191)' }}></div>
                </div>

                {/* Planning Status */}
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center" 
                    style={{ color: 'oklch(30.082% 0.05182 234.191)' }}>
                    <PlaneTakeoff className="w-6 h-6 mr-2" />
                    Planning your dream trip...
                </h3>

                <p className="text-gray-500 mb-6 max-w-xs">
                    Gathering best destinations, activities, and travel details for you.
                </p>

                {/* View Trip Button (Using your bg-primary color code) */}
                <button
                    onClick={handleViewTripClick}
                    className="w-full max-w-[250px] py-3 text-lg font-semibold text-white rounded-xl shadow-xl transition duration-200 transform hover:scale-[1.02]"
                    style={{ 
                        backgroundColor: 'oklch(50.082% 0.15 234.191)', // Slightly lighter for the button visual
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    View Trip
                </button>
            </div>
        </div>
    );
}

export default FinalItineraryUI;