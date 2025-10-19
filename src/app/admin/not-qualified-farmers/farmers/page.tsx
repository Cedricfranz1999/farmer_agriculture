"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Filter,
  Search,
  Menu,
  X,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FarmerRegistrationsStatus } from "@prisma/client";
import { sendVerifyEmailAction } from "~/lib/actions";
import { format } from "date-fns";

const FarmerApplicantsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFarmer, setSelectedFarmer] = useState<{
    id: number;
    name: string;
    newStatus: FarmerRegistrationsStatus;
    email: string;
    contactNumber: string;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const limit = 10;

  // Fetch farmers with pagination
  const {
    data: farmersData,
    isLoading,
    refetch,
  } = api.farmers.getApplicants.useQuery({
    page: currentPage,
    limit: limit,
    status: "NOT_QUALIFIED",
    search: searchTerm,
    dateFrom: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateTo: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search handler
  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  // Update farmer status mutation
  const updateStatusMutation = api.farmers.updateStatus.useMutation({
    onSuccess: () => {
      alert("Farmer status updated successfully!");
      refetch();
      setShowConfirmDialog(false);
      setSelectedFarmer(null);
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle view details navigation
  const handleViewDetails = (farmerId: number) => {
    router.push(`/farmers/${farmerId}`);
  };

  // Handle status update
  const handleStatusUpdate = (
    farmerId: number,
    farmerName: string,
    newStatus: "APPLICANTS" | "NOT_QUALIFIED" | "REGISTERED" | "ARCHIVED",
    email: string,
    contactNumber: string,
  ) => {
    setSelectedFarmer({
      id: farmerId,
      name: farmerName,
      newStatus,
      email: email,
      contactNumber: contactNumber,
    });
    setShowConfirmDialog(true);
    setRejectionMessage("");
  };

  // Confirm status update
 const confirmStatusUpdate = async () => {
   if (!selectedFarmer) return;
   
   updateStatusMutation.mutate({
     id: selectedFarmer.id,
     status: selectedFarmer.newStatus || null,
     rejectionReason: rejectionMessage
   });
 
   if (selectedFarmer.email) {
     try {
       await sendVerifyEmailAction(
         selectedFarmer.email,
         selectedFarmer.newStatus,
         selectedFarmer.name,
         rejectionMessage,
       );
     } catch (err) {
       console.error("Email failed:", err);
     }
   }
 
   const contact = selectedFarmer.contactNumber?.trim();
   console.log("Contact number:", contact);
 
   const isValidContact = contact && contact.length === 11 && contact.startsWith("09");
   
   if (isValidContact) {
     try {
       setLoading(true);
       
       const message = `Hello ${selectedFarmer.name},
 Thank you for applying to the Farmer Management System.
 Your current application status is: ${selectedFarmer.newStatus}
 ${rejectionMessage ? `Reason: ${rejectionMessage}` : ""}
 We will notify you of further updates.
 Best regards,
 Farmer Management Team`;
       
       // FIX 1: Use array for recipients as per API documentation
       // FIX 2: Add proper error handling
       const res = await fetch(
         `https://api.textbee.dev/api/v1/gateway/devices/${process.env.NEXT_PUBLIC_TEXTBEE_DEVICE_ID}/send-sms`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             "x-api-key": process.env.NEXT_PUBLIC_TEXTBEE_API_KEY as string,
           },
           body: JSON.stringify({
             recipients: [contact], // FIX: Wrap in array
             message: message,
           }),
         },
       );
 
       // FIX 3: Check if response is ok
       if (!res.ok) {
         const errorData = await res.json();
         console.error("TextBee API error:", errorData);
         throw new Error(`SMS sending failed: ${res.status} ${res.statusText}`);
       }
 
       const data = await res.json();
       console.log("SMS sent successfully:", data);
       setResponse(data);
       
     } catch (err) {
       console.error("Failed to send SMS:", err);
       setResponse({ error: err instanceof Error ? err.message : "Failed to send SMS" });
     } finally {
       setLoading(false);
       setRejectionMessage("");
     }
   } else {
     console.warn("Invalid or missing contact number:", contact);
     setLoading(false);
     setRejectionMessage("");
   }
 };

  // Date range handlers
  const handleDateRangeChange = (from: Date | null, to: Date | null) => {
    setDateRange({ from, to });
    setCurrentPage(1);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setDateRange({ from: null, to: null });
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "MMM dd, yyyy");
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    if (farmersData) {
      setCurrentPage(farmersData.pages);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (farmersData && currentPage < farmersData.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!farmersData) return [];

    const totalPages = farmersData.pages;
    const pages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Date Range Picker Component
  const DateRangePicker = () => {
    const [tempFrom, setTempFrom] = useState<string>(
      dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""
    );
    const [tempTo, setTempTo] = useState<string>(
      dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""
    );

    const handleApply = () => {
      const fromDate = tempFrom ? new Date(tempFrom) : null;
      const toDate = tempTo ? new Date(tempTo) : null;
      
      if (fromDate && toDate && fromDate > toDate) {
        alert("Start date cannot be after end date");
        return;
      }
      
      handleDateRangeChange(fromDate, toDate);
    };

    const handleClear = () => {
      setTempFrom("");
      setTempTo("");
      clearDateFilter();
    };

    return (
      <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900">Filter by Applied Date</h4>
          <p className="text-sm text-gray-500">Select date range</p>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={tempFrom}
              onChange={(e) => setTempFrom(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={tempTo}
              onChange={(e) => setTempTo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Apply
          </Button>
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const FarmerCard = ({ farmer }: { farmer: any }) => {
    const fullName = [
      farmer.firstname,
      farmer.middleName,
      farmer.surname,
      farmer.extensionName,
    ]
      .filter(Boolean)
      .join(" ");

    const age = calculateAge(farmer.dateOfBirth);

    return (
      <Card className="mb-4 overflow-hidden border-emerald-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Header with photo and basic info */}
            <div className="flex items-start space-x-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-emerald-200">
                <Image
                  src={farmer.farmerImage}
                  alt={`${farmer.firstname} ${farmer.surname}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-gray-900">
                  {fullName}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {farmer.sex.toLowerCase()}
                  </Badge>
                  <span className="text-sm text-gray-500">ID: {farmer.id}</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                  <div>
                    <div className="font-medium">Barangay</div>
                    <div className="text-gray-800">{farmer.barangay}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                  <div>
                    <div className="font-medium">Age</div>
                    <div className="text-gray-800">{age} years</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                  <div>
                    <div className="font-medium">Municipality</div>
                    <div className="text-gray-800">
                      {farmer.municipalityOrCity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4 text-emerald-500" />
                  <div>
                    <div className="font-medium">Applied</div>
                    <div className="text-gray-800">
                      {new Date(farmer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2 border-t border-gray-100 pt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 justify-center"
                    disabled={updateStatusMutation.isPending}
                  >
                    <MoreHorizontal className="mr-2 h-4 w-4" />
                    Actions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push("/admin/farmer/profile/" + farmer.id)
                    }
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusUpdate(
                        farmer.id,
                        fullName,
                        "REGISTERED",
                        farmer.email_address,
                        farmer.contactNumber,
                      )
                    }
                    className="cursor-pointer text-green-600 hover:text-green-700"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusUpdate(
                        farmer.id,
                        fullName,
                        "NOT_QUALIFIED",
                        farmer.email_address,
                        farmer.contactNumber,
                      )
                    }
                    className="cursor-pointer text-red-600 hover:text-red-700"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl">
               Not  qualified farmers
              </h1>
              <p className="mt-2 text-base text-slate-600 sm:text-lg">
                 not qualified farmers
              </p>
            </div>

            <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm shadow-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Date Range Filter */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`flex items-center space-x-2 ${
                    dateRange.from || dateRange.to
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : ""
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Date Range</span>
                  {(dateRange.from || dateRange.to) && (
                    <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
                      Filtered
                    </Badge>
                  )}
                </Button>
                {showDatePicker && <DateRangePicker />}
              </div>

              <Badge
                variant="outline"
                className="border-emerald-300 text-sm text-emerald-700"
              >
                <Users className="mr-1 h-4 w-4" />
                {farmersData?.total || 0} Total Applicants
              </Badge>

              {/* View toggle for larger screens */}
           
            </div>
          </div>

          {/* Date Range Display */}
          {(dateRange.from || dateRange.to) && (
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Applied Date: 
                {dateRange.from ? formatDate(dateRange.from) : "Any"} 
                {" to "}
                {dateRange.to ? formatDate(dateRange.to) : "Any"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex flex-col space-y-2 text-emerald-700 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                not qualified  Applications
              </div>
              {farmersData && (
                <div className="text-sm font-normal text-gray-600">
                  Page {currentPage} of {farmersData.pages} ({farmersData.total}{" "}
                  total)
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 rounded-lg border p-4"
                  >
                    <Skeleton className="h-12 w-12 rounded-full sm:h-16 sm:w-16" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 sm:w-48" />
                      <Skeleton className="h-4 w-24 sm:w-32" />
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <Skeleton className="h-8 w-16 sm:w-20" />
                      <Skeleton className="h-8 w-16 sm:w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : farmersData && farmersData.farmers.length > 0 ? (
              <>
                {/* Mobile Card View (default for mobile) */}
                <div className="block lg:hidden">
                  {farmersData.farmers.map((farmer: any) => (
                    <FarmerCard key={farmer.id} farmer={farmer} />
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Photo
                          </th>
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Full Name
                          </th>
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Sex
                          </th>
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Barangay
                          </th>
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Municipality
                          </th>
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Age
                          </th>
                          <th className="p-4 text-left font-semibold text-gray-700">
                            Applied
                          </th>
                          <th className="p-4 text-center font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {farmersData.farmers.map((farmer: any) => {
                          const fullName = [
                            farmer.firstname,
                            farmer.middleName,
                            farmer.surname,
                            farmer.extensionName,
                          ]
                            .filter(Boolean)
                            .join(" ");

                          const age = calculateAge(farmer.dateOfBirth);

                          return (
                            <tr
                              key={farmer.id}
                              className="border-b border-gray-100 transition-colors hover:bg-emerald-50/50"
                            >
                              <td className="p-4">
                                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-emerald-200">
                                  <Image
                                    src={farmer.farmerImage}
                                    alt={`${farmer.firstname} ${farmer.surname}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-medium text-gray-900">
                                  {fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {farmer.id}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" className="capitalize">
                                  {farmer.sex.toLowerCase()}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center">
                                  <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                                  {farmer.barangay}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center">
                                  <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                                  {farmer.municipalityOrCity}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                  {age} years
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    farmer.createdAt,
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                          updateStatusMutation.isPending
                                        }
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-48"
                                    >
                                      <DropdownMenuItem
                                        onClick={() =>
                                         router.push(
                                            "/admin/farmer/profile/" +
                                              farmer.id,
                                          )
                                        }
                                        className="cursor-pointer"
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusUpdate(
                                            farmer.id,
                                            fullName,
                                            "REGISTERED",
                                            farmer.email_address,
                                            farmer.contactNumber,
                                          )
                                        }
                                        className="cursor-pointer text-green-600 hover:text-green-700"
                                      >
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      {/* <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusUpdate(
                                            farmer.id,
                                            fullName,
                                            "NOT_QUALIFIED",
                                            farmer.email_address,
                                            farmer.contactNumber,
                                          )
                                        }
                                        className="cursor-pointer text-red-600 hover:text-red-700"
                                      >
                                        <UserX className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem> */}
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusUpdate(
                                            farmer.id,
                                            fullName,
                                            "ARCHIVED",
                                            farmer.email_address,
                                            farmer.contactNumber,
                                          )
                                        }
                                        className="cursor-pointer text-yellow-600 hover:text-yellow-700"
                                      >
                                        <UserX className="mr-2 h-4 w-4" />
                                        ARCHIVE
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Enhanced Mobile-First Pagination */}
                {farmersData.pages > 1 && (
                  <div className="mt-6 space-y-4">
                    {/* Results info */}
                    <div className="text-center text-sm text-gray-600 sm:text-left">
                      Showing {(currentPage - 1) * limit + 1} to{" "}
                      {Math.min(currentPage * limit, farmersData.total)} of{" "}
                      {farmersData.total} results
                    </div>

                    {/* Pagination controls */}
                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                      {/* Mobile-optimized pagination */}
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* First Page */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToFirstPage}
                          disabled={currentPage === 1}
                          className="px-2 sm:px-3"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        {/* Previous Page */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="px-2 sm:px-3"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="ml-1 hidden sm:inline">
                            Previous
                          </span>
                        </Button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 ${
                              currentPage === pageNum
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : ""
                            }`}
                          >
                            {pageNum}
                          </Button>
                        ))}

                        {/* Next Page */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === farmersData.pages}
                          className="px-2 sm:px-3"
                        >
                          <span className="mr-1 hidden sm:inline">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Last Page */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToLastPage}
                          disabled={currentPage === farmersData.pages}
                          className="px-2 sm:px-3"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No applicants found
                </h3>
                <p className="mx-auto max-w-md text-gray-500">
                  {dateRange.from || dateRange.to
                    ? "No farmer applications match the selected date range. Try adjusting your filters."
                    : "There are currently no farmer applications to review. New applications will appear here."}
                </p>
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="outline"
                    onClick={clearDateFilter}
                    className="mt-4"
                  >
                    Clear Date Filter
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Mobile-Optimized Confirmation Dialog */}
        {showConfirmDialog && selectedFarmer && (
          <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-red p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirm Status Update
                  </h3>
                  <button
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setSelectedFarmer(null);
                      setRejectionMessage("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="mb-3 text-gray-600">
                    Are you sure you want to{" "}
                    <span
                      className={`font-semibold ${
                        selectedFarmer.newStatus === "REGISTERED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedFarmer.newStatus === "REGISTERED"
                        ? "approve and register"
                        : "reject"}
                    </span>{" "}
                    this farmer?
                  </p>
                  <div className="mb-3 rounded-lg bg-gray-50 p-3">
                    <p className="font-medium text-gray-900">
                      {selectedFarmer.name}
                    </p>
                  </div>
                  {selectedFarmer.newStatus === "NOT_QUALIFIED" && (
                    <>
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-700">
                          ⚠️ This action will mark the farmer as not qualified and
                          they will be removed from the applicants list.
                        </p>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Reason for Rejection (optional)
                        </label>
                        <textarea
                          value={rejectionMessage}
                          onChange={(e) => setRejectionMessage(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          rows={3}
                          placeholder="Enter the reason for rejection..."
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setSelectedFarmer(null);
                      setRejectionMessage("");
                    }}
                    className="order-2 flex-1 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmStatusUpdate}
                    className={`order-1 flex-1 sm:order-2 ${
                      selectedFarmer.newStatus === "REGISTERED"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerApplicantsPage;