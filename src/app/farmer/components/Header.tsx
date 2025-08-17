"use client";
import Link from "next/link";
import { CircleUser, Menu, Calendar, AlertCircle, Leaf } from "lucide-react";
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
import { motion } from "framer-motion";
import { useAuthStore } from "~/app/store/authStore";

const Header = () => {
  const router = useRouter();
  const username = useAuthStore((state) => state?.user);
  const clearUsername = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    clearUsername();
    router.push("/sign-in");
  };

  console.log(
    "USER",
    useAuthStore((state) => state),
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="sticky top-0 z-40 border-b border-emerald-200 bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300"
    >
      <div className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
        {/* Mobile Drawer */}
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
              {/* Logo */}
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

              {/* Events */}
              <Link
                href="/farmer/events"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
              >
                <Calendar className="h-5 w-5" />
                Events
              </Link>

              {/* Concerns */}
              <Link
                href="/farmer/concerns"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
              >
                <AlertCircle className="h-5 w-5" />
                Concerns
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="w-full flex-1" />

        {/* User Menu */}
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
                <p className="text-sm leading-none font-medium">
                  {username?.type}-{username?.id}
                </p>
                <p className="text-xs leading-none text-emerald-600">
                  {username?.email}
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
