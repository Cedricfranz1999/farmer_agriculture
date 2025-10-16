"use client";

import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { usePathname } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search, Filter, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const AllocationsTable = () => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [farmerTypeFilter, setFarmerTypeFilter] = useState<string>("all");

  const { data: allocations, isLoading } = api.allocation.getAllAllocations.useQuery();

  // Filter based on route and additional filters
  const filteredAllocations = useMemo(() => {
    if (!allocations) return [];

    const routeFiltered = allocations.filter((allocation) => {
      const hasFarmer = allocation.farmers[0]?.farmer;
      const hasOrganicFarmer = allocation.farmers[0]?.organicFarmer;

      if (pathname.includes("/farmer") && !pathname.includes("/organic_farmer")) {
        return hasFarmer;
      }
      if (pathname.includes("/organic_farmer")) {
        return hasOrganicFarmer;
      }
      return true; // fallback, shows all
    });

    return routeFiltered.filter((allocation) => {
      const farmerName = allocation.farmers[0]?.farmer 
        ? `${allocation.farmers[0].farmer.firstname} ${allocation.farmers[0].farmer.surname}`
        : `${allocation.farmers[0]?.organicFarmer?.firstname} ${allocation.farmers[0]?.organicFarmer?.surname}`;

      const matchesSearch = 
        farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allocation.AllocationType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAllocationType = typeFilter === "all" || allocation.AllocationType === typeFilter;
      
      const matchesFarmerType = farmerTypeFilter === "all" || 
        (farmerTypeFilter === "farmer" && allocation.farmers[0]?.farmer) ||
        (farmerTypeFilter === "organic_farmer" && allocation.farmers[0]?.organicFarmer);

      const matchesDate = dateFilter === "all" || 
        (dateFilter === "today" && isToday(new Date(allocation.createdAt))) ||
        (dateFilter === "week" && isThisWeek(new Date(allocation.createdAt))) ||
        (dateFilter === "month" && isThisMonth(new Date(allocation.createdAt)));

      return matchesSearch && matchesAllocationType && matchesFarmerType && matchesDate;
    });
  }, [allocations, pathname, searchTerm, typeFilter, dateFilter, farmerTypeFilter]);

  const allocationTypes = useMemo(() => {
    if (!allocations) return [];
    const types = Array.from(new Set(allocations.map(a => a.AllocationType).filter(Boolean)));
    return types.filter(type => type && type.trim() !== "");
  }, [allocations]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= startOfWeek && date <= endOfWeek;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!allocations) return <div>No allocations found.</div>;

  return (
    <div className="  w-full p-6">
      <Card className=" w-full">
        <CardHeader>
          <CardTitle>All Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Allocation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {allocationTypes.map((type) => (
                  <SelectItem key={type} value={type as any}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={farmerTypeFilter} onValueChange={setFarmerTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Farmer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Farmers</SelectItem>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="organic_farmer">Organic Farmer</SelectItem>
              </SelectContent>
            </Select>
          </div>

        

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Farmer Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Allocation Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAllocations.map((allocation) => (
                  <tr key={allocation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {allocation.farmers[0]?.farmer ? (
                        <img
                          src={allocation.farmers[0].farmer.farmerImage}
                          alt="Farmer"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={
                            allocation.farmers[0]?.organicFarmer?.farmerImage
                          }
                          alt="Organic Farmer"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {allocation.farmers[0]?.farmer
                        ? `${allocation.farmers[0].farmer.firstname} ${allocation.farmers[0].farmer.surname}`
                        : `${allocation.farmers[0]?.organicFarmer?.firstname} ${allocation.farmers[0]?.organicFarmer?.surname}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {allocation.farmers[0]?.farmer
                        ? "Farmer"
                        : "Organic Farmer"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {allocation.AllocationType || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {allocation.amount} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(allocation.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAllocations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No allocations found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllocationsTable;