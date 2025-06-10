import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { UserRoles, type AuthUser } from "../types";
import { useLoginAdminMutation } from "../../../services/auth/authApi";

export default function Login() {
  //Rdirect to dashboard after
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginAdmin, { isLoading, error: loginError }] =
    useLoginAdminMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      const response = await loginAdmin({ email, password }).unwrap();

      console.log("response", response);

      if (!response?.success) {
        throw new Error("Invalid credentials");
      }
      const data = response.data;

      const authUser = data.user;

      const user: AuthUser = {
        id: authUser._id,
        firstname: authUser.firstname,
        lastname: authUser.lastname,
        email: authUser.email,
        role: authUser.role,
        avatarUrl: "/", 
      };

      const token = data.token;

      login(user, token);
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMessage =
        err.data?.message || err.message || "Invalid username or password";
      setLocalError(errorMessage);
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Admin Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2  text-white font-semibold rounded ${
            isLoading
              ? "hover:cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }  transition-colors`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {(localError || loginError) && ( // Display error from local state or RTK Query
          <p className="text-red-500 text-sm mb-4">
            {localError ||
              (loginError as any)?.data?.message ||
              "An unexpected error occurred."}
          </p>
        )}
        <p className="text-sm text-center pt-3 text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </>
  );
}
