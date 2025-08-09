"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import {
  Users,
  UserX,
  UserCheck,
  Clock,
  Calendar,
  MessageSquare,
  Sprout,
  TrendingUp,
  Leaf,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

const DashboardPage = () => {
  // Fetch all dashboard data in parallel
  const dashboardData = api.dashboardData.getStats.useQuery(undefined, {
    refetchInterval: 60000, // Refresh every minute
  });

  const statsConfig = [
    {
      title: "Farmer Applicants",
      value: dashboardData.data?.farmerApplicants || 0,
      change: dashboardData.data?.newFarmerApplicantsToday || 0,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Organic Farmer Applicants",
      value: dashboardData.data?.organicFarmerApplicants || 0,
      change: dashboardData.data?.newOrganicFarmerApplicantsToday || 0,
      icon: Sprout,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Registered Farmers",
      value: dashboardData.data?.registeredFarmers || 0,
      change: dashboardData.data?.newRegisteredFarmersToday || 0,
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Registered Organic Farmers",
      value: dashboardData.data?.registeredOrganicFarmers || 0,
      change: dashboardData.data?.newRegisteredOrganicFarmersToday || 0,
      icon: Leaf,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Not Qualified Farmers",
      value: dashboardData.data?.notQualifiedFarmers || 0,
      change: dashboardData.data?.newNotQualifiedFarmersToday || 0,
      icon: UserX,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Not Qualified Organic Farmers",
      value: dashboardData.data?.notQualifiedOrganicFarmers || 0,
      change: dashboardData.data?.newNotQualifiedOrganicFarmersToday || 0,
      icon: UserX,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Events",
      value: dashboardData.data?.totalEvents || 0,
      change: dashboardData.data?.newEventsToday || 0,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Concerns",
      value: dashboardData.data?.totalConcerns || 0,
      change: dashboardData.data?.newConcernsToday || 0,
      icon: MessageSquare,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="fade min-h-[700px] rounded-md bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="container px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-4xl font-bold text-emerald-600 sm:text-5xl">
            Farmer Dashboard Overview
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Real-time insights for agricultural management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="fadeInDown 1s forwards mx-auto max-w-7xl ease-out">
          {dashboardData.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="mb-2 h-8 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {statsConfig.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                    />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 sm:text-base">
                        {stat.title}
                      </CardTitle>
                      <div
                        className={`rounded-full p-2 ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${stat.iconColor} sm:h-5 sm:w-5`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="relative pt-0">
                      <div className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">
                        {stat.value.toLocaleString()}
                      </div>
                      <div
                        className={`flex items-center space-x-1 rounded-md ${
                          stat.change !== 0
                            ? "bg-emerald-400 py-1 text-white"
                            : "bg-white"
                        } `}
                      >
                        <TrendingUp className="h-3 w-3 text-white" />
                        <p className="text-xs text-white sm:text-sm">
                          <span className="font-medium text-white">
                            +{stat.change}
                          </span>{" "}
                          today
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Additional Stats Section */}
        {!dashboardData.isLoading && dashboardData.data && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-700">
                  <Users className="mr-2 h-5 w-5" />
                  Registration Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Farmers:
                    </span>
                    <span className="font-semibold">
                      {(
                        dashboardData.data.farmerApplicants +
                        dashboardData.data.registeredFarmers +
                        dashboardData.data.notQualifiedFarmers
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Organic:
                    </span>
                    <span className="font-semibold">
                      {(
                        dashboardData.data.organicFarmerApplicants +
                        dashboardData.data.registeredOrganicFarmers +
                        dashboardData.data.notQualifiedOrganicFarmers
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-700">
                  <Calendar className="mr-2 h-5 w-5" />
                  Todays Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      New Applications:
                    </span>
                    <span className="font-semibold text-blue-600">
                      {(
                        dashboardData.data.newFarmerApplicantsToday +
                        dashboardData.data.newOrganicFarmerApplicantsToday
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      New Registrations:
                    </span>
                    <span className="font-semibold text-green-600">
                      {(
                        dashboardData.data.newRegisteredFarmersToday +
                        dashboardData.data.newRegisteredOrganicFarmersToday
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-700">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Concerns Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Farmer Concerns:
                    </span>
                    <span className="font-semibold">
                      {dashboardData.data.farmerConcerns.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Organic Concerns:
                    </span>
                    <span className="font-semibold">
                      {dashboardData.data.organicFarmerConcerns.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
