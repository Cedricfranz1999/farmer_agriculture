import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const allocationRouter = createTRPCRouter({
  // Find a farmer by ID
  findFarmerById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const farmer = await ctx.db.farmer.findUnique({
        where: { id: parseInt(input.id) },
      });
      if (!farmer) {
        return null;
      }
      return farmer;
    }),

  // Find an organic farmer by ID
  findOrganicFarmerById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const organicFarmer = await ctx.db.organic_Farmer.findUnique({
        where: { id: parseInt(input.id) },
      });
      if (!organicFarmer) {
        return null;
      }
      return organicFarmer;
    }),

  // Create a new allocation
  createAllocation: publicProcedure
    .input(
      z
        .object({
          farmerId: z.number().optional(),
          organicFarmerId: z.number().optional(),
          amount: z.number(),
        })
        .refine(
          (data) => {
            // Ensure only one of farmerId or organicFarmerId is set
            return !(
              (data.farmerId !== undefined &&
                data.organicFarmerId !== undefined) ||
              (data.farmerId === undefined &&
                data.organicFarmerId === undefined)
            );
          },
          {
            message:
              "Either farmerId or organicFarmerId must be set, but not both.",
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      const allocation = await ctx.db.allocation.create({
        data: {
          amount: input.amount,
          approved: false,
          farmers: {
            create: {
              farmerId: input.farmerId,
              organicFarmerId: input.organicFarmerId,
            },
          },
        },
        include: {
          farmers: true,
        },
      });
      return allocation;
    }),

  // Approve an allocation
  approveAllocation: publicProcedure
    .input(z.object({ allocationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const allocation = await ctx.db.allocation.update({
        where: { id: parseInt(input.allocationId) },
        data: { approved: true },
      });
      return allocation;
    }),

  // Get allocation details
  getAllocationDetails: publicProcedure
    .input(z.object({ allocationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allocation = await ctx.db.allocation.findUnique({
        where: { id: parseInt(input.allocationId) },
        include: {
          farmers: {
            include: {
              farmer: {
                select: {
                  firstname: true,
                  surname: true,
                },
              },
              organicFarmer: {
                select: {
                  firstname: true,
                  surname: true,
                },
              },
            },
          },
        },
      });
      if (!allocation) {
        return null;
      }
      return allocation;
    }),
  getAllAllocations: publicProcedure.query(async ({ ctx }) => {
    const allocations = await ctx.db.allocation.findMany({
      include: {
        farmers: {
          include: {
            farmer: {
              select: {
                firstname: true,
                surname: true,
                farmerImage: true,
              },
            },
            organicFarmer: {
              select: {
                firstname: true,
                surname: true,
                farmerImage: true,
              },
            },
          },
        },
      },
    });
    return allocations;
  }),
});
