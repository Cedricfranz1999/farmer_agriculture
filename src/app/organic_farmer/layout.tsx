"use client";
import { Toaster } from "~/components/ui/toaster";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // useEffect(() => {
  //   const adminData = localStorage.getItem("adminData");
  //   if (!adminData) {
  //     router.push("/adminLogin");
  //   }
  // }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#caedd5] to-white"
    >
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
            <Toaster />
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLayout;
