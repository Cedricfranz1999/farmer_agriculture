import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const scannerRouter = createTRPCRouter({
  // Find a farmer by ID
  findFarmerById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const farmer = await ctx.db.farmer.findUnique({
        where: { id: parseInt(input.id), status: "REGISTERED" },
        select: {
          id: true,
          firstname: true,
          surname: true,
          houseOrLotOrBuildingNo: true,
          streetOrSitioOrSubDivision: true,
          barangay: true,
          municipalityOrCity: true,
          province: true,
          dateOfBirth: true,
          farmerImage: true,
          categoryType: true,
        },
      });
      
      if (!farmer) {
        return null;
      }

      // Calculate age from dateOfBirth
      const age = Math.floor(
        (new Date().getTime() - new Date(farmer.dateOfBirth).getTime()) / 
        (365.25 * 24 * 60 * 60 * 1000)
      );

      return {
        ...farmer,
        age,
        type: "farmer" as const,
      };
    }),

  // Find an organic farmer by ID
  findOrganicFarmerById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const organicFarmer = await ctx.db.organic_Farmer.findUnique({
        where: { id: parseInt(input.id), status: "REGISTERED" },
        select: {
          id: true,
          firstname: true,
          surname: true,
          houseOrLotOrBuildingNo: true,
          streetOrSitioOrSubDivision: true,
          barangay: true,
          municipalityOrCity: true,
          province: true,
          dateOfBirth: true,
          farmerImage: true,
        },
      });

      if (!organicFarmer) {
        return null;
      }

      // Calculate age from dateOfBirth
      const age = Math.floor(
        (new Date().getTime() - new Date(organicFarmer.dateOfBirth).getTime()) / 
        (365.25 * 24 * 60 * 60 * 1000)
      );

      return {
        ...organicFarmer,
        age,
        type: "organic_farmer" as const,
      };
    }),
});