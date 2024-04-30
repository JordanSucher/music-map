import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRef, useState, useEffect } from "react";

export default function ConcertPanel({ concerts, selectedConcert, onSelect }) {
  const audioRefs = useRef([]);  // Use an array to hold refs for each track

  const [bands, setBands] = useState(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.name));
  const [tracks, setTracks] = useState(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.tracks));
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    setBands(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.name));
    setTracks(selectedConcert?.bandShows.flatMap(bandShow => bandShow.band.tracks.map(track => ({
      ...track,  // Spread the existing properties of the track
      bandName: bandShow.band.name  // Add the band's name
    }))
  ));
  }, [selectedConcert]);

    const handleMouseEnter = index => {
      audioRefs.current[index] && audioRefs.current[index].play();
      setCurrentTrack(tracks[index]);
    };
  
    const handleMouseLeave = index => {
      audioRefs.current[index] && audioRefs.current[index].pause();
      setCurrentTrack(null);
    };
  

    return (
    <div className="text-black absolute top-0 left-0 m-4 p-4 bg-white rounded-lg shadow-lg max-w-[400px] max-h-[50%] overflow-y-auto">
        {selectedConcert ? (
          <div>
            <span className="flex gap-4 items-center">
                <ArrowLeftIcon className="cursor-pointer h-5 w-5" onClick={() => onSelect(null)}>Back to List</ArrowLeftIcon>
                <h2>{new Date(selectedConcert.date).toLocaleDateString()} - {selectedConcert.venue_name} - {bands?.join(", ")}</h2>
            </span>
            <a className="mt-5 text-blue-500 hover:text-blue-700 underline underline-offset-2 font-semibold" href={selectedConcert.ticket_url} target="_blank" rel="noreferrer">Tickets</a>
            <h2 className="mt-2 mb-2 font-semibold">Hover to listen</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {tracks?.map((track, index) => (
                <div key={index} className="h-[60px] w-[60px] md:h-[90px] md:w-[90px]">
                  <img
                    src={track.image_url}
                    alt={`Album cover for track ${index + 1}`}
                    className="cursor-pointer"
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

            { currentTrack && <span>
              {currentTrack.name} - {currentTrack.bandName}
            </span> }

          </div>
        ) : (
          <div>
            <h2 className="font-semibold">Shows in NYC this week</h2>
          <ul>
            {concerts.map(concert => (
              <li key={concert.id} className="p-2 cursor-pointer hover:bg-gray-200 underline" onClick={() => onSelect(concert)}>
                {new Date(concert.date).toLocaleDateString()} - {concert.venue_name} - {concert.bandShows.flatMap(bandShow => bandShow.band.name).join(", ")}
              </li>
            ))}
          </ul>
          </div>
        )}
      </div>
    );
  }
  