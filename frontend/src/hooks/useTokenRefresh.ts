import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRefreshToken, clearRefreshToken } from "../utils/crypto";
import { userAPI, artistAPI, adminAPI } from "../services/httpService";
import socketService from "../services/socketService";

type Role = "user" | "artist" | "admin";

export const useTokenRefresh = (role: Role) => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const refreshToken = getRefreshToken(role);
      if (!refreshToken) return;

      try {
        const api =
          role === "user" ? userAPI : role === "artist" ? artistAPI : adminAPI;
        const response: any = await userAPI.post("/auth/refresh-token", {
          refreshToken,
        });

        if (response?.data?.data?.accessToken) {
          const accessToken = response.data.data.accessToken;
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // Set WebSocket authentication token

          socketService.setAuthToken(accessToken);

          // Set user in auth context

          auth?.setUser({
            id: response.data.data.userId,
            image: response.data.data.image,
            role: response.data.data.role,
            name: response.data.data.name,
          });

          // Navigate to appropriate dashboard
          const dashboardPath = role === "user" ? "/app" : `/${role}`;
          navigate(dashboardPath);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear invalid tokens
        clearRefreshToken(role);

        const api =
          role === "user" ? userAPI : role === "artist" ? artistAPI : adminAPI;
        api.defaults.headers.common["Authorization"] = "";
        // Clear WebSocket authentication token
        if (role === "user" || role === "admin") {
          socketService.setAuthToken(null);
        }
      }
    };

    checkAndRefreshToken();
  }, [role, auth]);
};
