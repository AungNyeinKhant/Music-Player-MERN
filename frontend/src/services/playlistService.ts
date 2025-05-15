import { userAPI } from "./httpService";

export const createPlaylist = async (name: string) => {
  try {
    const response = await userAPI.post("/playlists", { name });
    return response;
  } catch (error) {
    console.error("createPlaylist error:", error);
    throw error;
  }
};

export const getPlaylists = async () => {
  try {
    const response: any = await userAPI.get("/playlists");
    return response;
  } catch (error) {
    console.error("getPlaylists error:", error);
    throw error;
  }
};

export const editPlaylist = async (id: string, name: string) => {
  try {
    const response = await userAPI.put(`/playlists/${id}`, { name });
    return response;
  } catch (error) {
    console.error("editPlaylist error:", error);
    throw error;
  }
};

export const deletePlaylist = async (id: string) => {
  try {
    const response = await userAPI.delete(`/playlists/${id}`);
    return response;
  } catch (error) {
    console.error("deletePlaylist error:", error);
    throw error;
  }
};

export const playlistHandleTrack = async (
  playlist_id: string,
  track_id: string
) => {
  try {
    const response = await userAPI.post(`/playlists/handle-track`, {
      track_id,
      playlist_id,
    });
    return response;
  } catch (error) {
    console.error("playlistHandleTrack error:", error);
    throw error;
  }
};
