"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import {
  Leaf,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";

const LoginPage = () => {
  const router = useRouter();
  const [isFarmer, setIsFarmer] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const login = useAuthStore((state) => state.login);

  const farmerLogin = api.auth.farmerLogin.useMutation();
  const organicFarmerLogin = api.auth.organicFarmerLogin.useMutation();

  const handleFarmerTypeSwitch = () => {
    setIsTransitioning(true);
    setError("");
    setTimeout(() => {
      setIsFarmer(!isFarmer);
      setIsTransitioning(false);
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate fields
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      let result;

      if (isFarmer) {
        result = await farmerLogin.mutateAsync({
          usernameOrEmail: usernameOrEmail.trim(),
          password,
        });
      } else {
        result = await organicFarmerLogin.mutateAsync({
          usernameOrEmail: usernameOrEmail.trim(),
          password,
        });
      }

      if (result.success && result.user) {
        login(
          {
            id: result.user.id,
            email: result.user.email as string,
            type: isFarmer ? "FARMER" : "ORGANIC_FARMER",
            username: result.user.username,
          },
          result.token,
        );

        router.push(isFarmer ? "/farmer/events" : "/organic_farmer/events");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  const isLoading = farmerLogin.isPending || organicFarmerLogin.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-500 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl shadow-2xl backdrop-blur-sm md:grid-cols-2"
      >
        {/* Left side - Enhanced Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative hidden bg-gradient-to-br from-emerald-600 to-emerald-800 md:block"
        >
          <div
            className={`transition-opacity duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}
          >
            <Image
              src={isFarmer ? "/farmers1.png" : "/farmers2.png"}
              alt={
                isFarmer
                  ? "Farmer working in field"
                  : "Organic farmer harvesting"
              }
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-emerald-700/30" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
              className="absolute top-1/3 -left-20 h-60 w-60 rounded-full bg-emerald-300/20 blur-3xl"
            />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md">
                <Leaf className="h-8 w-8 text-emerald-100" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AgreReform</h2>
                <p className="text-sm text-emerald-100/80">
                  Farm Management System
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className={`transition-all duration-300 ${isTransitioning ? "translate-x-4 transform opacity-50" : ""}`}
            >
              <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isFarmer ? "Regular Farmer Portal" : "Organic Farmer Portal"}
              </div>
              <h3 className="mb-4 text-4xl leading-tight font-bold">
                Welcome back,
                <br />
                <span className="text-emerald-200">
                  {isFarmer ? "Farmer" : "Organic Farmer"}
                </span>
              </h3>
              <p className="text-lg leading-relaxed text-emerald-100/90">
                {isFarmer
                  ? "Access your comprehensive farming dashboard to manage activities, track resources, and optimize your agricultural operations."
                  : "Manage your organic farming operations, monitor fertilizer classifications, and maintain sustainable practices."}
              </p>
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex items-center gap-3 text-sm text-emerald-100/80"
            >
              <div className="h-px w-12 bg-emerald-300/50" />
              <span>Northwest Samar State University</span>
              <div className="h-px flex-1 bg-emerald-300/50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Enhanced Form */}
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
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-700">
                  AgreReform
                </h2>
                <p className="text-sm text-gray-500">Farm Management</p>
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
            <div
              className={`transition-all duration-300 ${isTransitioning ? "scale-95 transform opacity-50" : ""}`}
            >
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                {isFarmer ? "Farmer Login" : "Organic Farmer Login"}
              </h2>
              <p className="text-gray-600">
                Sign in to access your{" "}
                {isFarmer ? "farming" : "organic farming"} dashboard
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleFarmerTypeSwitch}
              disabled={isLoading}
              className="group mt-6 inline-flex items-center rounded-full border border-emerald-200/50 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all duration-200 hover:from-emerald-100 hover:to-green-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              {isFarmer
                ? "Switch to Organic Farmer"
                : "Switch to Regular Farmer"}
            </motion.button>
          </motion.div>

          {/* Enhanced Error Display */}
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

          {/* Enhanced Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-semibold text-gray-700"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
                  placeholder="Enter your username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
                onClick={() => {
                  /* Handle forgot password */
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Enhanced Submit Button */}
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
                    Sign in as {isFarmer ? "Farmer" : "Organic Farmer"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </motion.form>

          {/* Registration Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 font-medium text-gray-500">
                  Dont have an account?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="h-12 w-full transform rounded-xl border-2 border-emerald-500 font-semibold text-emerald-600 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-50 hover:text-emerald-700 active:scale-98"
                onClick={() =>
                  router.push(
                    isFarmer ? "/registrations" : "/organic-registrations",
                  )
                }
                disabled={isLoading}
              >
                <User className="mr-2 h-4 w-4" />
                Register as {isFarmer ? "Farmer" : "Organic Farmer"}
              </Button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 border-t border-gray-200 pt-6 text-center"
          >
            <p className="text-xs leading-relaxed text-gray-500">
              By signing in, you agree to our{" "}
              <button className="font-medium text-emerald-600 hover:text-emerald-700">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="font-medium text-emerald-600 hover:text-emerald-700">
                Privacy Policy
              </button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
