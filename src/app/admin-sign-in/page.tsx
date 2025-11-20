"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import Head from "next/head";

const AdminLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const adminLogin = api.auth.adminLogin.useMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const result = await adminLogin.mutateAsync({
        username: username.trim(),
        password,
      });
      if (result.success && result.user) {
        login(
          {
            id: result.user.id,
            type: "ADMIN",
            username: result.user.username,
          },
          result.token,
        );

        router.push("/admin/dashboard");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const isLoading = adminLogin.isPending;

  return (
    <>
      <Head>
     
          <title>
            FARMER TITLE
          </title>
   
          <title>PasaJob | Seeker</title>
  

            <meta property="og:title" content={"OG TITLE CONTENT"} />
            <meta property="og:description" content={"OG DESCRIPTION"} />
            <meta
                name="keywords"
                content={`KEYWORDS`}
            />
            <meta property="og:author" content={"AUTHOR"} />
            <meta
                property="og:image"
                content={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqC8wvz4gS3CIvkKZ-DBq0PbSeV2xn1Nhzo_6Jl5ZHbsQ-EZludTh0kQXbTjsReBzh6H0mKraNUXi4ArEW1DlzMEtFokzNc5RaKuUukno&s=10"}
            />
            <link rel="icon" href="/favicon.ico" />      
      </Head>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl shadow-2xl backdrop-blur-sm md:grid-cols-2"
      >
        {/* Left side - Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative hidden bg-gradient-to-br from-emerald-600 to-emerald-800 md:block"
        >
          <Image
            src="/farmers5.png"
            alt="Admin working"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-emerald-700/30" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md">
                <Shield className="h-8 w-8 text-emerald-100" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
                <p className="text-sm text-emerald-100/80">
                  Access the administration dashboard
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Admin Portal
              </div>
              <h3 className="mb-4 text-4xl leading-tight font-bold">
                Welcome back,
                <br />
                <span className="text-emerald-200">Admin</span>
              </h3>
              <p className="text-lg leading-relaxed text-emerald-100/90">
                Access the administration dashboard to manage and oversee system
                operations.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex items-center gap-3 text-sm text-emerald-100/80"
            >
              <div className="h-px w-12 bg-emerald-300/50" />
              <span>Department of Agriculture</span>
              <div className="h-px flex-1 bg-emerald-300/50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/95 p-8 backdrop-blur-sm sm:p-12"
        >
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-8 flex justify-center md:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-700">
                  Admin Portal
                </h2>
                <p className="text-sm text-gray-500">Administration</p>
              </div>
            </div>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="text-gray-600">
              Sign in to access your administration dashboard
            </p>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="animate-in slide-in-from-top-2 mb-6 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <div className="flex items-start">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border border-gray-300 py-3 pr-12 pl-10 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors duration-200 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="h-12 w-full transform rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl active:scale-98 disabled:transform-none disabled:hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in as Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="mt-8 border-t border-gray-200 pt-6 text-center"
          >
            <p className="text-xs leading-relaxed text-gray-500">
              Restricted access. Unauthorized use prohibited.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default AdminLoginPage;
