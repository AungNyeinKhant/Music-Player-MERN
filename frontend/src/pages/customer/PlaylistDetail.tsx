import { FC, useState, useEffect } from "react";
import Template from "../../layouts/Template";
import MusicCard from "../../components/cards/MusicCard";
import { Track, TrackContextType } from "../../types";
import { useParams } from "react-router-dom";
import { usePlaylist } from "../../context/PlaylistContext";
import { useTrack } from "../../context/TrackContext";

const PlaylistDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playlists, loading: playlistsLoading } = usePlaylist();
  const chosenTracks: TrackContextType | null = useTrack();
  const [playlist, setPlaylist] = useState<{
    id: string;
    name: string;
    playlist_tracks: {
      track: Track;
    }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setError(null);
    
    const foundPlaylist = playlists.find((p) => p.id === id);
    
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
    } else {
      setError("Playlist not found");
    }
  }, [id, playlists]);

  const handleTrackClick = (track: Track) => {
    if (!playlist) return;
    
    // Extract all tracks from the playlist for the queue
    const allTracks = playlist.playlist_tracks.map(item => item.track);
    
    chosenTracks?.setChosenTrack({
      playTrack: track,
      queTracks: allTracks,
    });
  };

  return (
    <Template>
      <div className="h-[calc(100vh-80px)] overflow-y-auto pb-20">
        <div className="container mx-auto px-4 py-8">
          {playlistsLoading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : playlist ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-primaryText mb-2">
                  {playlist.name}
                </h1>
                <p className="text-gray-400">
                  {playlist.playlist_tracks.length} tracks
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {playlist.playlist_tracks.map((t) => (
                  <MusicCard 
                    key={t.track.id} 
                    track={t.track} 
                    onClick={handleTrackClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              Playlist not found
            </div>
          )}
        </div>
      </div>
    </Template>
  );
};

export default PlaylistDetail;
