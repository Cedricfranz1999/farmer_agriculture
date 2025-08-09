import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const messagesRouter = createTRPCRouter({
  // Get concerns based on user type
  getConcerns: publicProcedure
    .input(
      z.object({
        userType: z.enum(["ADMIN", "FARMER", "ORGANIC_FARMER"]),
        userId: z.number(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};

      // Filter based on user type
      if (input.userType === "FARMER") {
        whereClause.farmerId = input.userId;
      } else if (input.userType === "ORGANIC_FARMER") {
        whereClause.farmerId = input.userId; // Note: OrganicFarmerConcern uses farmerId field
      }
      // Admin can see all concerns, so no additional filter

      // Add search filter
      if (input.search) {
        whereClause.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
        ];
      }

      // Fetch from both FarmerConcern and OrganicFarmerConcern
      const [farmerConcerns, organicFarmerConcerns] = await Promise.all([
        ctx.db.farmerConcern.findMany({
          where:
            input.userType === "FARMER"
              ? whereClause
              : input.userType === "ADMIN"
                ? {}
                : { id: -1 },
          include: {
            farmer: {
              select: {
                id: true,
                firstname: true,
                surname: true,
                farmerImage: true,
              },
            },
            _count: {
              select: {
                messages: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        }),
        ctx.db.organicFarmerConcern.findMany({
          where:
            input.userType === "ORGANIC_FARMER"
              ? whereClause
              : input.userType === "ADMIN"
                ? {}
                : { id: -1 },
          include: {
            organicFarmer: {
              select: {
                id: true,
                firstname: true,
                surname: true,
                farmerImage: true,
              },
            },
            _count: {
              select: {
                messages: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

      // Combine and format results
      const allConcerns = [
        ...farmerConcerns.map((concern) => ({
          ...concern,
          type: "FARMER" as const,
          organicFarmer: null,
        })),
        ...organicFarmerConcerns.map((concern) => ({
          ...concern,
          type: "ORGANIC_FARMER" as const,
          farmer: null,
        })),
      ];

      // Sort by updatedAt
      allConcerns.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      return allConcerns;
    }),

  // Get messages for a specific concern
  getMessages: publicProcedure
    .input(z.object({ concernId: z.number() }))
    .query(async ({ ctx, input }) => {
      // First, check if it's a farmer concern or organic farmer concern
      const farmerConcern = await ctx.db.farmerConcern.findUnique({
        where: { id: input.concernId },
      });

      const organicFarmerConcern = await ctx.db.organicFarmerConcern.findUnique(
        {
          where: { id: input.concernId },
        },
      );

      if (!farmerConcern && !organicFarmerConcern) {
        throw new Error("Concern not found");
      }

      // Get messages based on concern type
      const messages = await ctx.db.concernMessage.findMany({
        where: farmerConcern
          ? { farmerConcernId: input.concernId }
          : { organicFarmerConcernId: input.concernId },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
            },
          },
          farmer: {
            select: {
              id: true,
              firstname: true,
              surname: true,
              farmerImage: true,
            },
          },
          organicFarmer: {
            select: {
              id: true,
              firstname: true,
              surname: true,
              farmerImage: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return messages;
    }),

  // Send a message
  sendMessage: publicProcedure
    .input(
      z.object({
        concernId: z.number(),
        content: z.string().min(1),
        userType: z.enum(["ADMIN", "FARMER", "ORGANIC_FARMER"]),
        userId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if concern exists and determine type
      const farmerConcern = await ctx.db.farmerConcern.findUnique({
        where: { id: input.concernId },
      });

      const organicFarmerConcern = await ctx.db.organicFarmerConcern.findUnique(
        {
          where: { id: input.concernId },
        },
      );

      if (!farmerConcern && !organicFarmerConcern) {
        throw new Error("Concern not found");
      }

      // Prepare message data
      const messageData: any = {
        content: input.content,
        senderType: input.userType,
      };

      // Set the appropriate foreign keys based on user type
      if (input.userType === "ADMIN") {
        messageData.adminId = input.userId;
      } else if (input.userType === "FARMER") {
        messageData.farmerId = input.userId;
      } else if (input.userType === "ORGANIC_FARMER") {
        messageData.organicFarmerId = input.userId;
      }

      // Set concern relationship
      if (farmerConcern) {
        messageData.farmerConcernId = input.concernId;
      } else {
        messageData.organicFarmerConcernId = input.concernId;
      }

      // Create the message
      const message = await ctx.db.concernMessage.create({
        data: messageData,
      });

      // Update concern's updatedAt timestamp
      if (farmerConcern) {
        await ctx.db.farmerConcern.update({
          where: { id: input.concernId },
          data: { updatedAt: new Date() },
        });
      } else {
        await ctx.db.organicFarmerConcern.update({
          where: { id: input.concernId },
          data: { updatedAt: new Date() },
        });
      }

      return message;
    }),

  // Create a new concern (for farmers/organic farmers)
  createConcern: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: z.string().optional(),
        userType: z.enum(["FARMER", "ORGANIC_FARMER", "ADMIN"]),
        userId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userType === "FARMER") {
        const concern = await ctx.db.farmerConcern.create({
          data: {
            title: input.title,
            description: input.description,
            image: input.image,
            farmerId: input.userId,
          },
        });
        return concern;
      } else {
        const concern = await ctx.db.organicFarmerConcern.create({
          data: {
            title: input.title,
            description: input.description,
            image: input.image,
            farmerId: input.userId, // Note: uses farmerId field
          },
        });
        return concern;
      }
    }),

  // Update concern status (admin only)
  updateConcernStatus: publicProcedure
    .input(
      z.object({
        concernId: z.number(),
        status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if it's a farmer concern or organic farmer concern
      const farmerConcern = await ctx.db.farmerConcern.findUnique({
        where: { id: input.concernId },
      });

      if (farmerConcern) {
        return await ctx.db.farmerConcern.update({
          where: { id: input.concernId },
          data: { status: input.status },
        });
      } else {
        return await ctx.db.organicFarmerConcern.update({
          where: { id: input.concernId },
          data: { status: input.status },
        });
      }
    }),
});
