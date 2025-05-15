import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/admin/auth/Login";

const AdminAuthRoutes: FC = () => {
  return (
    <Routes>
      <Route index path='/login' element={<Login />} />
    </Routes>
  );
};

export default AdminAuthRoutes;
