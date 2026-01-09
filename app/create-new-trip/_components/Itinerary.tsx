import React from 'react'
import { Timeline } from '@/components/ui/timeline';
import { div } from 'motion/react-client';
import Image from 'next/image';
import { Clock, ExternalLink, Star, Ticket, Timer, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';

const TRIP_DATA={
        "destination": "Goa",
        "duration": "3 days",
        "origin": "Delhi",
        "budget": "Moderate",
        "group_size": "3-5",
        "hotels": [
            {
                "hotel_name": "The Park Hyatt Goa Resort and Spa",
                "hotel_address": "Arossim Beach, Cansaulim, Goa",
                "price_per_night": "₹ 15,000",
                "hotel_image_url": "https://www.hyatt.com/content/dam/hyatt/hotels/goa/park-hyatt-goa-resort-and-spa/lobby.jpg",
                "geo_coordinates": {
                    "latitude": 15.2833,
                    "longitude": 73.7833
                },
                "rating": 4.5,
                "description": "A luxurious resort with a private beach, multiple dining options, and a spa."
            },
            {
                "hotel_name": "The Leela Goa",
                "hotel_address": "Cavelossim Beach, Cavelossim, Goa",
                "price_per_night": "₹ 18,000",
                "hotel_image_url": "https://www.theleela.com/goa/images/hero-image.jpg",
                "geo_coordinates": {
                    "latitude": 15.2833,
                    "longitude": 73.7833
                },
                "rating": 4.7,
                "description": "A 5-star resort with a private beach, multiple dining options, and a spa."
            },
            {
                "hotel_name": "The Taj Exotica Resort & Spa",
                "hotel_address": "Benaulim, Goa",
                "price_per_night": "₹ 20,000",
                "hotel_image_url": "https://www.tajhotels.com/en-in/taj-exotica-resort-and-spa-goa/images/hero-image.jpg",
                "geo_coordinates": {
                    "latitude": 15.2833,
                    "longitude": 73.7833
                },
                "rating": 4.8,
                "description": "A luxurious resort with a private beach, multiple dining options, and a spa."
            }
        ],
        "itinerary": [
            {
                "day": 1,
                "day_plan": "Arrive in Goa, check-in at the resort, and spend the day relaxing on the beach.",
                "best_time_to_visit_day": "Morning to evening",
                "activities": [
                    {
                        "place_name": "Anjuna Beach",
                        "place_details": "A popular beach with a lively atmosphere, perfect for swimming, sunbathing, and water sports.",
                        "place_image_url": "https://www.goa-tourism.com/images/anjuna-beach.jpg",
                        "geo_coordinates": {
                            "latitude": 15.5833,
                            "longitude": 73.7833
                        },
                        "place_address": "Anjuna, Goa",
                        "ticket_pricing": "Free",
                        "time_travel_each_location": "9:00 AM to 6:00 PM",
                        "best_time_to_visit": "Morning to evening"
                    },
                    {
                        "place_name": "Vagator Beach",
                        "place_details": "A scenic beach with a picturesque view, perfect for swimming, sunbathing, and relaxation.",
                        "place_image_url": "https://www.goa-tourism.com/images/vagator-beach.jpg",
                        "geo_coordinates": {
                            "latitude": 15.5833,
                            "longitude": 73.7833
                        },
                        "place_address": "Vagator, Goa",
                        "ticket_pricing": "Free",
                        "time_travel_each_location": "9:00 AM to 6:00 PM",
                        "best_time_to_visit": "Morning to evening"
                    },
                    {
                        "place_name": "Sunset Cruise",
                        "place_details": "A romantic cruise with a stunning sunset view, perfect for couples and families.",
                        "place_image_url": "https://www.goa-tourism.com/images/sunset-cruise.jpg",
                        "geo_coordinates": {
                            "latitude": 15.5833,
                            "longitude": 73.7833
                        },
                        "place_address": "Mandrem, Goa",
                        "ticket_pricing": "₹ 1,500",
                        "time_travel_each_location": "6:00 PM to 8:00 PM",
                        "best_time_to_visit": "Evening"
                    }
                ]
            },
            {
                "day": 2,
                "day_plan": "Visit the famous Palolem Beach, try your hand at water sports, and return to the resort for a relaxing evening.",
                "best_time_to_visit_day": "Morning to evening",
                "activities": [
                    {
                        "place_name": "Palolem Beach",
                        "place_details": "A picturesque beach with a tranquil atmosphere, perfect for swimming, sunbathing, and relaxation.",
                        "place_image_url": "https://www.goa-tourism.com/images/palolem-beach.jpg",
                        "geo_coordinates": {
                            "latitude": 15.2833,
                            "longitude": 73.7833
                        },
                        "place_address": "Palolem, Goa",
                        "ticket_pricing": "Free",
                        "time_travel_each_location": "9:00 AM to 6:00 PM",
                        "best_time_to_visit": "Morning to evening"
                    },
                    {
                        "place_name": "Water Sports",
                        "place_details": "A variety of water sports, including parasailing, kayaking, and paddleboarding.",
                        "place_image_url": "https://www.goa-tourism.com/images/water-sports.jpg",
                        "geo_coordinates": {
                            "latitude": 15.2833,
                            "longitude": 73.7833
                        },
                        "place_address": "Palolem, Goa",
                        "ticket_pricing": "₹ 500",
                        "time_travel_each_location": "10:00 AM to 5:00 PM",
                        "best_time_to_visit": "Afternoon"
                    },
                    {
                        "place_name": "Seafood Dinner",
                        "place_details": "A delicious seafood dinner at a local restaurant.",
                        "place_image_url": "https://www.goa-tourism.com/images/seafood-dinner.jpg",
                        "geo_coordinates": {
                            "latitude": 15.2833,
                            "longitude": 73.7833
                        },
                        "place_address": "Palolem, Goa",
                        "ticket_pricing": "₹ 1,000",
                        "time_travel_each_location": "7:00 PM to 9:00 PM",
                        "best_time_to_visit": "Evening"
                    }
                ]
            },
            {
                "day": 3,
                "day_plan": "Visit the famous Baga Beach, try your hand at water sports, and return to the resort for a relaxing evening.",
                "best_time_to_visit_day": "Morning to evening",
                "activities": [
                    {
                        "place_name": "Baga Beach",
                        "place_details": "A lively beach with a vibrant atmosphere, perfect for swimming, sunbathing, and water sports.",
                        "place_image_url": "https://www.goa-tourism.com/images/baga-beach.jpg",
                        "geo_coordinates": {
                            "latitude": 15.5833,
                            "longitude": 73.7833
                        },
                        "place_address": "Baga, Goa",
                        "ticket_pricing": "Free",
                        "time_travel_each_location": "9:00 AM to 6:00 PM",
                        "best_time_to_visit": "Morning to evening"
                    },
                    {
                        "place_name": "Water Sports",
                        "place_details": "A variety of water sports, including parasailing, kayaking, and paddleboarding.",
                        "place_image_url": "https://www.goa-tourism.com/images/water-sports.jpg",
                        "geo_coordinates": {
                            "latitude": 15.5833,
                            "longitude": 73.7833
                        },
                        "place_address": "Baga, Goa",
                        "ticket_pricing": "₹ 500",
                        "time_travel_each_location": "10:00 AM to 5:00 PM",
                        "best_time_to_visit": "Afternoon"
                    },
                    {
                        "place_name": "Return to Delhi",
                        "place_details": "A scenic drive back to Delhi.",
                        "place_image_url": "https://www.goa-tourism.com/images/return-to-delhi.jpg",
                        "geo_coordinates": {
                            "latitude": 15.5833,
                            "longitude": 73.7833
                        },
                        "place_address": "Delhi",
                        "ticket_pricing": "₹ 5,000",
                        "time_travel_each_location": "9:00 AM to 6:00 PM",
                        "best_time_to_visit": "Morning to evening"
                    }
                ]
            }
        ]
    ,
    "resp": "Please continue with the trip details.",
    "ui": "text"
}

function Itinerary() {
  const data = [
    {
      title: "Recommended Hotels",
      content: (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {TRIP_DATA?.hotels.map((hotel,index)=>(
                <HotelCardItem hotel={hotel}/>
            ))}
        </div>
      ),
    },
    ...TRIP_DATA?.itinerary.map((dayData)=>({
        title: `Day ${dayData?.day}`,
        content:(
            <div>
                <p>Best Time:{dayData?.best_time_to_visit_day}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {dayData.activities.map((activity,index)=>(
                        <PlaceCardItem activity={activity}/>
                    ))}
                </div>
                
            </div>
        )
    }))
  ];
  return (
    <div className="relative w-full h-[83vh] overflow-auto">
      <Timeline data={data} tripData={TRIP_DATA} />
    </div>
  );
}

export default Itinerary
