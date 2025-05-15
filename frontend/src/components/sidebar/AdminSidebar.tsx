import { FC } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Tag,
  Package,
  Users,
  Receipt,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar: FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed md:static w-64 h-screen top-0 bg-dashboard-primaryDark transform transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className='p-4 border-b border-dashboard-primary'>
        <span className='text-2xl font-bold text-dashboard-secondary md:hidden'>
          Legacy
        </span>
      </div>
      <nav className='p-4'>
        <ul className='space-y-2'>
          <li>
            <Link
              to='/admin'
              className={`flex items-center p-3 rounded-md ${
                location.pathname === "/admin"
                  ? "bg-dashboard-primary text-dashboard-primaryText"
                  : "hover:bg-dashboard-primary text-dashboard-primaryDarkText"
              }`}
            >
              <LayoutDashboard
                size={20}
                className='mr-3 text-dashboard-secondary'
              />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to='/admin/analysis-view'
              className={`flex items-center p-3 rounded-md ${
                location.pathname === "/admin/analysis-view"
                  ? "bg-dashboard-primary text-dashboard-primaryText"
                  : "hover:bg-dashboard-primary text-dashboard-primaryDarkText"
              }`}
            >
              <BarChart2
                size={20}
                className={`mr-3 ${
                  location.pathname === "/admin/analysis-view"
                    ? "text-dashboard-secondary"
                    : ""
                }`}
              />
              Analysis
            </Link>
          </li>
          <li>
            <Link
              to='/admin/genres'
              className={`flex items-center p-3 rounded-md ${
                location.pathname === "/admin/genres"
                  ? "bg-dashboard-primary text-dashboard-primaryText"
                  : "hover:bg-dashboard-primary text-dashboard-primaryDarkText"
              }`}
            >
              <Tag
                size={20}
                className={`mr-3 ${
                  location.pathname === "/admin/genres"
                    ? "text-dashboard-secondary"
                    : ""
                }`}
              />
              Genres
            </Link>
          </li>
          <li>
            <Link
              to='/admin/packages'
              className={`flex items-center p-3 rounded-md ${
                location.pathname === "/admin/packages"
                  ? "bg-dashboard-primary text-dashboard-primaryText"
                  : "hover:bg-dashboard-primary text-dashboard-primaryDarkText"
              }`}
            >
              <Package
                size={20}
                className={`mr-3 ${
                  location.pathname === "/admin/packages"
                    ? "text-dashboard-secondary"
                    : ""
                }`}
              />
              Packages
            </Link>
          </li>
          <li>
            <Link
              to='/admin/purchases'
              className={`flex items-center p-3 rounded-md ${
                location.pathname === "/admin/purchases"
                  ? "bg-dashboard-primary text-dashboard-primaryText"
                  : "hover:bg-dashboard-primary text-dashboard-primaryDarkText"
              }`}
            >
              <Receipt
                size={20}
                className={`mr-3 ${
                  location.pathname === "/admin/purchases"
                    ? "text-dashboard-secondary"
                    : ""
                }`}
              />
              Purchases
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
