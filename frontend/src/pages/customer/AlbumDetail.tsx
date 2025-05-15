import { FC, useEffect, useState } from "react";
import Template from "../../layouts/Template";
import MusicCard from "../../components/cards/MusicCard";
import { Track, TrackContextType } from "../../types";
import { getTracksByAlbumId } from "../../services/albumService";
import { useParams } from "react-router-dom";
import NoImage from "../../assets/image/no-album-image.svg";
import { useTrack } from "../../context/TrackContext";

const AlbumDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const chosenTracks: TrackContextType | null = useTrack();
  const [album, setAlbum] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch album details and tracks
        const trackResponse: any = await getTracksByAlbumId(id);
        
        if (trackResponse?.data?.success && trackResponse.data.data.length > 0) {
          const trackData = trackResponse.data.data;
          setTracks(trackData);
          
          // Set album info from the first track's album
          if (trackData.length > 0) {
            setAlbum({
              ...trackData[0].album,
              artist: trackData[0].artist,
              created_at: trackData[0].created_at,
            });
          }
        } else {
          setError("Album not found or has no tracks");
        }
      } catch (err) {
        console.error("Error fetching album details:", err);
        setError("Failed to load album data");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
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
        <div className="flex-1 bg-gradient-to-b from-primary to-black p-8 flex items-center justify-center">
          <div className="text-primaryText">Loading album details...</div>
        </div>
      </Template>
    );
  }

  if (error || !album) {
    return (
      <Template>
        <div className="flex-1 bg-gradient-to-b from-primary to-black p-8 flex items-center justify-center">
          <div className="text-red-500">{error || "Album not found"}</div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <div className='flex flex-col md:flex-row gap-8 mb-8'>
          <div className='w-64 h-64 flex-shrink-0'>
            <img
              src={album.image || NoImage}
              alt={album.name}
              className='w-full h-full object-cover rounded-lg shadow-lg'
            />
          </div>
          <div className='flex flex-col justify-end'>
            <h1 className='text-4xl font-bold text-primaryText mb-2'>
              {album.name}
            </h1>
            <p className='text-xl text-gray-400 mb-4'>{album.artist?.name || "Unknown Artist"}</p>
            <p className='text-sm text-gray-500'>
              Released in {new Date(album.created_at).getFullYear()}
            </p>
            {album.description && (
              <p className='text-gray-300 mt-4 max-w-2xl'>{album.description}</p>
            )}
          </div>
        </div>

        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-primaryText mb-6'>Tracks</h2>
          {tracks.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {tracks.map((track) => (
                <MusicCard 
                  key={track.id} 
                  track={track} 
                  onClick={handleTrackClick}
                />
              ))}
            </div>
          ) : (
            <div className='text-gray-400 text-center py-8'>
              No tracks available for this album
            </div>
          )}
        </div>
      </div>
    </Template>
  );
};

export default AlbumDetail;
