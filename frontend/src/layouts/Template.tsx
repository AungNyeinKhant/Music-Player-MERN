import { useState, FC, ReactNode } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";

import Player from "../components/player/Player";

type TemplateProps = { children: ReactNode };
const Template: FC<TemplateProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className='flex h-screen bg-primaryDark text-white'>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header onSidebarOpen={toggleSidebar} />

        {children}
        <Player />
      </div>
    </div>
  );
};

export default Template;
