import React, { FC } from "react";
import { ChevronDown, LogOut, Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/AuthService";
import defaultProfileImage from "../../assets/image/no-profile.webp";

const DashHeader: FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isSidebarOpen, setIsSidebarOpen, isProfileOpen, setIsProfileOpen }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await logout(auth);
      navigate("/artist/auth/login");
    }
  };

  return (
    <header className='flex items-center justify-between p-4 bg-dashboard-primaryDark shadow-md'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='md:hidden p-2 hover:bg-dashboard-primary rounded-lg'
        >
          {isSidebarOpen ? (
            <X className='w-6 h-6 text-dashboard-secondary' />
          ) : (
            <Menu className='w-6 h-6 text-dashboard-secondary' />
          )}
        </button>
        <div className='text-2xl font-bold text-dashboard-secondary'>
          Legacy
        </div>
      </div>

      <div className='relative'>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className='flex items-center space-x-2 p-2 rounded-md hover:bg-dashboard-primary transition-colors'
        >
          <img
            src={auth?.user?.image || defaultProfileImage}
            alt={auth?.user?.name || "Artist"}
            className='w-8 h-8 rounded-full object-cover'
          />
          <span>{auth?.user?.name || "Artist"}</span>
          <ChevronDown size={16} />
        </button>

        {isProfileOpen && (
          <div className='absolute right-0 mt-2 w-48 bg-dashboard-primaryDark rounded-md shadow-lg py-1 z-10'>
            <button
              className='flex items-center w-full px-4 py-2 text-sm text-dashboard-primaryText hover:bg-dashboard-primary'
              onClick={() => navigate("/artist/profile")}
            >
              <User size={16} className='mr-2' />
              Profile
            </button>
            <button
              className='flex items-center w-full px-4 py-2 text-sm text-dashboard-primaryText hover:bg-dashboard-primary'
              onClick={handleLogout}
            >
              <LogOut size={16} className='mr-2' />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashHeader;
