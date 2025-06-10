import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Medix Bot Logo"
            className="mx-auto mb-6"
            onError={(e) =>
              (e.currentTarget.src = `https://placehold.co/100x100/FF00CC/FFFFFF?text=MB`)
            }
          />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
