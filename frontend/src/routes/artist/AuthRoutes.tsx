import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/artist/auth/Login";
import Register from "../../pages/artist/auth/Register";

const ArtistAuthRoutes: FC = () => {
  return (
    <Routes>
      <Route index path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  );
};

export default ArtistAuthRoutes;
