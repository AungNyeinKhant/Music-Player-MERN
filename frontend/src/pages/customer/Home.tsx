import { FC, useState, useEffect } from "react";
import MusicCard from "../../components/cards/MusicCard";
import PlaylistCard from "../../components/cards/PlaylistCard";
import AddToPlaylist from "./AddToPlaylist";
import {
  Track,
  PlaylistCard as PlaylistCardType,
  TrackContextType,
} from "../../types";
import NoImage from "../../assets/image/no-album-image.svg";

import { MoreVertical } from "lucide-react";
import Template from "../../layouts/Template";
import {
  recentTracks,
  newTrendingTracksServ,
  mostPlayedTracksServ,
} from "../../services/trackService";
import { mostPlayAlbumsCurrent } from "../../services/albumService";
import { useTrack } from "../../context/TrackContext";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();
  const chosenTracks: TrackContextType | null = useTrack();
  const [recentPlayTracks, setRecentPlayTracks] = useState<Track[]>([]);
  const [newTrendingTracks, setNewTrendingTracks] = useState<Track[] | null>(
    null
  );
  const [mostPlayedTracks, setMostPlayedTracks] = useState<Track[] | null>(
    null
  );
  const [playlists, setPlaylists] = useState<PlaylistCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const fetchRecentTracks = async () => {
    try {
      const response: any = await recentTracks(20);
      if (response.data.success) {
        setRecentPlayTracks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching recent tracks:", error);
    }
  };

  const fetchMostPlayedTracks = async () => {
    try {
      const response: any = await mostPlayedTracksServ(20);
      if (response.data.success) {
        setMostPlayedTracks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching most played tracks:", error);
    }
  };

  const fetchPopularAlbums = async () => {
    setIsLoading(true);
    try {
      const response: any = await mostPlayAlbumsCurrent();
      if (response.data.success) {
        setPlaylists(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching popular albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTracks();
    fetchTrendingTracks();
    fetchMostPlayedTracks();
    fetchPopularAlbums();
  }, []);

  const fetchTrendingTracks = async () => {
    try {
      const response: any = await newTrendingTracksServ(5);
      if (response.data.success) {
        setNewTrendingTracks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching trending tracks:", error);
    }
  };

  const handleTrackClick = (track: Track, trackList: Track[]) => {
    chosenTracks?.setChosenTrack({
      playTrack: track,
      queTracks: trackList,
    });
  };

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <section className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-primaryText text-xl font-bold'>
              Recently plays
            </h2>
            <a
              href='#'
              className='text-gray-400 text-sm hover:text-primaryText'
            >
              {/* See all */}
            </a>
          </div>
          <div className='relative w-full'>
            <div className='flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide'>
              {recentPlayTracks
                ? recentPlayTracks.map((track) => (
                    <div key={track.id} className='flex-none snap-start'>
                      <MusicCard
                        track={track}
                        onClick={(track) =>
                          handleTrackClick(track, recentPlayTracks)
                        }
                      />
                    </div>
                  ))
                : "No recent tracks"}
            </div>
          </div>
        </section>

        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-primaryText mb-4'>
            New Trending Tracks
          </h2>
          <div className='bg-[#181818] rounded-lg p-4'>
            {newTrendingTracks
              ? newTrendingTracks.map((track, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 hover:bg-[#282828] rounded-lg group'
                  >
                    <button
                      className='flex items-center flex-1'
                      onClick={() => handleTrackClick(track, newTrendingTracks)}
                    >
                      <span className='text-gray-400 w-8'>{index + 1}</span>
                      <img
                        src={
                          track.album ? track.album.image || NoImage : NoImage
                        }
                        alt={track.name}
                        className='w-12 h-12 rounded object-cover'
                      />
                      <div className='ml-4'>
                        <h4 className='text-primaryText text-left text-sm'>
                          {track.name}
                        </h4>
                        <p className='text-gray-400 text-left text-xs'>
                          {track?.artist?.name}
                        </p>
                      </div>
                    </button>
                    <div className='flex items-center gap-3'>
                      <span className='text-gray-400 text-sm'>
                        {track.listen_count.toLocaleString()} streams
                      </span>

                      <button
                        onClick={() => {
                          setSelectedTrack(track);
                          setIsAddToPlaylistOpen(true);
                        }}
                        className='w-8 h-8 rounded-full bg-secondary items-center justify-center flex hover:bg-opacity-80'
                      >
                        <MoreVertical className='w-4 h-4 text-primary' />
                      </button>
                    </div>
                  </div>
                ))
              : "No new Tracks"}
          </div>
        </div>

        <section className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-primaryText text-2xl font-bold'>
              Most played tracks of the month
            </h2>
          </div>
          <div className='relative w-full'>
            <div className='flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide'>
              {mostPlayedTracks
                ? mostPlayedTracks.map((track) => (
                    <div key={track.id} className='flex-none snap-start'>
                      <MusicCard
                        track={track}
                        onClick={(track) =>
                          handleTrackClick(track, mostPlayedTracks)
                        }
                      />
                    </div>
                  ))
                : "No recent tracks"}
            </div>
          </div>
        </section>

        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold text-primaryText'>
              Top albums for you
            </h2>
            <a
              href='#'
              className='text-sm text-gray-400 hover:text-primaryText'
            >
              {/* See all */}
            </a>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
            {isLoading ? (
              <div className='col-span-3 text-center text-gray-400 py-8'>
                Loading popular albums...
              </div>
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <PlaylistCard
                  onClick={() => {
                    navigate(`/app/album-detail/${playlist.id}`);
                  }}
                  key={playlist.id}
                  playlist={playlist}
                />
              ))
            ) : (
              <div className='col-span-3 text-center text-gray-400 py-8'>
                No albums found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      {selectedTrack && (
        <AddToPlaylist
          isOpen={isAddToPlaylistOpen}
          onClose={() => {
            setIsAddToPlaylistOpen(false);
            setSelectedTrack(null);
          }}
          track={selectedTrack}
        />
      )}
    </Template>
  );
};

export default Home;
