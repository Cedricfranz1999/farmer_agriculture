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

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
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
  const printRef = React.useRef<HTMLDivElement>(null);

  const {
    data: reportsData,
    isLoading,
    refetch,
  } = api.reports.getReportsData.useQuery({
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    reportType,
    search: searchTerm,
    status: status,
    farmerType: farmerType,
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Agricultural Reports - ${format(new Date(), "yyyy-MM-dd")}`,
  });

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    let headers: string[] = [];
    let rows: string[] = [];

    switch (reportType) {
      case "farmers":
        headers = [
          "id",
          "last name",
          "first name",
          "middle name",
          "ext name",
          "birthday",
          "st/purok/brgy",
          "municipality",
          "province",
          "gender",
          "organic practitioner",
          "plant",
          "hectare",
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
            `"${""}"`,
            `"${""}"`,
            `"${""}"`,
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
          "id",
          "amount",
          "allocation_type",
          "approved",
          "created_date",
          "farmer_name",
          "farmer_type",
          "municipality",
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
  };

  const handleExport = () => {
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
    }
  };

  const filteredData = useMemo(() => {
    if (!reportsData || !searchTerm) return reportsData;
    return {
      ...reportsData,
      farmersList: reportsData.farmersList?.filter(
        (farmer) =>
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farmer.municipality.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
      eventsList: reportsData.eventsList?.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
      concernsList: reportsData.concernsList?.filter(
        (concern) =>
          concern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          concern.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
      allocationsList: reportsData.allocationsList?.filter(
        (allocation) =>
          allocation.allocationType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allocation.farmers.some((farmer: any) => 
            farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
      ),
    };
  }, [reportsData, searchTerm]);

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
                <Select
                  value={status}
                  onValueChange={(value: any) => setStatus(value)}
                >
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
                  key={crypto.randomUUID()}
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
                {reportType === "overview" && filteredData && (
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
                            {filteredData.totalFarmers?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            +{filteredData.newFarmersThisMonth} this month
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
                            {filteredData.totalOrganicFarmers?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            +{filteredData.newOrganicFarmersThisMonth} this month
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
                            {filteredData.totalAllocations?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            ₱{filteredData.totalAllocationAmount?.toLocaleString()} total
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
                            {filteredData.totalEvents?.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            +{filteredData.newEventsThisMonth} this month
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
                            <AreaChart data={filteredData.registrationTrends}>
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
                                data={filteredData.statusDistribution}
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
                                {filteredData.statusDistribution?.map(
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
                          <BarChart data={filteredData.eventsByMonth}>
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
                {reportType === "farmers" && filteredData?.farmersList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <Users className="mr-2 h-5 w-5" />
                        Farmers Report ({filteredData.farmersList.length} records)
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
                            {filteredData.farmersList.map((farmer) => (
                              <TableRow key={crypto.randomUUID()}>
                                <TableCell className="font-medium">
                                  {farmer.name}
                                </TableCell>
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
                                <TableCell>
                                  {farmer.hectares} ha
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
                {reportType === "events" && filteredData?.eventsList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        Events Report ({filteredData.eventsList.length} records)
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
                            {filteredData.eventsList.map((event) => (
                              <TableRow key={crypto.randomUUID()}>
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
                {reportType === "concerns" && filteredData?.concernsList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <FileText className="mr-2 h-5 w-5" />
                        Concerns Report ({filteredData.concernsList.length} records)
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
                            {filteredData.concernsList.map((concern) => (
                              <TableRow key={crypto.randomUUID()}>
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
                {reportType === "allocations" && filteredData?.allocationsList && (
                  <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Allocations Report ({filteredData.allocationsList.length} records)
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
                            {filteredData.allocationsList.map((allocation) => (
                              <TableRow key={crypto.randomUUID()}>
                                <TableCell className="font-medium">
                                  {allocation.id}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <DollarSign className="mr-1 h-3 w-3" />
                                    ₱{allocation.amount.toLocaleString()}
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
                )}
              </div>
            </>
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