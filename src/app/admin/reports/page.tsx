"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import {
  FileText,
  Download,
  Printer,
  CalendarIcon,
  Search,
  Users,
  TrendingUp,
  BarChart3,
  PieChartIcon,
  Filter,
  RefreshCw,
  DollarSign,
  Crop,
  MapPin,
  X,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

// Define types based on your API response
interface Farmer {
  id: any;
  name: string;
  email: any;
  municipality: any;
  status: any;
  category: any;
  registrationDate: string;
  hectares: any;
  primaryCrop: any;
}

interface Event {
  id: number;
  title: string;
  location: string;
  eventDate: string;
  forFarmers: boolean;
  forOrganicFarmers: boolean;
  createdDate: string;
}

interface Concern {
  id: number;
  title: string;
  description: string;
  farmerName: string;
  status: string;
  messageCount: number;
  createdDate: string;
}

interface Allocation {
  id: any;
  amount: number;
  allocationType?: string;
  approved: boolean;
  farmers: any[];
  createdAt: string;
}

const ReportsPage = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState<
    "farmers" | "events" | "concerns" | "overview" | "allocations"
  >("overview");
  const [status, setStatus] = useState<
    "ARCHIVED" | "APPLICANTS" | "REGISTERED" | "NOT_QUALIFIED" | "ALL"
  >("ALL");
  const [farmerType, setFarmerType] = useState<"all" | "farmer" | "organic">("all");
  const [exportFormat, setExportFormat] = useState<"csv" | "print">("csv");
  const [searchQuery, setSearchQuery] = useState("");
  const printRef = React.useRef<HTMLDivElement>(null);

  const {
    data: reportsData,
    isLoading,
    refetch,
  } = api.reports.getReportsData.useQuery({
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    reportType,
    search: searchQuery,
    status: status,
    farmerType: farmerType,
  });

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Agricultural Reports - ${format(new Date(), "yyyy-MM-dd")}`,
    pageStyle: `
      @media print {
        @page {
          margin: 0.5in;
        }
        body {
          -webkit-print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .print-header {
          display: flex !important;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #10b981;
        }
        .print-logo {
          height: 60px;
          width: auto;
        }
        .print-title {
          text-align: center;
          flex-grow: 1;
          margin: 0 20px;
        }
        .print-footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .print-table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-table th,
        .print-table td {
          border: 1px solid #d1d5db;
          padding: 8px;
          text-align: left;
        }
        .print-table th {
          background-color: #f3f4f6;
          font-weight: bold;
        }
      }
    `,
  });

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    let headers: string[] = [];
    let rows: string[] = [];

    try {
      switch (reportType) {
        case "farmers":
          headers = [
            "ID",
            "Name",
            "Email",
            "Municipality",
            "Status",
            "Category",
            "Primary Crop",
            "Hectares",
            "Registration Date"
          ];
          
          rows = data.map((row: Farmer) => {
            return [
              row.id || "",
              `"${row.name}"`,
              `"${row.email || ''}"`,
              `"${row.municipality}"`,
              `"${row.status}"`,
              `"${row.category}"`,
              `"${row.primaryCrop || 'Various'}"`,
              `"${row.hectares || 0}"`,
              `"${row.registrationDate}"`
            ].join(",");
          });
          break;

        case "allocations":
          headers = [
            "ID",
            "Amount",
            "Allocation Type",
            "Approved",
            "Created Date",
            "Farmer Name",
            "Farmer Type",
            "Municipality",
            "Farmer Status"
          ];
          
          rows = data.flatMap((allocation: Allocation) => 
            allocation.farmers?.map((farmer: any) => [
              allocation.id,
              allocation.amount,
              `"${allocation.allocationType || "N/A"}"`,
              allocation.approved ? "Yes" : "No",
              `"${allocation.createdAt}"`,
              `"${farmer.name}"`,
              `"${farmer.type}"`,
              `"${farmer.municipality}"`,
              `"${farmer.status}"`
            ].join(",")) || []
          );
          break;

        case "events":
          headers = [
            "ID",
            "Title",
            "Location",
            "Event Date",
            "Target Farmers",
            "Target Organic Farmers",
            "Created Date"
          ];
          
          rows = data.map((event: Event) => [
            event.id,
            `"${event.title}"`,
            `"${event.location}"`,
            `"${event.eventDate}"`,
            event.forFarmers ? "Yes" : "No",
            event.forOrganicFarmers ? "Yes" : "No",
            `"${event.createdDate}"`
          ].join(","));
          break;

        case "concerns":
          headers = [
            "ID",
            "Title",
            "Description",
            "Farmer Name",
            "Status",
            "Message Count",
            "Created Date"
          ];
          
          rows = data.map((concern: Concern) => [
            concern.id,
            `"${concern.title}"`,
            `"${concern.description}"`,
            `"${concern.farmerName}"`,
            `"${concern.status}"`,
            concern.messageCount,
            `"${concern.createdDate}"`
          ].join(","));
          break;

        default:
          headers = Object.keys(data[0] || {});
          rows = data.map(row => 
            headers.map(header => {
              const value = row[header];
              if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return `"${value || ''}"`;
            }).join(',')
          );
      }

      const csvContent = [
        headers.join(","),
        ...rows,
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  const handleExport = () => {
    if (!reportsData) {
      alert("No data available to export.");
      return;
    }

    if (exportFormat === "print") {
      handlePrint();
    } else {
      try {
        switch (reportType) {
          case "farmers":
            exportToCSV(reportsData.farmersList || [], "farmers-report");
            break;
          case "events":
            exportToCSV(reportsData.eventsList || [], "events-report");
            break;
          case "concerns":
            exportToCSV(reportsData.concernsList || [], "concerns-report");
            break;
          case "allocations":
            exportToCSV(reportsData.allocationsList || [], "allocations-report");
            break;
          default:
            exportToCSV(
              [
                {
                  metric: "Total Farmers",
                  value: reportsData.totalFarmers,
                },
                {
                  metric: "Total Organic Farmers",
                  value: reportsData.totalOrganicFarmers,
                },
                {
                  metric: "Total Events",
                  value: reportsData.totalEvents,
                },
                {
                  metric: "Total Concerns",
                  value: reportsData.totalConcerns,
                },
                {
                  metric: "Total Allocations",
                  value: reportsData.totalAllocations,
                },
                {
                  metric: "Total Allocation Amount",
                  value: reportsData.totalAllocationAmount,
                },
              ],
              "overview-report",
            );
        }
      } catch (error) {
        console.error("Export error:", error);
        alert("Error during export. Please try again.");
      }
    }
  };

  const handleRefetch = () => {
    setSearchTerm("");
    setSearchQuery("");
    refetch();
  };

  const PrintHeader = () => (
    <div className="print-header no-print" style={{ display: 'none' }}>
      <img 
        src="/header.png" 
        alt="Left Logo" 
        className="print-logo"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <div className="print-title">
        <h1 style={{ margin: 0, color: '#065f46', fontSize: '24px' }}>
          Agricultural Reports & Analytics
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#374151', fontSize: '14px' }}>
          Comprehensive insights and data analysis for agricultural management
        </p>
        <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
          Report Period: {dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "N/A"} - {dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "N/A"}
        </p>
      </div>
      <img 
        src="/header.png" 
        alt="Right Logo" 
        className="print-logo"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );

  const PrintFooter = () => (
    <div className="print-footer no-print" style={{ display: 'none' }}>
      <p>
        Report generated on {format(new Date(), "PPPP")} at {format(new Date(), "p")}
        {searchQuery && ` • Search: "${searchQuery}"`}
        {status !== "ALL" && ` • Status: ${status}`}
        {farmerType !== "all" && ` • Farmer Type: ${farmerType}`}
      </p>
      <p style={{ marginTop: '5px', fontSize: '10px' }}>
        Agricultural Management System © {new Date().getFullYear()}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-4xl font-bold text-transparent">
            Agricultural Reports & Analytics
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Comprehensive insights and data analysis for agricultural management
          </p>
        </div>

        {/* Print Header - Hidden in normal view */}
        <PrintHeader />

        <Card className="mb-6 border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm no-print">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <Filter className="mr-2 h-5 w-5" />
              Filters & Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={status}
                  onValueChange={(value: any) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="NOT_QUALIFIED">NOT QUALIFIED</SelectItem>
                    <SelectItem value="REGISTERED">REGISTERED</SelectItem>
                    <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                    <SelectItem value="APPLICANTS">APPLICANTS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Report Type
                </label>
                <Select
                  value={reportType}
                  onValueChange={(value: any) => setReportType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="farmers">Farmers</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="concerns">Concerns</SelectItem>
                    <SelectItem value="allocations">Allocations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(reportType === "farmers" || reportType === "overview") && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Farmer Type
                  </label>
                  <Select
                    value={farmerType}
                    onValueChange={(value: any) => setFarmerType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Farmers</SelectItem>
                      <SelectItem value="farmer">Regular Farmers</SelectItem>
                      <SelectItem value="organic">Organic Farmers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    variant="outline"
                    className="bg-emerald-50 hover:bg-emerald-100"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  {searchQuery && (
                    <Button
                      onClick={handleClearSearch}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Export
                </label>
                <div className="flex space-x-2">
                  <Select
                    value={exportFormat}
                    onValueChange={(value: any) => setExportFormat(value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="print">Print</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleExport}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {exportFormat === "csv" ? (
                      <Download className="h-4 w-4" />
                    ) : (
                      <Printer className="h-4 w-4" />
                    )}
                  </Button>
                  <Button onClick={handleRefetch} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="border-emerald-200 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div ref={printRef}>
                {/* Print Header for print view */}
                <PrintHeader />

                {reportType === "overview" && reportsData && (
                  <>
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Farmers
                          </CardTitle>
                          <Users className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-emerald-700">
                            {reportsData.totalFarmers?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            +{reportsData.newFarmersThisMonth || 0} this month
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Organic Farmers
                          </CardTitle>
                          <Users className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-700">
                            {reportsData.totalOrganicFarmers?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            +{reportsData.newOrganicFarmersThisMonth || 0} this month
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Allocations
                          </CardTitle>
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-700">
                            {reportsData.totalAllocations?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            ₱{reportsData.totalAllocationAmount?.toLocaleString()} total
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Events
                          </CardTitle>
                          <CalendarIcon className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-700">
                            {reportsData.totalEvents?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            +{reportsData.newEventsThisMonth || 0} this month
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center text-emerald-700">
                            <TrendingUp className="mr-2 h-5 w-5" />
                            Registration Trends
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={reportsData.registrationTrends || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Area
                                type="monotone"
                                dataKey="farmers"
                                stackId="1"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.6}
                              />
                              <Area
                                type="monotone"
                                dataKey="organicFarmers"
                                stackId="1"
                                stroke="#059669"
                                fill="#059669"
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center text-emerald-700">
                            <PieChartIcon className="mr-2 h-5 w-5" />
                            Registration Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={reportsData.statusDistribution || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                  `${name} ${(percent as any * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {(reportsData.statusDistribution || []).map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="mb-6 border-emerald-200 bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-emerald-700">
                          <BarChart3 className="mr-2 h-5 w-5" />
                          Events by Month
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={reportsData.eventsByMonth || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="events" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                )}
                {reportType === "farmers" && reportsData?.farmersList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <Users className="mr-2 h-5 w-5" />
                        Farmers Report ({reportsData.farmersList.length} records)
                        {searchQuery && (
                          <Badge variant="secondary" className="ml-2">
                            Search: "{searchQuery}"
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Municipality</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Primary Crop</TableHead>
                              <TableHead>Hectares</TableHead>
                              <TableHead>Registration Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(reportsData.farmersList as Farmer[]).map((farmer, index) => (
                              <TableRow key={farmer.id || `farmer-${index}`}>
                                <TableCell className="font-medium">
                                  {farmer.name}
                                </TableCell>
                                <TableCell>{farmer.email || "N/A"}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {farmer.municipality}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      farmer.status === "REGISTERED"
                                        ? "default"
                                        : farmer.status === "APPLICANTS"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {farmer.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      farmer.category === "ORGANIC_FARMER"
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    {farmer.category}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Crop className="mr-1 h-3 w-3" />
                                    {farmer.primaryCrop || "Various"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {farmer.hectares || 0} ha
                                </TableCell>
                                <TableCell>{farmer.registrationDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {reportType === "events" && reportsData?.eventsList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        Events Report ({reportsData.eventsList.length} records)
                        {searchQuery && (
                          <Badge variant="secondary" className="ml-2">
                            Search: "{searchQuery}"
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Target Audience</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(reportsData.eventsList as Event[]).map((event, index) => (
                              <TableRow key={event.id || `event-${index}`}>
                                <TableCell className="font-medium">
                                  {event.title}
                                </TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>{event.eventDate}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-1">
                                    {event.forFarmers && (
                                      <Badge variant="outline">Farmers</Badge>
                                    )}
                                    {event.forOrganicFarmers && (
                                      <Badge variant="outline">Organic</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{event.createdDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {reportType === "concerns" && reportsData?.concernsList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <FileText className="mr-2 h-5 w-5" />
                        Concerns Report ({reportsData.concernsList.length} records)
                        {searchQuery && (
                          <Badge variant="secondary" className="ml-2">
                            Search: "{searchQuery}"
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Farmer</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Messages</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(reportsData.concernsList as Concern[]).map((concern, index) => (
                              <TableRow key={concern.id || `concern-${index}`}>
                                <TableCell className="font-medium">
                                  {concern.title}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {concern.description}
                                </TableCell>
                                <TableCell>{concern.farmerName}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      concern.status === "RESOLVED"
                                        ? "default"
                                        : concern.status === "IN_PROGRESS"
                                          ? "secondary"
                                          : concern.status === "OPEN"
                                            ? "destructive"
                                            : "outline"
                                    }
                                  >
                                    {concern.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{concern.messageCount}</TableCell>
                                <TableCell>{concern.createdDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {reportType === "allocations" && reportsData?.allocationsList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Allocations Report ({reportsData.allocationsList.length} records)
                        {searchQuery && (
                          <Badge variant="secondary" className="ml-2">
                            Search: "{searchQuery}"
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Approved</TableHead>
                              <TableHead>Farmers</TableHead>
                              <TableHead>Created Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(reportsData.allocationsList as Allocation[]).map((allocation, index) => (
                              <TableRow key={allocation.id || `allocation-${index}`}>
                                <TableCell className="font-medium">
                                  {allocation.id}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <DollarSign className="mr-1 h-3 w-3" />
                                    ₱{allocation.amount?.toLocaleString()}
                                  </div>
                                </TableCell>
                                <TableCell>{allocation.allocationType || "N/A"}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={allocation.approved ? "default" : "secondary"}
                                  >
                                    {allocation.approved ? "Approved" : "Pending"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-xs">
                                    {(allocation.farmers || []).map((farmer: any, farmerIndex: number) => (
                                      <div key={farmerIndex} className="text-xs">
                                        {farmer.name} ({farmer.type})
                                      </div>
                                    ))}
                                    {(!allocation.farmers || allocation.farmers.length === 0) && (
                                      <div className="text-xs text-gray-500">No farmers assigned</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {allocation.createdAt}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Print Footer */}
                <PrintFooter />
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center no-print">
          <p className="text-sm text-slate-500">
            Report generated on {format(new Date(), "PPPP")} at{" "}
            {format(new Date(), "p")}
            {searchQuery && ` • Search: "${searchQuery}"`}
            {status !== "ALL" && ` • Status: ${status}`}
            {farmerType !== "all" && ` • Farmer Type: ${farmerType}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;