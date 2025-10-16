"use client";
import React, { useState, useMemo, useCallback } from "react";
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
  AreaChart,
  Area,
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

// Memoized chart components to prevent unnecessary re-renders
const MemoizedAreaChart = React.memo(AreaChart);
const MemoizedPieChart = React.memo(PieChart);
const MemoizedBarChart = React.memo(BarChart);

// Types for better type safety
type ReportType = "farmers" | "events" | "concerns" | "overview" | "allocations";
type StatusType = "ARCHIVED" | "APPLICANTS" | "REGISTERED" | "NOT_QUALIFIED" | "ALL";
type FarmerType = "all" | "farmer" | "organic";
type ExportFormat = "csv" | "print";

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState<ReportType>("overview");
  const [status, setStatus] = useState<StatusType>("ALL");
  const [farmerType, setFarmerType] = useState<FarmerType>("all");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const printRef = React.useRef<HTMLDivElement>(null);

  // Optimized query with stable parameters
  const queryParams = useMemo(() => ({
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    reportType,
    search: searchTerm,
    status: status === "ALL" ? undefined : status,
    farmerType: farmerType === "all" ? undefined : farmerType,
  }), [dateRange?.from, dateRange?.to, reportType, searchTerm, status, farmerType]);

  const {
    data: reportsData,
    isLoading,
    refetch,
  } = api.reports.getReportsData.useQuery(queryParams);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Agricultural Reports - ${format(new Date(), "yyyy-MM-dd")}`,
  });

  // Optimized export function with useCallback
  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    let headers: string[] = [];
    let rows: string[] = [];

    switch (reportType) {
      case "farmers":
        headers = [
          "id", "last name", "first name", "middle name", "ext name", 
          "birthday", "st/purok/brgy", "municipality", "province", 
          "gender", "organic practitioner", "plant", "hectare"
        ];
        rows = data.map((row) => {
          const nameParts = row.name.split(" ");
          const lastName = nameParts[1] || "";
          const firstName = nameParts[0] || "";
          const middleName = nameParts[2] || "";
          const organicPractitioner = row.category === "ORGANIC_FARMER" ? "yes" : "no";
          const plant = row.primaryCrop || "Various";
          const hectare = row.hectares?.toString() || "0";

          return [
            row.id || "",
            `"${lastName}"`,
            `"${firstName}"`,
            `"${middleName}"`,
            `""`,
            `""`,
            `""`,
            `"${row.municipality}"`,
            `"Pampanga"`,
            `"Male"`,
            `"${organicPractitioner}"`,
            `"${plant}"`,
            `"${hectare}"`,
          ].join(",");
        });
        break;

      case "allocations":
        headers = [
          "id", "amount", "allocation_type", "approved", "created_date", 
          "farmer_name", "farmer_type", "municipality"
        ];
        rows = data.flatMap((allocation) => 
          allocation.farmers.map((farmer: any) => [
            allocation.id,
            allocation.amount,
            allocation.allocationType || "",
            allocation.approved ? "yes" : "no",
            allocation.createdAt,
            farmer.name,
            farmer.type,
            farmer.municipality,
          ].join(","))
        );
        break;

      default:
        headers = Object.keys(data[0] || {});
        rows = data.map(row => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        );
    }

    const csvContent = [headers.join(","), ...rows].join("\n");
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
  }, [reportType]);

  const handleExport = useCallback(() => {
    if (!reportsData) return;
    
    if (exportFormat === "print") {
      handlePrint();
    } else {
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
              { metric: "Total Farmers", value: reportsData.totalFarmers },
              { metric: "Total Organic Farmers", value: reportsData.totalOrganicFarmers },
              { metric: "Total Events", value: reportsData.totalEvents },
              { metric: "Total Concerns", value: reportsData.totalConcerns },
              { metric: "Total Allocations", value: reportsData.totalAllocations },
              { metric: "Total Allocation Amount", value: reportsData.totalAllocationAmount },
            ],
            "overview-report",
          );
      }
    }
  }, [reportsData, exportFormat, reportType, exportToCSV, handlePrint]);

  // Optimized filtered data with better search performance
  const filteredData = useMemo(() => {
    if (!reportsData || !searchTerm) return reportsData;
    
    const searchLower = searchTerm.toLowerCase();
    
    return {
      ...reportsData,
      farmersList: reportsData.farmersList?.filter(
        (farmer) =>
          farmer.name.toLowerCase().includes(searchLower) ||
          farmer.email.toLowerCase().includes(searchLower) ||
          farmer.municipality.toLowerCase().includes(searchLower),
      ),
      eventsList: reportsData.eventsList?.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower),
      ),
      concernsList: reportsData.concernsList?.filter(
        (concern) =>
          concern.title.toLowerCase().includes(searchLower) ||
          concern.description.toLowerCase().includes(searchLower),
      ),
      allocationsList: reportsData.allocationsList?.filter(
        (allocation) =>
          allocation.allocationType?.toLowerCase().includes(searchLower) ||
          allocation.farmers.some((farmer: any) => 
            farmer.name.toLowerCase().includes(searchLower)
          ),
      ),
    };
  }, [reportsData, searchTerm]);

  // Memoized chart data and components
  const overviewCards = useMemo(() => [
    {
      title: "Total Farmers",
      value: filteredData?.totalFarmers,
      change: `+${filteredData?.newFarmersThisMonth} this month`,
      icon: Users,
      color: "text-emerald-700",
      iconColor: "text-emerald-600"
    },
    {
      title: "Organic Farmers",
      value: filteredData?.totalOrganicFarmers,
      change: `+${filteredData?.newOrganicFarmersThisMonth} this month`,
      icon: Users,
      color: "text-green-700",
      iconColor: "text-green-600"
    },
    {
      title: "Total Allocations",
      value: filteredData?.totalAllocations,
      change: `₱${filteredData?.totalAllocationAmount?.toLocaleString()} total`,
      icon: DollarSign,
      color: "text-blue-700",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Events",
      value: filteredData?.totalEvents,
      change: `+${filteredData?.newEventsThisMonth} this month`,
      icon: CalendarIcon,
      color: "text-purple-700",
      iconColor: "text-purple-600"
    }
  ], [filteredData]);

  const renderOverview = useMemo(() => (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, index) => (
          <Card key={index} className="border-emerald-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value?.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
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
              <MemoizedAreaChart data={filteredData?.registrationTrends}>
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
              </MemoizedAreaChart>
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
              <MemoizedPieChart>
                <Pie
                  data={filteredData?.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent as any) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {filteredData?.statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </MemoizedPieChart>
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
            <MemoizedBarChart data={filteredData?.eventsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="events" fill="#3b82f6" />
            </MemoizedBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  ), [filteredData, overviewCards]);

  const renderFarmersReport = useMemo(() => (
    <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-emerald-700">
          <Users className="mr-2 h-5 w-5" />
          Farmers Report ({filteredData?.farmersList?.length || 0} records)
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
              {filteredData?.farmersList?.map((farmer) => (
                <TableRow key={farmer.id || crypto.randomUUID()}>
                  <TableCell className="font-medium">{farmer.name}</TableCell>
                  <TableCell>{farmer.email}</TableCell>
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
                      {farmer.primaryCrop}
                    </div>
                  </TableCell>
                  <TableCell>{farmer.hectares} ha</TableCell>
                  <TableCell>{farmer.registrationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  ), [filteredData?.farmersList]);

  const renderEventsReport = useMemo(() => (
    <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-emerald-700">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Events Report ({filteredData?.eventsList?.length || 0} records)
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
              {filteredData?.eventsList?.map((event) => (
                <TableRow key={event.id || crypto.randomUUID()}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.eventDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {event.forFarmers && <Badge variant="outline">Farmers</Badge>}
                      {event.forOrganicFarmers && <Badge variant="outline">Organic</Badge>}
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
  ), [filteredData?.eventsList]);

  const renderConcernsReport = useMemo(() => (
    <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-emerald-700">
          <FileText className="mr-2 h-5 w-5" />
          Concerns Report ({filteredData?.concernsList?.length || 0} records)
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
              {filteredData?.concernsList?.map((concern) => (
                <TableRow key={concern.id || crypto.randomUUID()}>
                  <TableCell className="font-medium">{concern.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{concern.description}</TableCell>
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
  ), [filteredData?.concernsList]);

  const renderAllocationsReport = useMemo(() => (
    <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-emerald-700">
          <DollarSign className="mr-2 h-5 w-5" />
          Allocations Report ({filteredData?.allocationsList?.length || 0} records)
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
              {filteredData?.allocationsList?.map((allocation) => (
                <TableRow key={allocation.id || crypto.randomUUID()}>
                  <TableCell className="font-medium">{allocation.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3" />
                      ₱{allocation.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{allocation.allocationType || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={allocation.approved ? "default" : "secondary"}>
                      {allocation.approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {allocation.farmers.map((farmer: any, index: number) => (
                        <div key={index} className="text-xs">
                          {farmer.name} ({farmer.type})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{allocation.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  ), [filteredData?.allocationsList]);

  const renderReportContent = useMemo(() => {
    switch (reportType) {
      case "overview":
        return renderOverview;
      case "farmers":
        return renderFarmersReport;
      case "events":
        return renderEventsReport;
      case "concerns":
        return renderConcernsReport;
      case "allocations":
        return renderAllocationsReport;
      default:
        return null;
    }
  }, [reportType, renderOverview, renderFarmersReport, renderEventsReport, renderConcernsReport, renderAllocationsReport]);

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
        
        <Card className="mb-6 border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
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
                <Select value={status} onValueChange={setStatus as any}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="NOT_QUALIFIED">NOT_QUALIFIED</SelectItem>
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
                <Select value={reportType} onValueChange={setReportType as any}>
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
                  <Select value={farmerType} onValueChange={setFarmerType as any}>
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
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Export
                </label>
                <div className="flex space-x-2">
                  <Select value={exportFormat} onValueChange={setExportFormat as any}>
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
                  <Button onClick={() => refetch()} size="sm" variant="outline">
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
            <div ref={printRef}>
              {renderReportContent}
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Report generated on {format(new Date(), "PPP")} at{" "}
            {format(new Date(), "p")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;