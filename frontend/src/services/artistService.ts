import { userAPI } from "./httpService";

export const userArtistList = async ({
  search,
}: {
  search?: string;
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const queryString = params.toString();
    const url = `/artists${queryString ? `?${queryString}` : ""}`;

    const response = await userAPI.get(url);
    return response;
  } catch (error) {
    console.error("userArtistList error:", error);
    throw error;
  }
};

export const getArtistById = async (id: string) => {
  try {
    const response = await userAPI.get(`/artists/${id}`);
    return response;
  } catch (error) {
    console.error("getArtistById error:", error);
    throw error;
  }
};
