import { FC, useState, useEffect } from "react";
import { artistAlbumList } from "../../services/albumService";
import { deleteTrack, findTracksByAlbumId } from "../../services/trackService";
import Dashboard from "../../layouts/Dashboard";
import { Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import CreateTrack from "./form/CreateTrack";

type Track = {
  id: string;
  name: string;
  audio: string;
  genre_id: string;
  album_id: string;
  artist_id: string;
  listen_count: number;
  description: string;
  created_at: string;
  artist: {
    name: string;
    image: string;
  };
  genre: {
    name: string;
  };
  album: {
    name: string;
    image: string;
  };
};

type Album = {
  id: string;
  name: string;
  genre_id: string;
};

const Tracks: FC = () => {
  const navigate = useNavigate();
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);

  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response: any = await artistAlbumList();
        if (response.data.success) {
          setAlbums(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  useEffect(() => {
    const fetchTracks = async () => {
      if (selectedAlbum) {
        try {
          const response: any = await findTracksByAlbumId(selectedAlbum);

          if (response.data.success) {
            setTracks(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching tracks:", error);
        }
      } else {
        setTracks([]);
      }
    };

    fetchTracks();
  }, [selectedAlbum]);

  const handleRowClick = (id: string) => {
    navigate(`/artist/track/update/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    if (window.confirm(`Do you want to delete ${track.name}?`)) {
      try {
        const response: any = await deleteTrack(track.id);
        if (response.data.success) {
          setTracks(tracks.filter((t) => t.id !== track.id));
        }
      } catch (error) {
        console.error("Error deleting track:", error);
      }
    }
  };

  return (
    <Dashboard>
      <div className='bg-dashboard-primary rounded-lg shadow-lg p-6'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-dashboard-primaryText mb-2'>
            Tracks
          </h1>
          <p className='text-dashboard-primaryText opacity-80 mb-4'>
            Choose an album
          </p>
          <div className='flex gap-4 items-center'>
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className='bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
            >
              <option value=''>Choose album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              ))}
            </select>
            <button
              // to={`/artist/tracks/create?albumId=${selectedAlbum}`}
              className={`flex items-center gap-2 ${
                selectedAlbum
                  ? "bg-dashboard-secondary"
                  : "bg-gray-500 cursor-not-allowed"
              } text-white px-4 py-2 rounded-md transition-colors`}
              onClick={(e) => {
                e.preventDefault();
                if (selectedAlbum) {
                  setShowModal(true);
                }
              }}
            >
              <Plus size={18} />
              Create Track
            </button>
            <Modal
              title='Create Track'
              showModal={showModal}
              setShowModal={setShowModal}
            >
              <CreateTrack selectedAlbum={selectedAlbum} albums={albums} />
            </Modal>
          </div>
        </div>

        <div className='overflow-x-auto  overflow-y-auto'>
          <table className='w-full border-collapse min-w-[800px]'>
            <thead>
              <tr className='bg-dashboard-primaryDark text-dashboard-primaryText border-b border-dashboard-accent border-opacity-20'>
                <th className='text-left py-3 px-4'>Name</th>
                <th className='text-left py-3 px-4'>Genre</th>
                <th className='text-left py-3 px-4'>Description</th>
                <th className='text-left py-3 px-4'>Audio</th>
                <th className='text-left py-3 px-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr
                  key={track.id}
                  onClick={() => handleRowClick(track.id)}
                  className='border-b border-dashboard-accent border-opacity-10 hover:bg-dashboard-primaryDark cursor-pointer transition-colors'
                >
                  <td className='py-3 px-4 text-dashboard-primaryText'>
                    {track.name}
                  </td>
                  <td className='py-3 px-4 text-dashboard-primaryText'>
                    {track.genre.name}
                  </td>
                  <td className='py-3 px-4 text-dashboard-primaryText'>
                    <div className='line-clamp-2'>{track.description}</div>
                  </td>
                  <td className='py-3 px-4 text-dashboard-primaryText'>
                    <audio controls className='h-8'>
                      <source src={track.audio} type='audio/mpeg' />
                      Your browser does not support the audio element.
                    </audio>
                  </td>
                  <td className='py-3 px-4 text-dashboard-primaryText'>
                    <button
                      onClick={(e) => handleDelete(e, track)}
                      className='text-red-500 hover:text-red-700 transition-colors'
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dashboard>
  );
};

export default Tracks;
