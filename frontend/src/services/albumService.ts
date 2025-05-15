import { artistAPI, userAPI } from "./httpService";

export const createAlbum = async (albumData: {
  name: string;
  description: string;
  genre_id: string;
  image?: File;
  bg_image?: File;
}) => {
  try {
    const formData = new FormData();
    Object.entries(albumData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await artistAPI.post("/album/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("createAlbum error:", error);
    throw error;
  }
};

export const artistAlbumList = async () => {
  try {
    const response = await artistAPI.get("/albums");
    return response;
  } catch (error) {
    console.error("artistAlbumList error:", error);
    throw error;
  }
};

export const artistGenre = async () => {
  try {
    const response = await artistAPI.get("/genres");
    return response;
  } catch (error) {
    console.error("artistGenre error:", error);
    throw error;
  }
};

export const mostPlayAlbumsCurrent = async () => {
  try {
    const response = await userAPI.get(`/albums/most-played`);
    console.log(response);
    return response;
  } catch (error) {
    console.error("mostPlayAlbumsCurrent error:", error);
    throw error;
  }
};

export const getTracksByAlbumId = async (id: string) => {
  try {
    const response = await userAPI.get(`/albums/${id}/tracks`);
    console.log(response);
    return response;
  } catch (error) {
    console.error("getTracksByAlbumId error:", error);
    throw error;
  }
};

export const userGetTrackByArtist = async (artist_id: string) => {
  try {
    const response = await userAPI.get(`/tracks/artist/${artist_id}`);
    return response;
  } catch (error) {
    console.error("userGetTrackByArtist error:", error);
    throw error;
  }
};
export const userAlbumList = async ({
  artist_id,
  genre_id,
  search,
}: {
  artist_id?: string;
  genre_id?: string;
  search?: string;
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (artist_id) params.append("artist_id", artist_id);
    if (genre_id) params.append("genre_id", genre_id);
    if (search) params.append("search", search);

    const queryString = params.toString();
    const url = `/albums${queryString ? `?${queryString}` : ""}`;

    const response = await userAPI.get(url);
    return response;
  } catch (error) {
    console.error("userAlbumList error:", error);
    throw error;
  }
};
export const getAlbumByArtistId = async (id: string) => {
  try {
    const response = await artistAPI.get(`/albums?artist_id=${id}`);
    return response;
  } catch (error) {
    console.error("artistAlbumList error:", error);
    throw error;
  }
};

export const updateAlbum = async (
  albumId: string,
  albumData: {
    name?: string;
    description?: string;
    genre_id?: string;
    image?: File;
  }
) => {
  try {
    const formData = new FormData();
    Object.entries(albumData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await artistAPI.put(`/album/${albumId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("updateAlbum error:", error);
    throw error;
  }
};

export const getAlbumDetail4Artist = async (id: string) => {
  try {
    const response = await artistAPI.get(`/album/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error("getTracksByAlbumId error:", error);
    throw error;
  }
};

export const deleteAlbum = async (albumId: string) => {
  try {
    const response = await artistAPI.delete(`/album/${albumId}`);
    return response;
  } catch (error) {
    console.error("deleteAlbum error:", error);
    throw error;
  }
};
