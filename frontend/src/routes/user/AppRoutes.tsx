import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import PrivateRoutes from "../PrivateRoutes";
import Home from "../../pages/customer/Home";
import Genres from "../../pages/customer/Genres";
import Artists from "../../pages/customer/Artists";
import Albums from "../../pages/customer/Albums";
import Favourates from "../../pages/customer/Favourates";
import RecentlyPlays from "../../pages/customer/RecentlyPlays";
import ArtistDetail from "../../pages/customer/ArtistDetail";
import TrackProvider from "../../context/TrackContext";
import Packages from "../../pages/customer/Packages";
import { PlaylistProvider } from "../../context/PlaylistContext";
import AlbumDetail from "../../pages/customer/AlbumDetail";
import PlaylistDetail from "../../pages/customer/PlaylistDetail";
import GenreTrack from "../../pages/customer/GenreTrack";
import SearchTracks from "../../pages/customer/SearchTracks";
import UpdateProfile from "../../pages/customer/form/UpdateProfile";

const AppRoutes: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/*' element={<AuthRoutes />} />
        <Route
          path='/app/*'
          element={
            <PrivateRoutes role={"user"}>
              <TrackProvider>
                <PlaylistProvider>
                  <Routes>
                    <Route index path='/' element={<Home />} />
                    <Route path='/genres' element={<Genres />} />
                    <Route path='/genre/:id' element={<GenreTrack />} />
                    <Route path='/artists' element={<Artists />} />
                    <Route
                      path='/artist-detail/:id'
                      element={<ArtistDetail />}
                    />
                    <Route path='/albums' element={<Albums />} />
                    <Route path='/album-detail/:id' element={<AlbumDetail />} />
                    <Route path='/favorites' element={<Favourates />} />
                    <Route path='/recent' element={<RecentlyPlays />} />
                    <Route path='/playlist/:id' element={<PlaylistDetail />} />
                    <Route
                      path='/subscription-packages'
                      element={<Packages />}
                    />
                    <Route path='/search' element={<SearchTracks />} />
                    <Route path='/profile' element={<UpdateProfile />} />
                  </Routes>
                </PlaylistProvider>
              </TrackProvider>
            </PrivateRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
