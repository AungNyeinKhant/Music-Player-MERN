import { artistAPI, userAPI } from "./httpService";

/**
 * Fetches the current user's profile information
 * @returns Promise with the user profile data
 */
export const getProfileUser = async () => {
  try {
    const response = await userAPI.get("/profile");
    return response;
  } catch (error) {
    console.error("getProfileUser error:", error);
    throw error;
  }
};

/**
 * Updates the current user's profile information
 * @param userData - Object containing user data to update
 * @returns Promise with the updated user profile data
 */
export const updateUser = async (userData: {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  image?: File;
  dob?: string;
}) => {
  try {
    // Use FormData to handle file uploads and text data
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await userAPI.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
};

/**
 * Fetches the artist's profile information
 * @returns Promise with the artist profile data
 */
export const getArtistProfile = async () => {
  try {
    const response = await artistAPI.get("/profile");
    return response;
  } catch (error) {
    console.error("getArtistProfile error:", error);
    throw error;
  }
};

/**
 * Updates the artist's profile information
 * @param artistData - Object containing artist data to update
 * @returns Promise with the updated artist profile data
 */
export const updateArtist = async (artistData: {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  image?: File;
  bg_image?: File;
  dob?: string;
}) => {
  try {
    const formData = new FormData();

    Object.entries(artistData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await artistAPI.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("updateArtist error:", error);
    throw error;
  }
};
