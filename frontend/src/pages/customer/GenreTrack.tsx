import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Template from "../../layouts/Template";
import MusicCard from "../../components/cards/MusicCard";
import { Track } from "../../types";
import { useTrack } from "../../context/TrackContext";
import { getTrackByGenre } from "../../services/trackService";

const GenreTrack: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chosenTracks = useTrack();

  useEffect(() => {
    const fetchGenreTracks = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response: any = await getTrackByGenre(id);
        const trackData = response.data.data || [];
        setTracks(trackData);
        if (trackData.length > 0) {
          setGenreName(trackData[0].genre.name);
        }
      } catch (err) {
        setError("Failed to load tracks");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreTracks();
  }, [id]);

  const handleTrackClick = (track: Track) => {
    chosenTracks?.setChosenTrack({
      playTrack: track,
      queTracks: tracks,
    });
  };

  if (loading) {
    return (
      <Template>
        <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 flex items-center justify-center'>
          <div className='text-white'>Loading...</div>
        </div>
      </Template>
    );
  }

  if (error) {
    return (
      <Template>
        <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 flex items-center justify-center'>
          <div className='text-red-500'>{error}</div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <h1 className='text-4xl font-bold text-white mb-8'>
          {genreName
            ? "Enjoy " + genreName + " tracks"
            : "No tracks for this genre"}
        </h1>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {tracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onClick={() => handleTrackClick(track)}
            />
          ))}
        </div>
      </div>
    </Template>
  );
};

export default GenreTrack;
