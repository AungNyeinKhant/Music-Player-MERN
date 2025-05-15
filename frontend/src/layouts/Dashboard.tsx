import { FC, ReactNode, useState } from "react";
import DashHeader from "../components/header/DashHeader";
import DashSidebar from "../components/sidebar/DashSidebar";

const Dashboard: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex flex-col h-screen bg-dashboard-primary text-dashboard-primaryText'>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <DashHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <DashSidebar isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className='flex-1 p-4 md:p-6 overflow-auto'>{children}</main>
      </div>

      {/* Footer */}
      <footer className='p-4 bg-dashboard-primaryDark text-dashboard-primaryDarkText text-center'>
        <p>@2025 Legacy Music Entertainment &copy; Copyright by ANK</p>
      </footer>
    </div>
  );
};

export default Dashboard;
