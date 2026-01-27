import React, { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useTripDetail } from '@/app/provider';
import { ActivityIcon } from 'lucide-react';
import { Activity, Itinerary } from './Chatbox';

function GlobalMap() {

  const mapContainerRef=useRef(null);
  const { tripDetailInfo,setTripDetailInfo } = useTripDetail();

  useEffect(() => {
    mapboxgl.accessToken = process?.env?.NEXT_PUBLIC_MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef?.current ?? '', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 1.7, // starting zoom
      projection: 'globe',
    });

    const markers: mapboxgl.Marker[] = [];

    // Ensure itinerary is treated as an array
    const itineraries = Array.isArray(tripDetailInfo?.itinerary) ? tripDetailInfo.itinerary : [];

    itineraries.forEach((itinerary: Itinerary) => {
      itinerary.activities?.forEach((activity: Activity) => {
        if (activity?.geo_coordinates?.longitude && activity?.geo_coordinates?.latitude) {
          console.log('Adding marker for activity:', activity); // Debugging log
          const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([
              activity.geo_coordinates.longitude,
              activity.geo_coordinates.latitude,
            ])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name)
            )
            .addTo(map);

          markers.push(marker);
        } else {
          console.warn('Invalid coordinates for activity:', activity); // Debugging log
        }
      });
    });

    return () => {
      // Clean up markers when the component unmounts
      markers.forEach((marker) => marker.remove());
    };
  }, [tripDetailInfo]);
    
  return (
    <div>
      <div ref={mapContainerRef} style={{
        widows:'95%',
        height:'85vh',
        borderRadius:20
      }}>

      </div>
    </div>
  )
}

export default GlobalMap
