import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  useLoginAdminMutation,
  useRegisterAdminMutation,
} from "../../../services/auth/authApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // RTK Query hooks for register and login mutations
  const [registerAdmin, { isLoading: isRegistering, error: registerError }] =
    useRegisterAdminMutation();
  const [loginAdmin, { isLoading: isLoggingIn, error: loginError }] =
    useLoginAdminMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const [firstname, lastname] = name.split(" ");

    try {
      const registerResponse = await registerAdmin({
        email,
        firstname: firstname || "Admin",
        lastname: lastname || "",
        phone: "0000000000", // Or ask user for phone input
        password,
      }).unwrap();

      if (!registerResponse?.success) {
        throw new Error("Registration failed");
      }

      // You can directly log in after registration (optional)
      try {
        const loginResponse = await loginAdmin({ email, password }).unwrap();
        const data = loginResponse.data;

        const newUser = {
          id: data.id,
          name: `${data.firstname} ${data.lastname}`,
          email: data.email,
          role: data.role,
          avatarUrl: "/public/profile.jpg",
        };
        const token = data.token;
        login(newUser, token); // Update AuthContext
        navigate("/admin/dashboard");
      } catch (loginErr: any) {
        setLocalError(
          loginErr.data?.message ||
            "Registration successful, but automatic login failed. Please try logging in manually."
        );
        console.error("Auto-login error after registration:", loginErr);
        navigate("/login"); // Redirect to login if auto-login fails
      }
    } catch (err) {
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setLocalError(errorMessage);
      console.error("Register error:", err);
    }
  };

  const isSubmitting = isRegistering || isLoggingIn;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Admin Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2  text-white font-semibold rounded ${
            isSubmitting
              ? "hover:cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }  transition-colors`}
          disabled={isSubmitting}
        >
          {isRegistering
            ? "Registering..."
            : isLoggingIn
            ? "Logging in..."
            : "Register"}
        </button>

        {(localError || registerError || loginError) && (
          <p className="text-red-500 text-sm mb-4">
            {localError ||
              (registerError as any)?.data?.message ||
              (loginError as any)?.data?.message ||
              "An unexpected error occurred."}
          </p>
        )}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </>
  );
}
