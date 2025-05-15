import { FC } from "react";

import AppRoutes from "./routes/user/AppRoutes";
import ArtistAppRoutes from "./routes/artist/AppRoutes";
import AdminAppRoutes from "./routes/admin/AppRoutes";
import AuthProvider from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

const App: FC = () => {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <ArtistAppRoutes />
          <AdminAppRoutes />
        </SocketProvider>
      </AuthProvider>
    </>
  );
};

export default App;
