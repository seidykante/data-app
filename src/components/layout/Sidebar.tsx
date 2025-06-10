import { NavLink } from "react-router-dom";
import { LayoutDashboard, UserRound, LogOut } from "lucide-react";
import useAuth from "../../features/auth/hooks/useAuth";

const logoUrl = "/logo.png";

const Sidebar = () => {
  const { logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "text-gray-600 hover:bg-primary-light hover:text-primary"
    }`;

  return (
    <aside className="w-64 bg-gray-100 p-6 flex flex-col shadow-lg">
      <div className="flex items-center space-x-2 mb-10">
        <NavLink to="/">
          <img
            src={logoUrl}
            alt="Medix Bot Logo"
            className="h-full w-full rounded-lg"
            onError={
              (e) =>
                (e.currentTarget.src = `https://placehold.co/50x50/FF00CC/FFFFFF?text=MB`) // Placeholder for error handling
            }
          />{" "}
        </NavLink>
      </div>
      <nav className="flex-1">
        <ul>
          <li className="mb-3">
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/admin/users" className={navLinkClass}>
              <UserRound size={20} />
              <span>Users</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 my-10 py-4 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 w-full transition-colors duration-150 ease-in-out"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
