import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI, artistAPI, adminAPI } from "../services/httpService";

type PrivateRouteProps = {
  role: "user" | "artist" | "admin";
  children: ReactNode;
};

export type JwtPayload = {
  userId: string;
  role: string;
};

export const PrivateRoutes: FC<PrivateRouteProps> = ({
  children,
  role,
}: PrivateRouteProps) => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Setup response interceptors for handling 403 errors
    const setupInterceptors = (api: typeof userAPI) => {
      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 403) {
            if (role === "user") {
              navigate("/app/subscription-packages", { replace: true });
            }
            /*
            else if (role === "artist") {
              navigate("/artist/auth/login", { replace: true });
            } else if (role === "admin") {
              navigate("/admin/auth/login", { replace: true });
            }
              */
          }
          return Promise.reject(error);
        }
      );
    };

    // Setup interceptors for all API instances
    setupInterceptors(userAPI);
    setupInterceptors(artistAPI);
    setupInterceptors(adminAPI);

    if (role == "user" && auth?.user?.role !== role) {
      navigate("/login", { replace: true });
    } else if (role == "artist" && auth?.user?.role !== role) {
      //artist login
      navigate("/artist/auth/login", { replace: true });
    } else if (role == "admin" && auth?.user?.role !== role) {
      //artist login
      navigate("/admin/auth/login", { replace: true });
    }
  }, [navigate, auth]);

  return children;
};

export default PrivateRoutes;
