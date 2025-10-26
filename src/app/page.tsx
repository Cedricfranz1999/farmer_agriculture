"use client";
import Image from "next/image";
import {
  CheckCircle,
  Users,
  Database,
  Bell,
  Smartphone,
  Globe,
  Leaf,
  TrendingUp,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AgreBaseLanding() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: any) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#caedd5] to-white">
      {/* Enhanced Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-emerald-200 bg-white/95 shadow-lg backdrop-blur-md"
            : "border-b border-emerald-100 bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group flex items-center space-x-3"
            >
<div className="relative group">
  <div className="absolute -inset-2 rounded-full bg-emerald-500 opacity-20 blur-md transition-all duration-300 group-hover:opacity-40 group-hover:scale-110"></div>

  <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl flex items-center justify-center overflow-hidden">
    <img 
      src="homepage.jpeg"
      className="h-full w-full rounded-full object-cover"
      alt="profile"
    />
  </div>
</div>


              <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-2xl font-bold text-transparent">
                AgreBase
              </h1>
            </motion.div>
            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 md:flex">
              {["home", "mission", "vision", "about"].map((section) => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scrollToSection(section)}
                  className={`relative text-lg font-medium capitalize transition-all duration-300 hover:text-emerald-600 ${
                    activeSection === section
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  {section === "about" ? "About Us" : section}
                  {activeSection === section && (
                    <motion.div
                      layoutId="underline"
                      className="absolute right-0 -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    ></motion.div>
                  )}
                </motion.button>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
                >
                  Login
                </Button>
              </motion.div>
            </nav>
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-emerald-50 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full right-0 left-0 border-b border-emerald-200 bg-white/95 shadow-lg backdrop-blur-md md:hidden"
            >
              <nav className="container mx-auto space-y-4 px-4 py-4">
                {["home", "mission", "vision", "about"].map((section) => (
                  <motion.button
                    key={section}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(section)}
                    className="block w-full text-left text-lg font-medium text-gray-700 capitalize transition-colors hover:text-emerald-600"
                  >
                    {section === "about" ? "About Us" : section}
                  </motion.button>
                ))}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                    onClick={() => router.push("/sign-in")}
                  >
                    Login
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Enhanced Home Section */}
      <section id="home" className="relative overflow-hidden px-4 py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/50"></div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-20 right-10 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity }}
          className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-green-200/20 blur-3xl"
        ></motion.div>
        <div className="relative container mx-auto">
          {/* Enhanced Hero Section */}
          <div className="mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="mb-4 border-emerald-300 bg-emerald-100 text-emerald-700 shadow-sm transition-shadow hover:shadow-md">
                Northwest Samar State University
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h1 className="mb-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 bg-clip-text text-6xl font-bold text-transparent drop-shadow-sm md:text-8xl">
                AgreBase
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-700 md:text-2xl">
                Web-Based Farmers Registration and Organic Fertilizer
                Classification System
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
                Revolutionizing agricultural decision-making through digital
                innovation. Streamlining farmer registration, improving data
                accuracy, and promoting sustainable farming practices across
                Northwest Samar.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/sign-in")}
                  className="group bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
                >
                  Register as Farmer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("about")}
                  className="group border-2 border-emerald-500 bg-transparent px-8 py-4 text-lg text-emerald-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-xl"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Farmers Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mb-20"
          >
            <h2 className="mb-12 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-4xl font-bold text-transparent">
              Supporting Our Agricultural Community
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                { src: "/farmers1.png", alt: "Farmer 1", label: "Rice Farmer" },
                {
                  src: "/farmers2.png",
                  alt: "Farmer 2",
                  label: "Vegetable Farmer",
                },
                {
                  src: "/farmers3.png",
                  alt: "Farmer 3",
                  label: "Organic Farmer",
                },
                {
                  src: "/fisherman1.png",
                  alt: "Fisherman 1",
                  label: "Fisherman",
                },
                {
                  src: "/fisherman2.png",
                  alt: "Fisherman 2",
                  label: "Aquaculture",
                },
                {
                  src: "/fisherman3.png",
                  alt: "Fisherman 3",
                  label: "Marine Fisher",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={300}
                    height={300}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="translate-y-4 transform text-center transition-transform duration-300 group-hover:translate-y-0">
                      <p className="text-lg font-semibold text-white drop-shadow-lg">
                        {item.label}
                      </p>
                      <div className="mx-auto mt-2 h-0.5 w-12 bg-white opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Key Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mb-20"
          >
            <h2 className="mb-16 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-5xl font-bold text-transparent">
              Revolutionary Features for Modern Agriculture
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Streamlined Registration",
                  description:
                    "Simplified online registration process for farmers and organic fertilizer users. Submit personal and farming details from anywhere, eliminating the need for physical visits to remote offices.",
                },
                {
                  icon: Bell,
                  title: "Smart Notifications",
                  description:
                    "Receive instant SMS and email notifications for registration status updates, government incentives, and important agricultural announcements.",
                },
                {
                  icon: Database,
                  title: "Data Management",
                  description:
                    "Advanced data visualization and reporting capabilities. Generate exportable reports in PDF, Word, and Excel formats for better decision-making.",
                },
                {
                  icon: Leaf,
                  title: "Organic Classification",
                  description:
                    "Comprehensive organic fertilizer classification system to help farmers make informed decisions about sustainable farming practices.",
                },
                {
                  icon: Globe,
                  title: "Remote Accessibility",
                  description:
                    "Web-based platform accessible from any device with internet connection, specifically designed to serve farmers in remote areas of Northwest Samar.",
                },
                {
                  icon: Shield,
                  title: "Data Security",
                  description:
                    "Secure data storage and management ensuring farmer information is protected while maintaining accuracy for legitimate beneficiary identification.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl">
                    <CardHeader>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-200 group-hover:to-emerald-300">
                        <feature.icon className="h-7 w-7 text-emerald-600" />
                      </div>
                      <CardTitle className="text-xl text-emerald-700">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Problem & Solution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mb-20"
          >
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Left Side: Challenges */}
              <div className="space-y-8">
                <h2 className="mb-8 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-4xl font-bold text-transparent">
                  Addressing Critical Agri-Fisheries Challenges
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      title: "Inefficient Registration Process",
                      description:
                        "Current manual registration systems are time-consuming, difficult to access, and prone to errors, especially in remote agricultural and coastal areas.",
                    },
                    {
                      title: "Data Accuracy Issues",
                      description:
                        "Inaccurate farmer and fisherfolk data hinders proper identification of legitimate beneficiaries for government support programs and incentives.",
                    },
                    {
                      title: "Limited Access to Information",
                      description:
                        "Farmers and fisherfolk lack timely access to information about programs, sustainable practices, and organic options.",
                    },
                    {
                      title:
                        "Limited Inclusion of Fisherfolk in Digital Platforms",
                      description:
                        "Many digital platforms prioritize farmers, leaving fisherfolk underserved in access to tools, training, and resources.",
                    },
                  ].map((problem, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="group flex items-start space-x-4"
                    >
                      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 shadow-md transition-shadow group-hover:shadow-lg">
                        <span className="text-lg font-bold text-red-600">
                          !
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {problem.title}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {problem.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Right Side: Solutions */}
              <div className="space-y-8">
                <h2 className="mb-8 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-4xl font-bold text-transparent">
                  Our Digital Solution
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      title: "Digital Registration Platform",
                      description:
                        "Online registration system allowing farmers and fisherfolk to submit information from anywhere, reducing travel time and administrative burden.",
                    },
                    {
                      title: "Automated Data Validation",
                      description:
                        "Built-in validation systems ensure accurate data and help identify legitimate beneficiaries for fair resource distribution.",
                    },
                    {
                      title: "Inclusive Mobile Access",
                      description:
                        "A mobile-friendly platform ensures farmers and fisherfolk in rural and coastal areas can easily engage with digital services.",
                    },
                  ].map((solution, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="group flex items-start space-x-4"
                    >
                      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-md transition-shadow group-hover:shadow-lg">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {solution.title}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {solution.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mb-20 rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/30 to-white p-12 shadow-2xl"
          >
            <h2 className="mb-16 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-4xl font-bold text-transparent">
              Impact on Agricultural Community
            </h2>
            <div className="grid gap-12 text-center md:grid-cols-4">
              {[
                { number: "1000+", label: "Registered Farmers", icon: Users },
                { number: "50+", label: "Barangays Covered", icon: MapPin },
                { number: "95%", label: "Data Accuracy", icon: Database },
                { number: "24/7", label: "System Availability", icon: Clock },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="group"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-200 group-hover:to-emerald-300">
                      <stat.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mb-3 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-5xl font-bold text-transparent">
                    {stat.number}
                  </div>
                  <p className="font-medium text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mb-20"
          >
            <h2 className="mb-16 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-5xl font-bold text-transparent">
              Benefits for All Stakeholders
            </h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "For Farmers",
                  benefits: [
                    "Easy online registration process",
                    "Real-time status updates",
                    "Access to government incentives",
                    "Organic fertilizer guidance",
                    "Remote accessibility",
                  ],
                },
                {
                  icon: Globe,
                  title: "For Government Agencies",
                  benefits: [
                    "Accurate farmer database",
                    "Efficient resource allocation",
                    "Data-driven decision making",
                    "Automated reporting system",
                    "Reduced administrative costs",
                  ],
                },
                {
                  icon: Leaf,
                  title: "For Agriculture Sector",
                  benefits: [
                    "Promoted sustainable farming",
                    "Improved productivity tracking",
                    "Enhanced data collection",
                    "Better resource distribution",
                    "Digital transformation",
                  ],
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl text-emerald-700">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 transition-transform duration-300 group-hover:scale-110">
                          <benefit.icon className="h-6 w-6 text-emerald-600" />
                        </div>
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {benefit.benefits.map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          className="group/item -m-2 flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-emerald-50"
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500 transition-transform group-hover/item:scale-110" />
                          <span className="text-gray-700">{item}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 via-transparent to-emerald-200/20"></div>
        <Separator className="relative h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      </div>

      {/* Enhanced Mission Section */}
      <section
        id="mission"
        className="bg-gradient-to-br from-white via-emerald-50/30 to-white px-4 py-24"
      >
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-5xl font-bold text-transparent"
            >
              Our Mission
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mb-8 h-1 w-32 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            ></motion.div>
          </div>
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="hover:shadow-3xl border-emerald-200 bg-white/90 shadow-2xl backdrop-blur-sm transition-shadow duration-500">
                <CardContent className="p-12">
                  <div className="mb-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg"
                    >
                      <TrendingUp className="h-10 w-10 text-emerald-600" />
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mb-12 text-center text-xl leading-relaxed text-gray-700"
                  >
                    Promote of Agricultural and Fishery Development through
                    enchancement of Skills of Farmer and Fishermen and
                    adaptation of Enviromentally Friendly Technology as one of
                    the technical arms of the chief executive, the office is
                    given responsibility of Agri-Fishery production,Food
                    Security and Profitability and fishery Income.
                  </motion.p>
                  <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {[
                      {
                        icon: Smartphone,
                        title: "Digital Innovation",
                        description:
                          "Leveraging technology to modernize agricultural processes",
                      },
                      {
                        icon: Users,
                        title: "Community Focus",
                        description:
                          "Serving farmers and agricultural communities with dedication",
                      },
                      {
                        icon: Leaf,
                        title: "Sustainability",
                        description:
                          "Promoting eco-friendly and sustainable farming methods",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.2 }}
                        className="group text-center"
                      >
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-200 group-hover:to-emerald-300">
                          <item.icon className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-emerald-700">
                          {item.title}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 via-transparent to-emerald-200/20"></div>
        <Separator className="relative h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      </div>

      {/* Enhanced Vision Section */}
      <section
        id="vision"
        className="bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-24"
      >
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-5xl font-bold text-transparent"
            >
              Our Vision
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mb-8 h-1 w-32 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            ></motion.div>
          </div>
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="hover:shadow-3xl border-emerald-200 bg-white/90 shadow-2xl backdrop-blur-sm transition-shadow duration-500">
                <CardContent className="p-12">
                  <div className="mb-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg"
                    >
                      <Globe className="h-10 w-10 text-emerald-600" />
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mb-12 text-center text-xl leading-relaxed text-gray-700"
                  >
                    Promote Agriculture Development in the Municipality
                    Promotion of Agriculture development upland barangays in the
                    Municipality improved of Agricultural and Fishery production
                    to increase farmers and fisherfolks income.
                  </motion.p>
                  <div className="mt-12 grid gap-12 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="space-y-6"
                    >
                      <h3 className="flex items-center text-2xl font-semibold text-emerald-700">
                        <TrendingUp className="mr-3 h-6 w-6" />
                        Impact Objectives
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Increase farmer and fisherfolk productivity by 30%",
                          "Reduce administrative processing time by 80%",
                          "Achieve 100% sustainable farming and fishing in target areas",
                        ].map((objective, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4 + index * 0.2 }}
                            className="group -m-3 flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-emerald-50"
                          >
                            <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-500 transition-transform group-hover:scale-110" />
                            <span className="leading-relaxed text-gray-700">
                              {objective}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 via-transparent to-emerald-200/20"></div>
        <Separator className="relative h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      </div>

      {/* Enhanced About Us Section */}
      <section
        id="about"
        className="bg-gradient-to-br from-white via-emerald-50/30 to-white px-4 py-24"
      >
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-5xl font-bold text-transparent"
            >
              About Us
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mb-8 h-1 w-32 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            ></motion.div>
          </div>
          <div className="mx-auto max-w-7xl">
            {/* Enhanced University Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-20"
            >
              <Card className="hover:shadow-3xl border-emerald-200 bg-white/90 shadow-2xl backdrop-blur-sm transition-shadow duration-500">
                <CardContent className="p-12">
                  <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="space-y-6">
                      <h3 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-3xl font-bold text-transparent">
                        Northwest Samar State University
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-700">
                        Northwest Samar State University (NSSU) is a premier
                        educational institution committed to excellence in
                        education, research, and community service. Located in
                        the heart of Northwest Samar, we have been serving the
                        region for decades, producing graduates who contribute
                        significantly to the development of their communities
                        and the nation.
                      </p>
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group -m-3 flex items-center space-x-4 rounded-lg p-3 transition-colors hover:bg-emerald-50"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 transition-transform group-hover:scale-110">
                            <MapPin className="h-6 w-6 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            Northwest Samar, Philippines
                          </span>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group -m-3 flex items-center space-x-4 rounded-lg p-3 transition-colors hover:bg-emerald-50"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 transition-transform group-hover:scale-110">
                            <Clock className="h-6 w-6 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            Established 1960s
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 shadow-lg">
                      <h4 className="mb-6 text-xl font-semibold text-emerald-700">
                        Our Commitment
                      </h4>
                      <ul className="space-y-4">
                        {[
                          "Quality education for all students",
                          "Innovative research and development",
                          "Community engagement and service",
                          "Sustainable development initiatives",
                        ].map((commitment, index) => (
                          <motion.li
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="group flex items-start space-x-3"
                          >
                            <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500 transition-transform group-hover:scale-110" />
                            <span className="text-gray-700">{commitment}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Project Background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-20"
            >
              <h3 className="mb-12 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-3xl font-bold text-transparent">
                Project Background & Development
              </h3>
              <div className="grid gap-8 lg:grid-cols-3">
                {[
                  {
                    title: "Research Foundation",
                    description:
                      "This project emerged from extensive research into the challenges faced by farmers in Northwest Samar. Our research team identified critical gaps in the current registration system and the need for digital transformation in agricultural management.",
                    icon: Database,
                  },
                  {
                    title: "Community Collaboration",
                    description:
                      "We worked closely with local farmers, government agencies, and agricultural organizations to understand their specific needs and challenges. This collaborative approach ensures our solution addresses real-world problems effectively.",
                    icon: Users,
                  },
                  {
                    title: "Technology Innovation",
                    description:
                      "Leveraging modern web technologies and best practices in software development, we created a robust, scalable, and user-friendly platform that can adapt to the evolving needs of the agricultural sector.",
                    icon: Smartphone,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl">
                      <CardHeader>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-200 group-hover:to-emerald-300">
                          <item.icon className="h-7 w-7 text-emerald-600" />
                        </div>
                        <CardTitle className="text-xl text-emerald-700">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed text-gray-700">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Research Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-20"
            >
              <h3 className="mb-12 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-3xl font-bold text-transparent">
                Research & Development Team
              </h3>
              <Card className="hover:shadow-3xl border-emerald-200 bg-white/90 shadow-2xl backdrop-blur-sm transition-shadow duration-500">
                <CardContent className="p-12">
                  <p className="mb-12 text-center text-lg leading-relaxed text-gray-700">
                    Our dedicated team of researchers, developers, and
                    agricultural experts have worked tirelessly to create this
                    innovative solution. With combined expertise in computer
                    science, agriculture, and community development, we bring a
                    multidisciplinary approach to solving complex agricultural
                    challenges.
                  </p>
                  <div className="grid gap-8 text-center md:grid-cols-4">
                    {[
                      {
                        icon: Users,
                        title: "Research Team",
                        subtitle: "Agricultural & Social Research",
                      },
                      {
                        icon: Database,
                        title: "Development Team",
                        subtitle: "Software Engineering & Design",
                      },
                      {
                        icon: Leaf,
                        title: "Agricultural Experts",
                        subtitle: "Farming & Sustainability Advisors",
                      },
                      {
                        icon: Globe,
                        title: "Community Liaisons",
                        subtitle: "Stakeholder Engagement",
                      },
                    ].map((team, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 + index * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        className="group"
                      >
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-200 group-hover:to-emerald-300">
                          <team.icon className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h4 className="mb-2 text-xl font-semibold text-emerald-700">
                          {team.title}
                        </h4>
                        <p className="text-gray-600">{team.subtitle}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Technical Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <h3 className="mb-12 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-center text-3xl font-bold text-transparent">
                Technical Excellence
              </h3>
              <div className="grid gap-8 md:grid-cols-2">
                <motion.div whileHover={{ scale: 1.05 }} className="group">
                  <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl text-emerald-700">
                        <Database className="mr-3 h-6 w-6" />
                        System Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        "Responsive web design for all devices",
                        "Real-time data synchronization",
                        "Multi-format report generation",
                        "SMS and email notification system",
                        "Advanced data visualization tools",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="group/item -m-2 flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-emerald-50"
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500 transition-transform group-hover/item:scale-110" />
                          <span className="text-gray-700">{feature}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="group">
                  <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl text-emerald-700">
                        <Shield className="mr-3 h-6 w-6" />
                        Security & Reliability
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        "Encrypted data transmission",
                        "Secure user authentication",
                        "Regular security audits",
                        "Automated backup systems",
                        "99.9% uptime guarantee",
                      ].map((security, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="group/item -m-2 flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-emerald-50"
                        >
                          <Shield className="h-5 w-5 text-emerald-500 transition-transform group-hover/item:scale-110" />
                          <span className="text-gray-700">{security}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-16 text-white"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-emerald-800/90"></div>
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="group flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-sm transition-opacity group-hover:opacity-30"></div>
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">AgreBase</h3>
              </div>
              <p className="leading-relaxed text-emerald-100">
                Empowering farmers through digital innovation and sustainable
                agricultural practices.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="mb-6 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-3">
                {["home", "mission", "vision", "about"].map((section) => (
                  <motion.li
                    key={section}
                    whileHover={{ x: 5 }}
                    className="group flex items-center text-emerald-100 capitalize transition-all duration-300 hover:text-white"
                  >
                    <button
                      onClick={() => scrollToSection(section)}
                      className="flex items-center"
                    >
                      <ArrowRight className="mr-2 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      {section === "about" ? "About Us" : section}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h4 className="mb-6 text-lg font-semibold">Services</h4>
              <ul className="space-y-3 text-emerald-100">
                {[
                  "Farmer Registration",
                  "Organic Fertilizer Classification",
                  "Data Management",
                  "Reporting & Analytics",
                ].map((service, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    className="group flex items-center transition-colors hover:text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
                    {service}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h4 className="mb-6 text-lg font-semibold">Contact Info</h4>
              <div className="space-y-4 text-emerald-100">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="group flex items-start space-x-3 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p>Northwest Samar State University</p>
                    <p>Northwest Samar, Philippines</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="group flex items-center space-x-3 transition-colors hover:text-white"
                >
                  <Bell className="h-5 w-5 flex-shrink-0" />
                  <p>info@agrebase.edu.ph</p>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="group flex items-center space-x-3 transition-colors hover:text-white"
                >
                  <Smartphone className="h-5 w-5 flex-shrink-0" />
                  <p>+63 XXX XXX XXXX</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="relative mt-12 pt-8"
          >
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            <div className="text-center text-emerald-100">
              <p>
                &copy; 2024 AgreBase - Northwest Samar State University. All
                rights reserved.
              </p>
              <p className="mt-2 text-sm">
                Built with ❤️ for the agricultural community of Northwest Samar
              </p>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
