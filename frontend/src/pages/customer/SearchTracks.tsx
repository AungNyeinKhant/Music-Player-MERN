import { FC, useState, useEffect } from "react";
import { Track, TrackContextType } from "../../types";
import MusicCard from "../../components/cards/MusicCard";
import { useLocation } from "react-router-dom";
import Template from "../../layouts/Template";
import { getTrackBySearch } from "../../services/trackService";
import { useTrack } from "../../context/TrackContext";

const SearchTracks: FC = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chosenTracks: TrackContextType | null = useTrack();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      setIsLoading(true);
      try {
        const response: any = await getTrackBySearch(searchQuery);
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleTrackClick = (track: Track) => {
    chosenTracks?.setChosenTrack({
      playTrack: track,
      queTracks: searchResults,
    });
  };

  return (
    <Template>
      <div className='flex-1 overflow-y-auto p-6 '>
        <h2 className='text-2xl font-bold mb-6'>
          Search Results for "{searchQuery}"
        </h2>

        {isLoading ? (
          <div className='text-center text-gray-400 mt-8'>Loading...</div>
        ) : (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20'>
              {searchResults.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  size='medium'
                  onClick={() => handleTrackClick(track)}
                />
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className='text-center text-gray-400 mt-8'>
                No tracks found for "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </Template>
  );
};

export default SearchTracks;
