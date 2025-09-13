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
        reportType: z.enum(["farmers", "events", "concerns", "overview"]),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, reportType, search } = input;

      // Default date range if not provided
      const defaultStartDate =
        startDate || new Date(new Date().getFullYear(), 0, 1);
      const defaultEndDate = endDate || new Date();

      // Base where clause for date filtering
      const dateFilter = {
        createdAt: {
          gte: defaultStartDate,
          lte: defaultEndDate,
        },
      };

      if (reportType === "overview") {
        // Get overview statistics
        const [
          totalFarmers,
          totalOrganicFarmers,
          totalEvents,
          totalConcerns,
          newFarmersThisMonth,
          newOrganicFarmersThisMonth,
          newEventsThisMonth,
          newConcernsThisMonth,
        ] = await Promise.all([
          // Total counts
          ctx.db.farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
            },
          }),
          ctx.db.organic_Farmer.count({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
            },
          }),
          ctx.db.events.count({ where: dateFilter }),
          (await ctx.db.farmerConcern.count({ where: dateFilter })) +
            (await ctx.db.organicFarmerConcern.count({ where: dateFilter })),

          // This month counts
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
        ]);

        // Get registration trends (last 12 months)
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

        // Get status distribution
        const [
          applicantFarmers,
          registeredFarmers,
          notQualifiedFarmers,
          applicantOrganicFarmers,
          registeredOrganicFarmers,
          notQualifiedOrganicFarmers,
        ] = await Promise.all([
          ctx.db.farmer.count({
            where: { status: "APPLICANTS", ...dateFilter },
          }),
          ctx.db.farmer.count({
            where: { status: "REGISTERED", ...dateFilter },
          }),
          ctx.db.farmer.count({
            where: { status: "NOT_QUALIFIED", ...dateFilter },
          }),
          ctx.db.organic_Farmer.count({
            where: { status: "APPLICANTS", ...dateFilter },
          }),
          ctx.db.organic_Farmer.count({
            where: { status: "REGISTERED", ...dateFilter },
          }),
          ctx.db.organic_Farmer.count({
            where: { status: "NOT_QUALIFIED", ...dateFilter },
          }),
        ]);

        const statusDistribution = [
          {
            name: "Applicants",
            value: applicantFarmers + applicantOrganicFarmers,
          },
          {
            name: "Registered",
            value: registeredFarmers + registeredOrganicFarmers,
          },
          {
            name: "Not Qualified",
            value: notQualifiedFarmers + notQualifiedOrganicFarmers,
          },
        ];

        // Get events by month
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
          newFarmersThisMonth,
          newOrganicFarmersThisMonth,
          newEventsThisMonth,
          newConcernsThisMonth,
          registrationTrends,
          statusDistribution,
          eventsByMonth,
        };
      }

      if (reportType === "farmers") {
        // Get farmers list with search
        const searchFilter = search
          ? {
              OR: [
                {
                  firstname: { contains: search, mode: "insensitive" as const },
                },
                { surname: { contains: search, mode: "insensitive" as const } },
                {
                  email_address: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  municipalityOrCity: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {};

        const [farmers, organicFarmers] = await Promise.all([
          ctx.db.farmer.findMany({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
              ...searchFilter,
            },
            select: {
              id: true,
              firstname: true,
              surname: true,
              email_address: true,
              municipalityOrCity: true,
              status: true,
              categoryType: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
          ctx.db.organic_Farmer.findMany({
            where: {
              status: input.status !== "ALL" ? input.status : undefined,
              ...dateFilter,
              ...searchFilter,
            },
            select: {
              id: true,
              firstname: true,
              surname: true,
              email_address: true,
              municipalityOrCity: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);

        const farmersList = [
          ...farmers.map((farmer) => ({
            id: farmer.id,
            name: `${farmer.firstname} ${farmer.surname}`,
            email: farmer.email_address || "N/A",
            municipality: farmer.municipalityOrCity,
            status: farmer.status,
            category: farmer.categoryType || "FARMER",
            registrationDate: format(farmer.createdAt, "MMM dd, yyyy"),
          })),
          ...organicFarmers.map((farmer) => ({
            id: farmer.id,
            name: `${farmer.firstname} ${farmer.surname}`,
            email: farmer.email_address || "N/A",
            municipality: farmer.municipalityOrCity,
            status: farmer.status,
            category: "ORGANIC_FARMER",
            registrationDate: format(
              farmer.createdAt || new Date(),
              "MMM dd, yyyy",
            ),
          })),
        ];

        return { farmersList };
      }

      if (reportType === "events") {
        // Get events list with search
        const searchFilter = search
          ? {
              OR: [
                { What: { contains: search, mode: "insensitive" as const } },
                { Where: { contains: search, mode: "insensitive" as const } },
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
        // Get concerns list with search
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

      return {};
    }),
});
