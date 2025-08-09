import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const farmerDashboardRouter = createTRPCRouter({
  getStats: publicProcedure.query(async ({ ctx }) => {
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get counts for all metrics
    const [
      // Farmer Applicants
      farmerApplicants,
      newFarmerApplicantsToday,

      // Organic Farmer Applicants
      organicFarmerApplicants,
      newOrganicFarmerApplicantsToday,

      // Registered Farmers
      registeredFarmers,
      newRegisteredFarmersToday,

      // Registered Organic Farmers
      registeredOrganicFarmers,
      newRegisteredOrganicFarmersToday,

      // Not Qualified Farmers
      notQualifiedFarmers,
      newNotQualifiedFarmersToday,

      // Not Qualified Organic Farmers
      notQualifiedOrganicFarmers,
      newNotQualifiedOrganicFarmersToday,

      // Events
      totalEvents,
      newEventsToday,

      // Farmer Concerns
      farmerConcerns,
      newFarmerConcernsToday,

      // Organic Farmer Concerns
      organicFarmerConcerns,
      newOrganicFarmerConcernsToday,
    ] = await Promise.all([
      // Farmer Applicants
      ctx.db.farmer.count({
        where: { status: "APPLICANTS" },
      }),
      ctx.db.farmer.count({
        where: {
          status: "APPLICANTS",
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Organic Farmer Applicants
      ctx.db.organic_Farmer.count({
        where: { status: "APPLICANTS" },
      }),
      ctx.db.organic_Farmer.count({
        where: {
          status: "APPLICANTS",
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Registered Farmers
      ctx.db.farmer.count({
        where: { status: "REGISTERED" },
      }),
      ctx.db.farmer.count({
        where: {
          status: "REGISTERED",
          updatedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Registered Organic Farmers
      ctx.db.organic_Farmer.count({
        where: { status: "REGISTERED" },
      }),
      ctx.db.organic_Farmer.count({
        where: {
          status: "REGISTERED",
          updatedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Not Qualified Farmers
      ctx.db.farmer.count({
        where: { status: "NOT_QUALIFIED" },
      }),
      ctx.db.farmer.count({
        where: {
          status: "NOT_QUALIFIED",
          updatedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Not Qualified Organic Farmers
      ctx.db.organic_Farmer.count({
        where: { status: "NOT_QUALIFIED" },
      }),
      ctx.db.organic_Farmer.count({
        where: {
          status: "NOT_QUALIFIED",
          updatedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Events
      ctx.db.events.count(),
      ctx.db.events.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Farmer Concerns
      ctx.db.farmerConcern.count(),
      ctx.db.farmerConcern.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Organic Farmer Concerns
      ctx.db.organicFarmerConcern.count(),
      ctx.db.organicFarmerConcern.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ]);

    // Calculate total concerns
    const totalConcerns = farmerConcerns + organicFarmerConcerns;
    const newConcernsToday =
      newFarmerConcernsToday + newOrganicFarmerConcernsToday;

    return {
      // Farmer Applicants
      farmerApplicants,
      newFarmerApplicantsToday,

      // Organic Farmer Applicants
      organicFarmerApplicants,
      newOrganicFarmerApplicantsToday,

      // Registered Farmers
      registeredFarmers,
      newRegisteredFarmersToday,

      // Registered Organic Farmers
      registeredOrganicFarmers,
      newRegisteredOrganicFarmersToday,

      // Not Qualified Farmers
      notQualifiedFarmers,
      newNotQualifiedFarmersToday,

      // Not Qualified Organic Farmers
      notQualifiedOrganicFarmers,
      newNotQualifiedOrganicFarmersToday,

      // Events
      totalEvents,
      newEventsToday,

      // Concerns
      totalConcerns,
      newConcernsToday,
      farmerConcerns,
      organicFarmerConcerns,
    };
  }),
});
