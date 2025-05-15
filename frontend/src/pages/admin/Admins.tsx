import { FC } from "react";
import AdminDashboard from "../../layouts/AdminDashboard";

const Admins: FC = () => {
  return (
    <AdminDashboard>
      <div className='bg-dashboard-primary p-4 md:p-8 rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold mb-6'>
          Welcome from admin Dashboard
        </h1>
        <p className='text-dashboard-primaryDarkText'>
          Manage your music, albums, and tracks from this dashboard.
        </p>
      </div>
    </AdminDashboard>
  );
};

export default Admins;
