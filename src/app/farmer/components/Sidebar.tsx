"use client";
import Link from "next/link";
import { Calendar, AlertCircle, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="hidden border-r border-emerald-200 bg-gradient-to-b from-white via-emerald-50/30 to-white shadow-lg backdrop-blur-sm md:block"
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo/Header */}
        <div className="flex h-14 items-center border-b border-emerald-200 px-4 lg:h-[60px] lg:px-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group flex items-center space-x-3"
          >
                  <div className="relative group my-4">
  <div className="absolute -inset-3 rounded-full bg-emerald-500 opacity-20 blur-lg transition-all duration-300 group-hover:opacity-40 group-hover:scale-125"></div>

  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl flex items-center justify-center overflow-hidden">
    <img 
      src="/header.png"
      className="h-full w-full object-cover"
      alt="avatar"
    />
  </div>
</div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-xl font-bold text-transparent">
              AgreBase
            </h1>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* Events */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                href="/farmer/events"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/farmer/events")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Events
              </Link>
            </motion.div>

            {/* Concerns */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                href="/farmer/concerns"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/farmer/concerns")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                Concerns
              </Link>
            </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                href="/farmer/profile"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/farmer/profile")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                Profile
              </Link>
            </motion.div>



          </nav>
        </div>

        <div className="mt-auto py-10"></div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
