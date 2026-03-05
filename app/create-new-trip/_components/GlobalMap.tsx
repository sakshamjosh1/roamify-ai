import React, { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useTripDetail } from '@/app/provider';
import { Activity, Itinerary } from './Chatbox';

function GlobalMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { tripDetailInfo } = useTripDetail();

  useEffect(() => {
    mapboxgl.accessToken = process?.env?.NEXT_PUBLIC_MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef?.current ?? '',
      style: 'mapbox://styles/mapbox/light-v11', // cleaner light style
      center: [-74.5, 40],
      zoom: 1.7,
      projection: 'globe',
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const markers: mapboxgl.Marker[] = [];
    const itineraries = Array.isArray(tripDetailInfo?.itinerary) ? tripDetailInfo.itinerary : [];

    itineraries.forEach((itinerary: Itinerary) => {
      itinerary.activities?.forEach((activity: Activity) => {
        if (activity?.geo_coordinates?.longitude && activity?.geo_coordinates?.latitude) {
          // Custom marker element
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.cssText = `
            width: 28px;
            height: 28px;
            background: #f97316;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            cursor: pointer;
            transition: transform 0.15s ease;
          `;
          el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)'; });
          el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([activity.geo_coordinates.longitude, activity.geo_coordinates.latitude])
            .setPopup(
              new mapboxgl.Popup({
                offset: 20,
                className: 'custom-popup',
              }).setHTML(`
                <div style="padding:8px 4px;">
                  <p style="font-weight:600;font-size:13px;color:#111;margin:0 0 2px">${activity.place_name}</p>
                  <p style="font-size:11px;color:#888;margin:0">${activity.place_address ?? ''}</p>
                </div>
              `)
            )
            .addTo(map);
          markers.push(marker);
        }
      });
    });

    // Fly to first activity
    if (itineraries.length > 0 && itineraries[0].activities?.length > 0) {
      const first = itineraries[0].activities[0];
      if (first?.geo_coordinates?.longitude && first?.geo_coordinates?.latitude) {
        map.flyTo({
          center: [first.geo_coordinates.longitude, first.geo_coordinates.latitude],
          zoom: 7,
          essential: true,
        });
      }
    }

    return () => { markers.forEach((m) => m.remove()); };
  }, [tripDetailInfo]);

  return (
    <div className='w-full h-full relative'>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default GlobalMap;