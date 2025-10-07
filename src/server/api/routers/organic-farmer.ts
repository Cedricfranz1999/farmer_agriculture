import {
  FarmerRegistrationsStatus,
  organicFarmerRegistrationsStatus,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const OrganicfarmersRouterData = createTRPCRouter({
  // Get farmers with APPLICANTS status with pagination
  getApplicants: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z.nativeEnum(organicFarmerRegistrationsStatus).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const whereClause: Prisma.Organic_FarmerWhereInput = {
        status: input.status,
        ...(input.search && {
          OR: [
            {
              firstname: {
                contains: input.search,
                mode: "insensitive" as const,
              },
            },
            {
              middleName: {
                contains: input.search,
                mode: "insensitive" as const,
              },
            },
            {
              surname: { contains: input.search, mode: "insensitive" as const },
            },
            {
              extensionName: {
                contains: input.search,
                mode: "insensitive" as const,
              },
            },
          ],
        }),
      };

      const [farmers, total] = await Promise.all([
        ctx.db.organic_Farmer.findMany({
          where: whereClause,
          select: {
            id: true,
            firstname: true,
            middleName: true,
            surname: true,
            extensionName: true,
            sex: true,
            barangay: true,
            municipalityOrCity: true,
            dateOfBirth: true,
            farmerImage: true,
            status: true,
            not_qualifiedreason:true,
            createdAt: true,
            
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: input.limit,
        }),
        ctx.db.organic_Farmer.count({
          where: whereClause,
        }),
      ]);

      return {
        farmers,
        total,
        pages: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),

  // Update farmer status
updateStatus: publicProcedure
  .input(
    z.object({
      id: z.number(),
      status: z.nativeEnum(FarmerRegistrationsStatus),
      rejectionReason: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const updatedFarmer = await ctx.db.organic_Farmer.update({
      where: {
        id: input.id,
      },
      data: {
        status: input.status,
        not_qualifiedreason: input.rejectionReason,
        updatedAt: new Date(),
      },
    });
    return updatedFarmer;
  }),

     getOrganicFarmerById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const farmer = await ctx.db.organic_Farmer.findUnique({
        where: { id: input.id },
        include: {
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
          ownSharedFacilities: true,
        }
      })
      
      if (!farmer) {
        throw new Error('Organic farmer not found')
      }
      
      return farmer
    }),
});
