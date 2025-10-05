import React, { useState, useEffect} from 'react';
import { useForm } from '@inertiajs/react';

const AuthModal = ({ mode, onClose, switchMode, content }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    content: content , // Initialize with the content prop
  });

  const [success, setSuccess] = useState("");

  useEffect(() => {
    setData('content', content);
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");

    const endpoint = mode === "login" ? "/login" : "/register";

    post(endpoint, {
      onSuccess: () => {
        setSuccess(
          mode === "login"
            ? "Login successful!"
            : "Registration successful!"
        );

        if (mode === "register") {
          reset();
        }
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-sm bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background gradient */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500 rounded-full opacity-10"></div>

        {/* Modal header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            {mode === "login" ? "Welcome Back" : "Join Our Community"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors z-10 relative p-0"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Social Login Buttons */}
        <div className="mb-4 sm:mb-6 relative z-10">
          <div className="flex justify-center space-x-2 sm:space-x-3">
            <a
              href="/login/google"
              className="flex items-center justify-center p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Sign in with Google"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                  1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                  3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 
                  7.28-2.66l-3.57-2.77c-.98.66-2.23 
                  1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                  20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                  8.55 1 10.22 1 12s.43 3.45 1.18 
                  4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 
                  4.21 1.64l3.15-3.15C17.45 2.09 
                  14.97 1 12 1 7.7 1 3.99 3.47 
                  2.18 7.07l3.66 2.84c.87-2.6 
                  3.3-4.53 6.16-4.53z"
                />
              </svg>
            </a>
            <a
              href="/login/github"
              className="flex items-center justify-center p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Sign in with GitHub"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#333"
                  d="M12 .297c-6.63 0-12 
                  5.373-12 12 0 5.303 3.438 9.8 
                  8.205 11.385.6.113.82-.258.82-.577 
                  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
                  C4.422 18.07 3.633 17.7 3.633 
                  17.7c-1.087-.744.084-.729.084-.729 
                  1.205.084 1.838 1.236 1.838 
                  1.236 1.07 1.835 2.809 1.305 
                  3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
                  0-1.31.465-2.38 
                  1.235-3.22-.135-.303-.54-1.523.105-3.176 
                  0 0 1.005-.322 3.3 
                  1.23.96-.267 1.98-.399 
                  3-.405 1.02.006 2.04.138 
                  3 .405 2.28-1.552 3.285-1.23 
                  3.285-1.23.645 1.653.24 2.873.12 
                  3.176.765.84 1.23 1.91 1.23 
                  3.22 0 4.61-2.805 5.625-5.475 
                  5.92.42.36.81 1.096.81 
                  2.22 0 1.606-.015 2.896-.015 
                  3.286 0 .315.21.69.825.57C20.565 
                  22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
            </a>
          </div>
          <div className="mt-2 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-xs text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 pb-2">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {mode === "register" && (
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {mode === "register" && (
            <div className="mb-2">
              <label
                htmlFor="password_confirmation"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="••••••••"
                required
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {processing
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>

          <div className="mt-2 text-center text-sm text-gray-600">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
