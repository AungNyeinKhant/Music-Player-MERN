import React, { useState } from "react";
import { usePlaylist } from "../../context/PlaylistContext";
import { X } from "lucide-react";
import { Track } from "../../types";
import { playlistHandleTrack } from "../../services/playlistService";

interface AddToPlaylistProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
}

const AddToPlaylist: React.FC<AddToPlaylistProps> = ({
  isOpen,
  onClose,
  track,
}) => {
  const { playlists, refreshPlaylists } = usePlaylist();
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>(() => {
    return playlists
      .filter((playlist) =>
        playlist.playlist_tracks.some((pt) => pt.track_id === track.id)
      )
      .map((playlist) => playlist.id);
  });
  const [initialPlaylists, setInitialPlaylists] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setInitialPlaylists(selectedPlaylists);
  }, []);

  const handleCheckboxChange = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const addedPlaylists = selectedPlaylists.filter(
        (id) => !initialPlaylists.includes(id)
      );
      const removedPlaylists = initialPlaylists.filter(
        (id) => !selectedPlaylists.includes(id)
      );

      const changes = [...addedPlaylists, ...removedPlaylists];
      await Promise.all(
        changes.map(async (playlistId) => {
          await playlistHandleTrack(playlistId, track.id);
        })
      );
      await refreshPlaylists();
      onClose();
    } catch (error) {
      console.error("Error updating playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-primaryDark rounded-lg w-full max-w-md p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-primaryText text-xl font-bold'>
            Add to Playlist
          </h2>
          <button
            onClick={onClose}
            className='p-1 hover:bg-[#282828] rounded-lg'
          >
            <X className='w-6 h-6 text-gray-400 hover:text-primaryText' />
          </button>
        </div>

        <div className='max-h-60 overflow-y-auto custom-scrollbar'>
          {playlists.map((playlist) => (
            <label
              key={playlist.id}
              className='flex items-center space-x-3 p-3 hover:bg-[#282828] rounded-lg cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedPlaylists.includes(playlist.id)}
                onChange={() => handleCheckboxChange(playlist.id)}
                className='w-4 h-4 accent-secondary'
              />
              <span className='text-primaryText'>{playlist.name}</span>
            </label>
          ))}
        </div>

        <div className='mt-6 flex justify-end space-x-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-400 hover:text-primaryText'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylist;
