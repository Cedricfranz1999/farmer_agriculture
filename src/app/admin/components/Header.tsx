"use client";
import Link from "next/link";
import {
  CircleUser,
  LayoutDashboard,
  Menu,
  Users,
  ClipboardList,
  FileText,
  Calendar,
  AlertCircle,
  Leaf,
  ChevronDown,
  ChevronUp,
  QrCode,
  X,
  CheckCircle2,
  Camera,
  RotateCcw,
  Eye,
  RotateCw,
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
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "~/app/store/authStore";
import { useState } from "react";
// QR Scanner Components
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle as DialogTitleComponent,
} from "~/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import Image from "next/image";
import { api } from "~/trpc/react";

// QR Scanner Modal Component
const QRScannerModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<"farmer" | "organic_farmer">("farmer");
  const devices = useDevices();
  const router = useRouter();

  const { data: farmerData, isFetching: isFetchingFarmer } =
    api.scanner.findFarmerById.useQuery(
      { id: scannedId ?? "" },
      { enabled: !!scannedId && selectedType === "farmer" }
    );
  const { data: organicFarmerData, isFetching: isFetchingOrganic } =
    api.scanner.findOrganicFarmerById.useQuery(
      { id: scannedId ?? "" },
      { enabled: !!scannedId && selectedType === "organic_farmer" }
    );
  const scannedData = selectedType === "farmer" ? farmerData : organicFarmerData;
  const isFetching = selectedType === "farmer" ? isFetchingFarmer : isFetchingOrganic;

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes.length > 0 && !scannedId) {
      const data = detectedCodes[0].rawValue;
      console.log(`Scanned ID: ${data}`);
      setScannedId(data);
      setIsScanning(false);
    }
  };

  const startScanner = () => {
    setError(null);
    setScannedId(null);
    setIsScanning(true);
  };

  const stopScanner = () => {
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScannedId(null);
    setError(null);
    setIsScanning(false);
  };

  const handleViewDetails = () => {
    if (scannedData) {
      const route = scannedData.type === "farmer"
        ? `/admin/farmer/profile/${scannedData.id}`
        : `/admin/organic-farmer/profile/${scannedData.id}`;

      router.push(route);
      onClose();
    }
  };

  const handleClose = () => {
    resetScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitleComponent className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <QrCode className="h-6 w-6 text-emerald-600" />
              </div>
              QR Code Scanner
            </DialogTitleComponent>
          </div>
          <DialogDescription className="text-base">
            Scan farmer QR codes to instantly view their information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <AnimatePresence mode="wait">
            {!isScanning && !scannedId && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-emerald-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                      <Camera className="h-5 w-5" />
                      Ready to Scan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Select Farmer Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as "farmer" | "organic_farmer")}
                        className="w-full rounded-lg border-2 border-emerald-300 p-3 text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      >
                        <option value="farmer">Regular Farmer</option>
                        <option value="organic_farmer">Organic Farmer</option>
                      </select>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="text-sm text-emerald-700 text-center leading-relaxed">
                        Position the QR code within the camera frame for automatic scanning
                      </p>
                    </div>
                    <Button
                      onClick={startScanner}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Start Camera
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-emerald-300 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse">
                          <Camera className="h-5 w-5" />
                        </div>
                        Scanning for {selectedType === "farmer" ? "Regular Farmer" : "Organic Farmer"}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-3">
                      <select
                        className="flex-1 rounded-lg border-2 border-emerald-300 p-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        onChange={(e) => setDeviceId(e.target.value)}
                        value={deviceId}
                      >
                        <option value={undefined}>Default Camera</option>
                        {devices.map((device, index) => (
                          <option key={index} value={device.deviceId}>
                            {device.label || `Camera ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error ? (
                      <Alert variant="destructive" className="border-2">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-semibold">Camera Error</AlertTitle>
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl border-4 border-emerald-300 shadow-2xl">
                          <Scanner
                            formats={["qr_code"]}
                            constraints={{ deviceId }}
                            onScan={handleScan}
                            onError={(err) => setError(`Scanner error: ${err}`)}
                            styles={{
                              container: {
                                height: "400px",
                                width: "100%",
                              },
                            }}
                            components={{ finder: true }}
                            allowMultiple={false}
                            scanDelay={500}
                          />
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                            Align QR code in center
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={stopScanner}
                      variant="outline"
                      className="w-full h-11 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Scan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {scannedId && !isScanning && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-emerald-300 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b-2 border-emerald-200">
                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      Scan Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isFetching ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-4"
                      >
                        <div className="relative">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
                          <QrCode className="h-8 w-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-base font-medium text-emerald-700">
                          Loading farmer information...
                        </p>
                      </motion.div>
                    ) : scannedData ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <AlertTitle className="text-green-800 font-bold text-lg">Success!</AlertTitle>
                          <AlertDescription className="text-green-700 text-base">
                            Found {selectedType === "farmer" ? "Regular Farmer" : "Organic Farmer"}: <strong className="font-semibold">{scannedId}</strong>
                          </AlertDescription>
                        </Alert>
                        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl border-2 border-emerald-200 p-6 shadow-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center justify-center md:col-span-1">
                              {scannedData.farmerImage ? (
                                <div className="relative group">
                                  <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
                                  <Image
                                    src={scannedData.farmerImage}
                                    alt={`${scannedData.firstname} ${scannedData.surname}`}
                                    width={160}
                                    height={160}
                                    className="relative rounded-2xl object-cover border-4 border-emerald-300 shadow-xl"
                                  />
                                </div>
                              ) : (
                                <div className="w-40 h-40 bg-emerald-100 rounded-2xl flex items-center justify-center border-4 border-emerald-300">
                                  <Users className="h-16 w-16 text-emerald-400" />
                                </div>
                              )}
                            </div>

                            <div className="md:col-span-2 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                                  <p className="text-xs font-semibold text-emerald-600 mb-1">First Name</p>
                                  <p className="text-lg font-bold text-emerald-900">{scannedData.firstname}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                                  <p className="text-xs font-semibold text-emerald-600 mb-1">Surname</p>
                                  <p className="text-lg font-bold text-emerald-900">{scannedData.surname}</p>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-3 border border-emerald-200">
                                <p className="text-xs font-semibold text-emerald-600 mb-1">Address</p>
                                <p className="text-sm text-emerald-900 leading-relaxed">
                                  {scannedData.houseOrLotOrBuildingNo} {scannedData.streetOrSitioOrSubDivision},
                                  {scannedData.barangay}, {scannedData.municipalityOrCity},
                                  {scannedData.province}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                                  <p className="text-xs font-semibold text-emerald-600 mb-1">Age</p>
                                  <p className="text-lg font-bold text-emerald-900">{scannedData.age} years</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                                  <p className="text-xs font-semibold text-emerald-600 mb-1">Type</p>
                                  <p className="text-lg font-bold text-emerald-900 capitalize">
                                    {scannedData.type.replace('_', ' ')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={resetScanner}
                            variant="outline"
                            className="flex-1 h-12 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Scan Another
                          </Button>
                          <Button
                            onClick={handleViewDetails}
                            className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <Eye className="mr-2 h-5 w-5" />
                            View Full Profile
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Alert variant="destructive" className="border-2">
                          <AlertCircle className="h-5 w-5" />
                          <AlertTitle className="font-bold text-lg">Not Found</AlertTitle>
                          <AlertDescription className="text-base">
                            No {selectedType === "farmer" ? "regular farmer" : "organic farmer"} found with ID: <strong>{scannedId}</strong>
                          </AlertDescription>
                        </Alert>
                        <Button
                          onClick={resetScanner}
                          variant="outline"
                          className="w-full mt-4 h-11 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium"
                        >
                          <RotateCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Header Component
const Header = () => {
  const router = useRouter();
  const username = useAuthStore((state) => state?.user?.username);
  const clearUsername = useAuthStore((state) => state.logout);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "/admin/applicants": false,
    "/admin/registered-farmers": false,
    "/admin/not-qualified-farmers": false,
  });
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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
    <>
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
                 <div className="relative group">
  <div className="absolute -inset-3 rounded-full bg-emerald-500 opacity-20 blur-lg transition-all duration-300 group-hover:opacity-40 group-hover:scale-125"></div>

  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl flex items-center justify-center overflow-hidden">
    <img 
      src="/homepage.jpeg"
      className="h-full w-full object-cover"
      alt="avatar"
    />
  </div>
</div>

                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-xl font-bold text-transparent">
                    AgreBase
                  </span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
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
                <Link
                  href="/admin/events"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                >
                  <Calendar className="h-5 w-5" />
                  Events
                </Link>
                <Link
                  href="/admin/concerns"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                >
                  <AlertCircle className="h-5 w-5" />
                  Concerns
                </Link>
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

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsScannerOpen(true)}
              className="rounded-full border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <QrCode className="h-5 w-5" />
              <span className="sr-only">Scan QR</span>
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-2 border-emerald-200 shadow-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-emerald-800">{username}</p>
                  <p className="text-xs leading-none text-emerald-600">Administrator</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
};

export default Header;
