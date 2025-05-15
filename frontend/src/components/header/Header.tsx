import { FC, useState } from "react";
import { Search,Palette ,Music, Menu, User, Package, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/AuthService";
import Logo from "../../assets/image/music-player-logo.svg";
import defaultProfileImage from "../../assets/image/no-profile.webp";

type HeaderProps = {
  onSidebarOpen: () => void;
};

const Header: FC<HeaderProps> = ({ onSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await logout(auth);
      navigate("/login");
    }
  };

  return (
    <div className='flex items-center justify-between p-4 bg-primaryDark'>
      {/* Mobile Logo and Menu */}
      <div className='flex items-center md:hidden'>
        <button
          onClick={onSidebarOpen}
          className='p-2 hover:bg-[#282828] rounded-full'
        >
          <div className='flex flex-row items-center'>
            <span className='text-secondary text-xl font-bold'>Legacy</span>
            <img
              src={Logo}
              alt='Music Player Logo'
              className='w-[48px] h-[48px]'
            />
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className='flex items-center flex-1 max-w-md mx-4'>
        <form
          className='relative w-full'
          onSubmit={(e) => {
            e.preventDefault();
            const searchInput = e.currentTarget.querySelector("input");
            if (searchInput && searchInput.value.trim()) {
              navigate(
                `/app/search?q=${encodeURIComponent(searchInput.value.trim())}`
              );
            }
          }}
        >
          <input
            type='text'
            placeholder='Search tracks...'
            className='w-full py-2 pl-7 pr-4 text-sm bg-[#282828] text-primaryText rounded-full focus:outline-none focus:ring-1 focus:ring-secondary'
          />
          <button
            type='submit'
            className='absolute right-3 top-1 p-1 hover:bg-[#383838] rounded-full transition-colors'
          >
            <Search className='w-5 h-5 text-gray-400' />
          </button>
        </form>
      </div>

      {/* User Profile */}
      <div className='relative'>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className='flex items-center space-x-2 p-2 rounded-md hover:bg-[#282828] transition-colors'
        >
          <img
            src={auth?.user?.image || defaultProfileImage}
            alt={auth?.user?.name || "User"}
            className='w-8 h-8 rounded-full object-cover'
          />
          <span className='text-primaryText mx-2 hidden sm:block'>
            {auth?.user?.name || "User"}
          </span>
          <ChevronDown size={16} className='text-primaryText' />
        </button>

        {isProfileOpen && (
          <div className='absolute right-0 mt-2 w-48 bg-primaryDark rounded-md shadow-lg py-1 z-10'>
            <button
              className='flex items-center w-full px-4 py-2 text-sm text-primaryText hover:bg-[#282828]'
              onClick={() => navigate("/app/profile")}
            >
              <User size={16} className='mr-2' />
              Profile
            </button>
            <button
              className='flex items-center w-full px-4 py-2 text-sm text-primaryText hover:bg-[#282828]'
              onClick={() => window.location.href = "/artist/auth/register"}
            >
              <Music  size={16} className='mr-2' />
              Register as artist
            </button>
            <button
              className='flex items-center w-full px-4 py-2 text-sm text-primaryText hover:bg-[#282828]'
              onClick={() => navigate("/app/subscription-packages")}
            >
              <Package size={16} className='mr-2' />
              Subscriptions
            </button>
            <button
              className='flex items-center w-full px-4 py-2 text-sm text-primaryText hover:bg-[#282828]'
              onClick={handleLogout}
            >
              <LogOut size={16} className='mr-2' />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
