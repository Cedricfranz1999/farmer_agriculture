"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  Leaf,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    farmer: true,
    organicFarmer: true,
  });

  const isActive = (path: string) => pathname.startsWith(path);

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="hidden border-r border-emerald-200 bg-gradient-to-b from-white via-emerald-50/30 to-white shadow-lg backdrop-blur-sm md:block"
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
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
        <div className="mt-6 flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* Dashboard */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/dashboard"
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/dashboard")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
            </motion.div>

            {/* FARMER */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <div
                  className={`flex flex-1 cursor-default items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/applicants/farmers") ||
                    isActive("/admin/registered-farmers/farmers") ||
                    isActive("/admin/not-qualified-farmers/farmers") ||
                    isActive("/admin/archived-farmers/farmers") ||
                    isActive("/admin/allocations/farmer")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  FARMER
                </div>
                <button
                  onClick={() => toggleMenu("farmer")}
                  className="p-2 text-emerald-600 hover:text-emerald-800"
                >
                  {expandedMenus.farmer ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              {expandedMenus.farmer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="ml-4 overflow-hidden"
                >
                  <Link
                    href="/admin/applicants/farmers"
                    className={`mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/applicants/farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Applicants</span>
                  </Link>
                  <Link
                    href="/admin/registered-farmers/farmers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/registered-farmers/farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Registered</span>
                  </Link>
                  <Link
                    href="/admin/not-qualified-farmers/farmers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/not-qualified-farmers/farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Not Qualified</span>
                  </Link>
                  <Link
                    href="/admin/archived-farmers/farmers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/archived-farmers/farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Archived</span>
                  </Link>
                  <Link
                    href="/admin/allocations/farmer"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/allocations/farmer")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Allocations</span>
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* ORGANIC FARMER */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <div
                  className={`flex flex-1 cursor-default items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/applicants/organic-farmers") ||
                    isActive("/admin/registered-farmers/organic-farmers") ||
                    isActive("/admin/not-qualified-farmers/organic-farmers") ||
                    isActive("/admin/archived-farmers/organic-farmers") ||
                    isActive("/admin/allocations/organic_farmer")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <Leaf className="h-4 w-4" />
                  ORGANIC FARMER
                </div>
                <button
                  onClick={() => toggleMenu("organicFarmer")}
                  className="p-2 text-emerald-600 hover:text-emerald-800"
                >
                  {expandedMenus.organicFarmer ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              {expandedMenus.organicFarmer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="ml-4 overflow-hidden"
                >
                  <Link
                    href="/admin/applicants/organic-farmers"
                    className={`mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/applicants/organic-farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Applicants</span>
                  </Link>
                  <Link
                    href="/admin/registered-farmers/organic-farmers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/registered-farmers/organic-farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Registered</span>
                  </Link>
                  <Link
                    href="/admin/not-qualified-farmers/organic-farmers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/not-qualified-farmers/organic-farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Not Qualified</span>
                  </Link>
                  <Link
                    href="/admin/archived-farmers/organic-farmers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/archived-farmers/organic-farmers")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Archived</span>
                  </Link>
                  <Link
                    href="/admin/allocations/organic_farmer"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive("/admin/allocations/organic_farmer")
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="ml-4">Allocations</span>
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Events */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/events"
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/events")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Events
                </Link>
              </div>
            </motion.div>

            {/* Concerns */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/concerns"
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/concerns")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  Concerns
                </Link>
              </div>
            </motion.div>

            {/* Reports */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/reports"
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/reports")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Reports
                </Link>
              </div>
            </motion.div>
          </nav>
        </div>
        <div className="mt-auto py-10"></div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
