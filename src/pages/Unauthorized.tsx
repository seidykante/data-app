import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page. Admins only.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
