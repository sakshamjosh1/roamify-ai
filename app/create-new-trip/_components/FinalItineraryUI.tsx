import React from 'react';
import { PlaneTakeoff, CheckCircle, Loader2 } from 'lucide-react';

interface FinalItineraryUIProps {
    planningText: string;
    isTripReady: boolean;
    onViewTrip: () => void;
    onSelectedOption: (value: string) => void; 
}

function FinalItineraryUI({ planningText, isTripReady, onViewTrip, onSelectedOption }: FinalItineraryUIProps) {

    // Using a vibrant blue color, similar to the one in the uploaded image.
    const primaryColorHex = "#4f46e5"; // Indigo 600
    const primaryBgHoverClass = "hover:bg-indigo-700";

    const IconComponent = isTripReady ? CheckCircle : PlaneTakeoff;
    const titleText = isTripReady ? "Trip Ready!" : "Planning your dream trip...";
    const descriptionText = isTripReady 
        ? "Click below to explore your personalized, detailed itinerary."
        : "Gathering best destinations, activities, and travel details for you.";
    
    // Icon styles
    const iconClasses = `text-4xl w-10 h-10 text-indigo-600 ${isTripReady ? 'animate-none' : 'animate-bounce'}`;

    // Button styles, including disabled appearance and strong shadow
    const buttonClasses = `
        w-full max-w-[250px] py-3 text-lg font-semibold text-white 
        rounded-xl shadow-xl transition duration-150 ease-in-out
        ${isTripReady 
            ? `${primaryBgHoverClass} hover:scale-[1.02]`
            : 'bg-gray-400 cursor-not-allowed shadow-none'
        }
    `;

    const handleViewTripClick = () => {
        if (isTripReady) {
            onSelectedOption("View Trip Itinerary Now");
            onViewTrip();
        }
    };

    return (
        <div className="mt-4 w-full">
            {/* AI Confirmation Text Bubble */}
            <div className="bg-gray-200 text-gray-800 p-4 rounded-xl rounded-tl-sm shadow-md mb-4 whitespace-pre-wrap">
                {planningText}
            </div>

            {/* Main Planning/Ready Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
                
                {/* Icon Placeholder/Container */}
                <div className="p-3 mb-4 rounded-full bg-indigo-100">
                    <IconComponent className={iconClasses} />
                </div>

                {/* Planning Status Title */}
                <h3 className={`text-2xl font-bold mb-2 flex items-center justify-center text-indigo-600`}>
                    {titleText}
                </h3>

                <p className="text-gray-500 mb-6 max-w-xs">
                    {descriptionText}
                </p>

                {/* View Trip Button */}
                <button
                    onClick={handleViewTripClick}
                    disabled={!isTripReady}
                    className={buttonClasses}
                    // Apply primary color directly via style for the enabled state
                    style={{
                        backgroundColor: isTripReady ? primaryColorHex : undefined,
                        boxShadow: isTripReady ? `0 8px 15px 0px rgba(79, 70, 229, 0.4)` : 'none'
                    }}
                >
                    View Trip Itinerary
                </button>
                
                {/* Live Loading Indicator while planning */}
                {!isTripReady && (
                    <div className="w-full mt-4 flex justify-center items-center">
                         <Loader2 className="h-5 w-5 animate-spin text-indigo-400 mr-2" />
                         <span className="text-sm text-gray-500">Generating itinerary...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinalItineraryUI;