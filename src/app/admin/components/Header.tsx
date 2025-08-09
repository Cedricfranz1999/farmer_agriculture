"use client";
import Link from "next/link";
import {
  CircleUser,
  LayoutDashboard,
  Menu,
  Package2,
  Users,
  ClipboardList,
  FileText,
  Calendar,
  AlertCircle,
  Leaf,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { DialogTitle } from "~/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { Label } from "~/components/ui/label";
import { motion } from "framer-motion";
import { useAuthStore } from "~/app/store/authStore";
import { useState } from "react";

const Header = () => {
  const router = useRouter();
  const username = useAuthStore((state) => state?.user?.username);
  const clearUsername = useAuthStore((state) => state.logout);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "/admin/applicants": false,
    "/admin/registered-farmers": false,
    "/admin/not-qualified-farmers": false,
  });

  const handleLogout = () => {
    clearUsername();
    router.push("/sign-in");
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`sticky top-0 z-40 border-b border-emerald-200 bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300`}
    >
      <div className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col bg-gradient-to-b from-white via-emerald-50/30 to-white"
          >
            <VisuallyHidden>
              <DialogTitle>Navigation Menu</DialogTitle>
            </VisuallyHidden>
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="#"
                className="group mb-4 flex items-center gap-2 text-lg font-semibold"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 blur-sm transition-opacity group-hover:opacity-30"></div>
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Leaf className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-xl font-bold text-transparent">
                  AgreBase
                </span>
              </Link>

              {/* Dashboard */}
              <Link
                href="/admin/dashboard"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>

              {/* Applicants */}
              <div>
                <div
                  className="mx-[-0.65rem] flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                  onClick={() => toggleMenu("/admin/applicants")}
                >
                  <div className="flex items-center gap-4">
                    <ClipboardList className="h-5 w-5" />
                    Applicants
                  </div>
                  {expandedMenus["/admin/applicants"] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                {expandedMenus["/admin/applicants"] && (
                  <div className="ml-8">
                    <Link
                      href="/admin/applicants/farmers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Farmer
                    </Link>
                    <Link
                      href="/admin/applicants/organic-farmers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Organic Farmer
                    </Link>
                  </div>
                )}
              </div>

              {/* Registered Farmers */}
              <div>
                <div
                  className="mx-[-0.65rem] flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                  onClick={() => toggleMenu("/admin/registered-farmers")}
                >
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5" />
                    Registered Farmers
                  </div>
                  {expandedMenus["/admin/registered-farmers"] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                {expandedMenus["/admin/registered-farmers"] && (
                  <div className="ml-8">
                    <Link
                      href="/admin/registered-farmers/farmers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Farmers
                    </Link>
                    <Link
                      href="/admin/registered-farmers/organic-farmers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Organic
                    </Link>
                  </div>
                )}
              </div>

              {/* Not Qualified Farmers */}
              <div>
                <div
                  className="mx-[-0.65rem] flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                  onClick={() => toggleMenu("/admin/not-qualified-farmers")}
                >
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5" />
                    Not Qualified Farmers
                  </div>
                  {expandedMenus["/admin/not-qualified-farmers"] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                {expandedMenus["/admin/not-qualified-farmers"] && (
                  <div className="ml-8">
                    <Link
                      href="/admin/not-qualified-farmers/farmers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Farmers
                    </Link>
                    <Link
                      href="/admin/not-qualified-farmers/organic-farmers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Organic
                    </Link>
                  </div>
                )}
              </div>

              {/* Events */}
              <Link
                href="/admin/events"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
              >
                <Calendar className="h-5 w-5" />
                Events
              </Link>

              {/* Concerns */}
              <Link
                href="/admin/concerns"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
              >
                <AlertCircle className="h-5 w-5" />
                Concerns
              </Link>

              {/* Reports */}
              <Link
                href="/admin/reports"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
              >
                <FileText className="h-5 w-5" />
                Reports
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 shadow-lg transition-all hover:from-emerald-200 hover:to-emerald-300 hover:text-emerald-800"
              >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-lg border border-emerald-200 bg-white/95 shadow-lg backdrop-blur-md"
          >
            <DropdownMenuLabel className="text-emerald-700">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{username}</p>
                <p className="text-xs leading-none text-emerald-600">
                  Administrator
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-emerald-200" />
            <DropdownMenuItem
              className="cursor-pointer text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};
export default Header;
