import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Template from "../../layouts/Template";
import MusicCard from "../../components/cards/MusicCard";
import PlaylistCard from "../../components/cards/PlaylistCard";

import { getArtistById } from "../../services/artistService";
import { getTrackByArtistById } from "../../services/trackService";
import { userAlbumList } from "../../services/albumService";
import { Artist4User, Track, PlaylistCard as Album } from "../../types";
import NoImage from "../../assets/image/no-album-image.svg";
import { useTrack } from "../../context/TrackContext";

const ArtistDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"tracks" | "albums">("tracks");
  const [artist, setArtist] = useState<Artist4User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const chosenTracks = useTrack();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistAndTracks = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const [artistResponse, tracksResponse, albumsResponse]: any =
          await Promise.all([
            getArtistById(id),
            getTrackByArtistById(id),
            userAlbumList({ artist_id: id }),
          ]);
        setArtist(artistResponse.data.data);
        setTracks(tracksResponse.data.data || []);
        setAlbums(albumsResponse.data.data || []);
      } catch (err) {
        setError("Failed to load artist details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndTracks();
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

  if (error || !artist) {
    return (
      <Template>
        <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 flex items-center justify-center'>
          <div className='text-red-500'>{error || "Artist not found"}</div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        {/* Artist Header Section */}
        <div className='relative mb-20'>
          <div className='relative h-[300px] w-full'>
            <img
              src={artist.bg_image || NoImage}
              alt={`${artist.name} Cover`}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black bg-opacity-30'></div>
          </div>

          {/* Profile Image */}
          <div className='absolute -bottom-16 left-8 flex items-end gap-6'>
            <div className='relative'>
              <img
                src={artist.image || NoImage}
                alt={`${artist.name} Profile`}
                className='w-36 h-36 rounded-full object-cover border-4 border-black'
              />
            </div>
            <div className='mb-4'>
              <h1 className='text-4xl font-bold text-white mb-2'>
                {artist.name}
              </h1>
              <p className='text-gray-200'>
                {/* {artist.monthly_listeners.toLocaleString()} monthly listeners */}
              </p>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className='mb-8'>
          <div className='flex gap-8 border-b border-gray-700'>
            <button
              onClick={() => setActiveTab("tracks")}
              className={`pb-4 font-medium text-sm transition-colors ${
                activeTab === "tracks"
                  ? "text-white border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tracks
            </button>
            <button
              onClick={() => setActiveTab("albums")}
              className={`pb-4 font-medium text-sm transition-colors ${
                activeTab === "albums"
                  ? "text-white border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Albums
            </button>
          </div>
        </div>

        <div>
          {activeTab === "tracks" ? (
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {tracks.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  onClick={() => handleTrackClick(track)}
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
              {albums.map((album) => (
                <PlaylistCard
                  onClick={() => {
                    navigate(`/app/album-detail/${album.id}`);
                  }}
                  key={album.id}
                  playlist={album}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Template>
  );
};

export default ArtistDetail;
