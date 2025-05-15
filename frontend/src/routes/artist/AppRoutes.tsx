import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";

import PrivateRoutes from "../PrivateRoutes";
import Home from "../../pages/artist/Home";

import Tracks from "../../pages/artist/Tracks";
import Albums from "../../pages/artist/Albums";
import CreateAlbum from "../../pages/artist/form/CreateAlbum";
import UpdateAlbum from "../../pages/artist/form/UpdateAlbum";
import UpdateTrack from "../../pages/artist/form/UpdateTrack";
import UpdateProfile from "../../pages/artist/form/UpdateProfile";

const ArtistAppRoutes: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/artist/auth/*' element={<AuthRoutes />} />
        <Route
          path='/artist/*'
          element={
            <PrivateRoutes role='artist'>
              <Routes>
                <Route index path='/' element={<Home />} />

                <Route path='/albums' element={<Albums />} />
                <Route path='/albums/create' element={<CreateAlbum />} />
                <Route path='/albums/update/:id' element={<UpdateAlbum />} />

                <Route path='/tracks' element={<Tracks />} />
                <Route path='/track/update/:id' element={<UpdateTrack />} />

                <Route path='/profile' element={<UpdateProfile />} />
              </Routes>
            </PrivateRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default ArtistAppRoutes;
