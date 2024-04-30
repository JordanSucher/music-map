// page.js
"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import ConcertInfo from "./ConcertInfo";

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef(mapboxgl.Map || null);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      await fetch("/api/getConcerts")
        .then((res) => res.json())
        .then((data) => {
          setConcerts(data)
          data.forEach((concert) => {
            //add marker
            let latlong = JSON.parse(concert.latlong);
            const marker = new mapboxgl.Marker().setLngLat([latlong[1], latlong[0]]).addTo(map.current);
            
            marker.getElement().addEventListener('click', () => {
              setSelectedConcert(concert);
            })
          
          })
        });

    }

    fetchConcerts()
  }, []);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoianN1Y2hlciIsImEiOiJjbHEyeHdkcHYwMHVhMmlwNmNsZmV3eDIwIn0.tQst6lt5NChnRTRk_YbJ7Q";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jsucher/clviopqwy03a301phb7jb8t4x",
      center: [-73.96347, 40.709985],
      zoom: 16,
      pitch: 60, // starting pitch in degrees
      bearing: -17.6, // starting bearing in degrees,
      scrollZoom: false,
    });
  }, []);

  useEffect(() => {
    if (selectedConcert) {
      let latlong = JSON.parse(selectedConcert.latlong);
      map.current.flyTo({
        center: [latlong[1], latlong[0]],
        zoom: 16,
        pitch: 60, // starting pitch in degrees
        bearing: -17.6, // starting bearing in degrees
      })
    }
  }, [selectedConcert]);

  return (
    <div id="map" className="h-screen w-full">
      <div className="h-screen w-full" ref={mapContainer} />
      <ConcertInfo concerts={concerts} selectedConcert={selectedConcert} onSelect={setSelectedConcert} />
    </div>
  );
}