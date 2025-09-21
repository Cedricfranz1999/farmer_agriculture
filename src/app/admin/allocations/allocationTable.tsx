"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { usePathname } from "next/navigation";

const AllocationsTable = () => {
  const pathname = usePathname();

  const { data: allocations, isLoading } =
    api.allocation.getAllAllocations.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!allocations) return <div>No allocations found.</div>;

  // Filter based on route
  const filteredAllocations = allocations.filter((allocation) => {
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

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Allocations</CardTitle>
        </CardHeader>
        <CardContent>
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
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
                      {allocation.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllocationsTable;
