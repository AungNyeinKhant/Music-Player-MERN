import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";

import PrivateRoutes from "../PrivateRoutes";
import Register from "../../pages/admin/auth/Register";
import Home from "../../pages/admin/Home";
import Analysis from "../../pages/admin/Analysis";
import Genres from "../../pages/admin/Genres";
import Packages from "../../pages/admin/Packages";
import Purchases from "../../pages/admin/Purchases";
import Admins from "../../pages/admin/Admins";

import CreatePackage from "../../pages/admin/form/CreatePackage";
import UpdatePackage from "../../pages/admin/form/UpdatePackage";

const AdminAppRoutes: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/admin/auth/*' element={<AuthRoutes />} />
        <Route
          path='/admin/*'
          element={
            <PrivateRoutes role='admin'>
              <Routes>
                <Route path='/register' element={<Register />} />

                <Route index path='/' element={<Home />} />
                <Route path='/analysis-view' element={<Analysis />} />
                <Route path='/genres' element={<Genres />} />
                <Route path='/packages' element={<Packages />} />
                <Route path='/packages/create' element={<CreatePackage />} />
                <Route path='/packages/update/:id' element={<UpdatePackage />} />
                <Route path='/purchases' element={<Purchases />} />
                <Route path='/admins' element={<Admins />} />
              </Routes>
            </PrivateRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default AdminAppRoutes;
