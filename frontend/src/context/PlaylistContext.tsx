import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createPlaylist,
  getPlaylists,
  playlistHandleTrack,
} from "../services/playlistService";
import { Track } from "../types";

interface PlaylistTrack {
  track_id: string;
  track: Track;
}

interface Playlist {
  id: string;
  name: string;

  playlist_tracks: PlaylistTrack[];
}

interface PlaylistContextType {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  createNewPlaylist: (name: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  refreshPlaylists: () => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({
  children,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPlaylists();
      setPlaylists(response.data.data);
    } catch (err) {
      setError("Failed to fetch playlists");
      console.error("Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const createNewPlaylist = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      await createPlaylist(name);
      await refreshPlaylists();
    } catch (err) {
      setError("Failed to create playlist");
      console.error("Error creating playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
      setLoading(true);
      setError(null);
      await playlistHandleTrack(playlistId, trackId);
      await refreshPlaylists();
    } catch (err) {
      setError("Failed to add track to playlist");
      console.error("Error adding track to playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        loading,
        error,
        createNewPlaylist,
        addTrackToPlaylist,
        refreshPlaylists,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
