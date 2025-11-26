import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export const reportsRouter = createTRPCRouter({
  getReportsData: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        status: z.any().optional(),
        endDate: z.date().optional(),
        reportType: z.enum([
          "farmers", 
          "events", 
          "concerns", 
          "overview", 
          "allocations", 
          "allocation-analysis",
          "allocation-types"
        ]),
        search: z.string().optional(),
        farmerType: z.enum(["all", "farmer", "organic"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, reportType, search, farmerType } = input;

      const defaultStartDate = startDate || new Date(new Date().getFullYear(), 0, 1);
      const defaultEndDate = endDate || new Date();

      const dateFilter = {
        createdAt: {
          gte: defaultStartDate,
          lte: defaultEndDate,
        },
      };

      if (reportType === "overview") {
        const farmerWhereClause = {
          status: input.status !== "ALL" ? input.status : undefined,
          ...dateFilter,
        };

        const organicFarmerWhereClause = {
          status: input.status !== "ALL" ? input.status : undefined,
          ...dateFilter,
        };

        const [
          totalFarmers,
          totalOrganicFarmers,
          totalEvents,
          totalConcerns,
          newFarmersThisMonth,
          newOrganicFarmersThisMonth,
          newEventsThisMonth,
          newConcernsThisMonth,
          totalAllocations,
          farmersWithAllocations,
          farmersWithoutAllocations,
          organicFarmersWithAllocations,
          organicFarmersWithoutAllocations,
          allocationTypeStats,
        ] = await Promise.all([
          ctx.db.farmer.count({
            where: farmerWhereClause,
          }),
          ctx.db.organic_Farmer.count({
            where: organicFarmerWhereClause,
          }),
          ctx.db.events.count({ where: dateFilter }),
          (await ctx.db.farmerConcern.count({ where: dateFilter })) +
            (await ctx.db.organicFarmerConcern.count({ where: dateFilter })),
          ctx.db.farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              createdAt: {
                gte: startOfMonth(new Date()),
                lte: endOfMonth(new Date()),
              },
            },
          }),
          ctx.db.organic_Farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              createdAt: {
                gte: startOfMonth(new Date()),
                lte: endOfMonth(new Date()),
              },
            },
          }),
          ctx.db.events.count({
            where: {
              createdAt: {
                gte: startOfMonth(new Date()),
                lte: endOfMonth(new Date()),
              },
            },
          }),
          (await ctx.db.farmerConcern.count({
            where: {
              createdAt: {
                gte: startOfMonth(new Date()),
                lte: endOfMonth(new Date()),
              },
            },
          })) +
            (await ctx.db.organicFarmerConcern.count({
              where: {
                createdAt: {
                  gte: startOfMonth(new Date()),
                  lte: endOfMonth(new Date()),
                },
              },
            })),
          ctx.db.allocation.count({
            where: dateFilter,
          }),
          // Farmers with allocations
          ctx.db.farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
              allocations: {
                some: {}
              }
            },
          }),
          // Farmers without allocations
          ctx.db.farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
              allocations: {
                none: {}
              }
            },
          }),
          // Organic farmers with allocations
          ctx.db.organic_Farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
              allocations: {
                some: {}
              }
            },
          }),
          // Organic farmers without allocations
          ctx.db.organic_Farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
              allocations: {
                none: {}
              }
            },
          }),
          // Allocation type statistics
          ctx.db.allocation.groupBy({
            by: ['AllocationType'],
            where: dateFilter,
            _count: {
              _all: true,
            },
          }),
        ]);

        // Process allocation type stats
        const processedAllocationTypeStats = allocationTypeStats.map(stat => ({
          allocationType: stat.AllocationType || 'Unknown',
          count: stat._count._all,
        }));

        const registrationTrends = [];
        for (let i = 11; i >= 0; i--) {
          const monthStart = startOfMonth(subMonths(new Date(), i));
          const monthEnd = endOfMonth(subMonths(new Date(), i));

          const [farmers, organicFarmers] = await Promise.all([
            ctx.db.farmer.count({
              where: {
                status: input.status !== "ALL" ? input.status : undefined,
                createdAt: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            }),
            ctx.db.organic_Farmer.count({
              where: {
                status: input.status !== "ALL" ? input.status : undefined,
                createdAt: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            }),
          ]);

          registrationTrends.push({
            month: format(monthStart, "MMM yyyy"),
            farmers,
            organicFarmers,
          });
        }

        const eventsByMonth = [];
        for (let i = 11; i >= 0; i--) {
          const monthStart = startOfMonth(subMonths(new Date(), i));
          const monthEnd = endOfMonth(subMonths(new Date(), i));

          const events = await ctx.db.events.count({
            where: {
              createdAt: {
                gte: monthStart,
                lte: monthEnd,
              },
            },
          });

          eventsByMonth.push({
            month: format(monthStart, "MMM yyyy"),
            events,
          });
        }

        return {
          totalFarmers,
          totalOrganicFarmers,
          totalEvents,
          totalConcerns,
          totalAllocations,
          newFarmersThisMonth,
          newOrganicFarmersThisMonth,
          newEventsThisMonth,
          newConcernsThisMonth,
          farmersWithAllocations,
          farmersWithoutAllocations,
          organicFarmersWithAllocations,
          organicFarmersWithoutAllocations,
          allocationTypeStats: processedAllocationTypeStats,
          registrationTrends,
          eventsByMonth,
        };
      }

      if (reportType === "farmers") {
        const searchFilter = search
          ? {
              OR: [
                {
                  firstname: { contains: search, mode: "insensitive" as const },
                },
                { 
                  surname: { contains: search, mode: "insensitive" as const } 
                },
                { 
                  email_address: { 
                    contains: search, 
                    mode: "insensitive" as const 
                  } 
                },
                {
                  municipalityOrCity: { 
                    contains: search, 
                    mode: "insensitive" as const 
                  }
                },
                {
                  barangay: { 
                    contains: search, 
                    mode: "insensitive" as const 
                  }
                },
                {
                  province: { 
                    contains: search, 
                    mode: "insensitive" as const 
                  }
                },
                {
                  region: { 
                    contains: search, 
                    mode: "insensitive" as const 
                  }
                }
              ],
            }
          : {};

        const farmerWhereClause = {
          status: input.status !== "ALL" ? input.status : undefined,
          ...dateFilter,
          ...searchFilter,
        };

        const organicFarmerWhereClause = {
          status: input.status !== "ALL" ? input.status : undefined,
          ...dateFilter,
          ...searchFilter,
        };

        const queries = [];

        if (farmerType === "all" || farmerType === "farmer") {
          queries.push(
            ctx.db.farmer.findMany({
              where: farmerWhereClause,
              select: {
                id: true,
                firstname: true,
                surname: true,
                email_address: true,
                municipalityOrCity: true,
                status: true,
                categoryType: true,
                createdAt: true,
                farmDetails: {
                  include: {
                    lotDetails: true,
                  },
                },
                farmerDetails: true,
                allocations: {
                  include: {
                    allocation: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            })
          );
        }

        if (farmerType === "all" || farmerType === "organic") {
          queries.push(
            ctx.db.organic_Farmer.findMany({
              where: organicFarmerWhereClause,
              select: {
                id: true,
                firstname: true,
                surname: true,
                email_address: true,
                municipalityOrCity: true,
                status: true,
                createdAt: true,
                Grains: true,
                LowlandVegetables: true,
                UplandVegetables: true,
                FruitsAndNots: true,
                Mushroom: true,
                OrganicSoil: true,
                Rootcrops: true,
                PultryProducts: true,
                LiveStockProducts: true,
                FisheriesAndAquaCulture: true,
                IndustrialCropsAndProducts: true,
                OtherCommodity: true,
                allocations: {
                  include: {
                    allocation: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            })
          );
        }

        const results = await Promise.all(queries);
        const farmersList = [];

        // Process regular farmers
        if (farmerType === "all" || farmerType === "farmer") {
          const farmers = results[0] as any[];
          for (const farmer of farmers) {
            const totalHectares = farmer.farmDetails?.reduce((sum: number, farm: any) => {
              return sum + (farm.TotalFarmAreaInHa || 0);
            }, 0) || 0;

            const primaryCrop = farmer.farmerDetails?.rice ? "Rice" : 
                              farmer.farmerDetails?.corn ? "Corn" : 
                              farmer.farmerDetails?.livestock ? "Livestock" :
                              farmer.farmerDetails?.poultry ? "Poultry" :
                              farmer.farmerDetails?.othersCrops || "Various";

            farmersList.push({
              id: farmer.id,
              name: `${farmer.firstname} ${farmer.surname}`,
              email: farmer.email_address || "N/A",
              municipality: farmer.municipalityOrCity,
              status: farmer.status,
              category: farmer.categoryType || "FARMER",
              registrationDate: format(farmer.createdAt, "MMM dd, yyyy"),
              hectares: totalHectares,
              primaryCrop: primaryCrop,
              allocations: farmer.allocations || [],
            });
          }
        }

        // Process organic farmers
        if (farmerType === "all" || farmerType === "organic") {
          const organicFarmers = farmerType === "all" ? results[1] : results[0];
          for (const farmer of organicFarmers as any) {
            const commodities = [
              farmer.Grains,
              farmer.LowlandVegetables,
              farmer.UplandVegetables,
              farmer.FruitsAndNots,
              farmer.Mushroom,
              farmer.OrganicSoil,
              farmer.Rootcrops,
              farmer.PultryProducts,
              farmer.LiveStockProducts,
              farmer.FisheriesAndAquaCulture,
              farmer.IndustrialCropsAndProducts,
              farmer.OtherCommodity,
            ].filter(Boolean);

            const totalHectares = commodities.reduce((sum: number, commodity: any) => {
              return sum + (commodity?.sizeInHa || 0);
            }, 0);

            const primaryCrop = commodities.length > 0 ? commodities[0]?.name : "Various";

            farmersList.push({
              id: farmer.id,
              name: `${farmer.firstname} ${farmer.surname}`,
              email: farmer.email_address || "N/A",
              municipality: farmer.municipalityOrCity,
              status: farmer.status,
              category: "ORGANIC_FARMER",
              registrationDate: format(farmer.createdAt || new Date(), "MMM dd, yyyy"),
              hectares: totalHectares,
              primaryCrop: primaryCrop,
              allocations: farmer.allocations || [],
            });
          }
        }

        return { farmersList };
      }

      if (reportType === "allocation-analysis") {
        const [regularFarmers, organicFarmers] = await Promise.all([
          ctx.db.farmer.findMany({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
            },
            include: {
              allocations: {
                include: {
                  allocation: true,
                },
              },
            },
          }),
          ctx.db.organic_Farmer.findMany({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
            },
            include: {
              allocations: {
                include: {
                  allocation: true,
                },
              },
            },
          }),
        ]);

        const regularFarmersWithAllocations = regularFarmers.filter(f => f.allocations.length > 0);
        const regularFarmersWithoutAllocations = regularFarmers.filter(f => f.allocations.length === 0);
        const organicFarmersWithAllocations = organicFarmers.filter(f => f.allocations.length > 0);
        const organicFarmersWithoutAllocations = organicFarmers.filter(f => f.allocations.length === 0);

        const allocationAnalysis = [
          {
            category: "Regular Farmers",
            totalFarmers: regularFarmers.length,
            farmersWithAllocations: regularFarmersWithAllocations.length,
            farmersWithoutAllocations: regularFarmersWithoutAllocations.length,
            allocationRate: regularFarmers.length > 0 ? (regularFarmersWithAllocations.length / regularFarmers.length) * 100 : 0,
          },
          {
            category: "Organic Farmers",
            totalFarmers: organicFarmers.length,
            farmersWithAllocations: organicFarmersWithAllocations.length,
            farmersWithoutAllocations: organicFarmersWithoutAllocations.length,
            allocationRate: organicFarmers.length > 0 ? (organicFarmersWithAllocations.length / organicFarmers.length) * 100 : 0,
          },
          {
            category: "All Farmers",
            totalFarmers: regularFarmers.length + organicFarmers.length,
            farmersWithAllocations: regularFarmersWithAllocations.length + organicFarmersWithAllocations.length,
            farmersWithoutAllocations: regularFarmersWithoutAllocations.length + organicFarmersWithoutAllocations.length,
            allocationRate: (regularFarmers.length + organicFarmers.length) > 0 ? 
              ((regularFarmersWithAllocations.length + organicFarmersWithAllocations.length) / (regularFarmers.length + organicFarmers.length)) * 100 : 0,
          },
        ];

        return {
          allocationAnalysis,
          totalFarmers: regularFarmers.length + organicFarmers.length,
          farmersWithAllocations: regularFarmersWithAllocations.length + organicFarmersWithAllocations.length,
          farmersWithoutAllocations: regularFarmersWithoutAllocations.length + organicFarmersWithoutAllocations.length,
        };
      }

      if (reportType === "allocation-types") {
        const allocationTypeStats = await ctx.db.allocation.groupBy({
          by: ['AllocationType'],
          where: dateFilter,
          _count: {
            _all: true,
          },
        });

        const processedAllocationTypeStats = allocationTypeStats.map(stat => ({
          allocationType: stat.AllocationType || 'Unknown',
          count: stat._count._all,
        }));

        return { allocationTypeStats: processedAllocationTypeStats };
      }

      if (reportType === "events") {
        const searchFilter = search
          ? {
              OR: [
                { What: { contains: search, mode: "insensitive" as const } },
                { Where: { contains: search, mode: "insensitive" as const } },
                { Note: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {};

        const events = await ctx.db.events.findMany({
          where: {
            ...dateFilter,
            ...searchFilter,
          },
          orderBy: { Eventdate: "desc" },
        });

        const eventsList = events.map((event) => ({
          id: event.id,
          title: event.What,
          location: event.Where,
          eventDate: format(event.Eventdate, "MMM dd, yyyy 'at' h:mm a"),
          forFarmers: event.forFarmersOnly,
          forOrganicFarmers: event.forOgranicsFarmersOnly,
          createdDate: format(event.createdAt, "MMM dd, yyyy"),
        }));

        return { eventsList };
      }

      if (reportType === "concerns") {
        const searchFilter = search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {};

        const [farmerConcerns, organicFarmerConcerns] = await Promise.all([
          ctx.db.farmerConcern.findMany({
            where: {
              ...dateFilter,
              ...searchFilter,
            },
            include: {
              farmer: {
                select: {
                  firstname: true,
                  surname: true,
                },
              },
              _count: {
                select: {
                  messages: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          }),
          ctx.db.organicFarmerConcern.findMany({
            where: {
              ...dateFilter,
              ...searchFilter,
            },
            include: {
              organicFarmer: {
                select: {
                  firstname: true,
                  surname: true,
                },
              },
              _count: {
                select: {
                  messages: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);

        const concernsList = [
          ...farmerConcerns.map((concern) => ({
            id: concern.id,
            title: concern.title,
            description: concern.description,
            farmerName: `${concern.farmer.firstname} ${concern.farmer.surname}`,
            status: concern.status,
            messageCount: concern._count.messages,
            createdDate: format(concern.createdAt, "MMM dd, yyyy"),
          })),
          ...organicFarmerConcerns.map((concern) => ({
            id: concern.id,
            title: concern.title,
            description: concern.description,
            farmerName: `${concern.organicFarmer.firstname} ${concern.organicFarmer.surname}`,
            status: concern.status,
            messageCount: concern._count.messages,
            createdDate: format(concern.createdAt, "MMM dd, yyyy"),
          })),
        ];

        return { concernsList };
      }

      if (reportType === "allocations") {
        const searchFilter = search
          ? {
              OR: [
                { AllocationType: { contains: search, mode: "insensitive" as const } },
                {
                  farmers: {
                    some: {
                      OR: [
                        {
                          farmer: {
                            OR: [
                              { firstname: { contains: search, mode: "insensitive" as const } },
                              { surname: { contains: search, mode: "insensitive" as const } },
                            ]
                          }
                        },
                        {
                          organicFarmer: {
                            OR: [
                              { firstname: { contains: search, mode: "insensitive" as const } },
                              { surname: { contains: search, mode: "insensitive" as const } },
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              ],
            }
          : {};

        const allocations = await ctx.db.allocation.findMany({
          where: {
            ...dateFilter,
            ...searchFilter,
          },
          include: {
            farmers: {
              include: {
                farmer: {
                  select: {
                    firstname: true,
                    surname: true,
                    municipalityOrCity: true,
                    status: true,
                  },
                },
                organicFarmer: {
                  select: {
                    firstname: true,
                    surname: true,
                    municipalityOrCity: true,
                    status: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        const allocationsList = allocations.map((allocation) => ({
          id: allocation.id,
          amount: allocation.amount,
          allocationType: allocation.AllocationType,
          approved: allocation.approved,
          createdAt: format(allocation.createdAt, "MMM dd, yyyy"),
          farmers: allocation.farmers.map((fa) => ({
            name: fa.farmer 
              ? `${fa.farmer.firstname} ${fa.farmer.surname}`
              : `${fa.organicFarmer?.firstname} ${fa.organicFarmer?.surname}`,
            municipality: fa.farmer?.municipalityOrCity || fa.organicFarmer?.municipalityOrCity,
            type: fa.farmer ? "FARMER" : "ORGANIC_FARMER",
            status: fa.farmer?.status || fa.organicFarmer?.status,
          })),
        }));

        return { allocationsList };
      }

      return {};
    }),
});