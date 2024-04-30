import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRef, useState, useEffect } from "react";

export default function ConcertPanel({ concerts, selectedConcert, onSelect }) {
  const audioRefs = useRef([]);  // Use an array to hold refs for each track

  const [bands, setBands] = useState(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.name));
  const [tracks, setTracks] = useState(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.tracks));

  useEffect(() => {
    setBands(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.name));
    setTracks(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.tracks));
  }, [selectedConcert]);

    const handleMouseEnter = index => {
      audioRefs.current[index] && audioRefs.current[index].play();
    };
  
    const handleMouseLeave = index => {
      audioRefs.current[index] && audioRefs.current[index].pause();
    };
  

    return (
    <div className="text-black absolute top-0 left-0 m-4 p-4 bg-white rounded-lg shadow-lg">
        {selectedConcert ? (
          <div>
            <span className="flex gap-4 items-center">
                <ArrowLeftIcon className="cursor-pointer h-5 w-5" onClick={() => onSelect(null)}>Back to List</ArrowLeftIcon>
                <h2>{selectedConcert.venue_name} - {selectedConcert.date}</h2>
            </span>
            {tracks?.map((track, index) => (
            <div key={index} className="mb-4">
              <img
                src={track.image_url}
                alt={`Album cover for track ${index + 1}`}
                className="w-24 h-24 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              />
              <audio
                ref={el => audioRefs.current[index] = el}
                src={track.preview_url}
                preload="none"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}

          </div>
        ) : (
          <ul>
            {concerts.map(concert => (
              <li key={concert.id} className="p-2 cursor-pointer" onClick={() => onSelect(concert)}>
                {concert.venue_name} - {concert.bandShows.flatMap(bandShow => bandShow.band.name).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  