import { adminAPI, artistAPI } from "./httpService";

// Play Analytics
export const getPlayAnalytics = async (date: string, type?: string) => {
  try {
    const response = await adminAPI.get(
      `/analytics/plays?date=${date}&type=${type}`
    );
    return response.data;
  } catch (error) {
    console.error("getPlayAnalytics error:", error);
    throw error;
  }
};

// Purchase Analytics
export const getPurchaseAnalytics = async (date: string, type?: string) => {
  try {
    const response = await adminAPI.get(
      `/analytics/purchases?date=${date}${type ? `&type=${type}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("getPurchaseAnalytics error:", error);
    throw error;
  }
};

// Genre Analytics
export const getGenreAnalytics = async (date: string) => {
  try {
    const response = await adminAPI.get(
      `/analytics/genres?date=${date}&type=yearly`
    );
    return response.data;
  } catch (error) {
    console.error("getGenreAnalytics error:", error);
    throw error;
  }
};

// Album Analytics
export const getAlbumAnalytics = async (date: string) => {
  try {
    const response = await adminAPI.get(
      `/analytics/albums?date=${date}&type=yearly`
    );
    return response.data;
  } catch (error) {
    console.error("getAlbumAnalytics error:", error);
    throw error;
  }
};

// Artist Analytics
export const getArtistAnalytics = async (date: string) => {
  try {
    const response = await adminAPI.get(
      `/analytics/artists?date=${date}&type=yearly`
    );
    return response.data;
  } catch (error) {
    console.error("getArtistAnalytics error:", error);
    throw error;
  }
};

// Artist's analytics for their own dashboard
export const getArtistPlayAnalytics = async (
  date: string,
  type: string = "monthly"
) => {
  try {
    const response = await artistAPI.get(
      `/analytics/plays?date=${date}&type=${type}`
    );
    return response;
  } catch (error) {
    console.error("getArtistPlayAnalytics error:", error);
    throw error;
  }
};

// Get monthly total analytics
export const getMonthlyTotalAnalytics = async () => {
  try {
    const response = await adminAPI.get("analytics/monthly-total");
    return response;
  } catch (error) {
    console.error("getMonthlyTotalAnalytics error:", error);
    throw error;
  }
};
