import { FC, ReactNode, useState, useEffect } from "react";
import AdminHeader from "../components/header/AdminHeader";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import { useSocket } from "../context/SocketContext";

const AdminDashboard: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { on, off } = useSocket();

  useEffect(() => {
    console.log("Listening for new purchase notifications...");
    on("new_purchase", (notification: any) => {
      //{ packageName: string; price: number }

      alert(
        `New Purchase for ${notification.packageName} with price ${notification.price} MMK. Please check Purchases`
      );
    });

    return () => {
      off("new_purchase");
    };
  }, [on, off]);

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
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <AdminSidebar isSidebarOpen={isSidebarOpen} />

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

export default AdminDashboard;
