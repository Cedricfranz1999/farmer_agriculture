import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  // Get events by month and year
  getEventsByMonth: publicProcedure
    .input(
      z.object({
        month: z.number().min(1).max(12),
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Create start and end dates for the month
      const startDate = new Date(input.year, input.month - 1, 1);
      const endDate = new Date(input.year, input.month, 0, 23, 59, 59);

      const events = await ctx.db.events.findMany({
        where: {
          Eventdate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          Eventdate: "asc",
        },
      });

      return events;
    }),

  // Get events by specific date
  getEventsByDate: publicProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Create start and end of the day
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      const events = await ctx.db.events.findMany({
        where: {
          Eventdate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          Eventdate: "asc",
        },
      });

      return events;
    }),

  // Get all events with pagination
  getAllEvents: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        farmersOnly: z.boolean().optional(),
        organicFarmersOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      // Build where clause
      const where: any = {};

      if (input.farmersOnly !== undefined) {
        where.forFarmersOnly = input.farmersOnly;
      }

      if (input.organicFarmersOnly !== undefined) {
        where.forOgranicsFarmersOnly = input.organicFarmersOnly;
      }

      const [events, total] = await Promise.all([
        ctx.db.events.findMany({
          where,
          orderBy: {
            Eventdate: "desc",
          },
          skip,
          take: input.limit,
        }),
        ctx.db.events.count({
          where,
        }),
      ]);

      return {
        events,
        total,
        pages: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),

  // Get upcoming events
  getUpcomingEvents: publicProcedure
    .input(
      z.object({
        limit: z.number().default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const events = await ctx.db.events.findMany({
        where: {
          Eventdate: {
            gte: now,
          },
        },
        orderBy: {
          Eventdate: "asc",
        },
        take: input.limit,
      });

      return events;
    }),

  // Create new event
  createEvent: publicProcedure
    .input(
      z.object({
        Eventdate: z.date(),
        What: z.string().min(1),
        Where: z.string().min(1),
        Image: z.string().optional(),
        Note: z.string(),
        forFarmersOnly: z.boolean().default(true),
        forOgranicsFarmersOnly: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.events.create({
        data: input,
      });

      return event;
    }),

  // Update event
  updateEvent: publicProcedure
    .input(
      z.object({
        id: z.number(),
        Eventdate: z.date().optional(),
        What: z.string().min(1).optional(),
        Where: z.string().min(1).optional(),
        Image: z.string().optional(),
        Note: z.string().optional(),
        forFarmersOnly: z.boolean().optional(),
        forOgranicsFarmersOnly: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const event = await ctx.db.events.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      return event;
    }),

  // Delete event
  deleteEvent: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.events.delete({
        where: { id: input.id },
      });

      return event;
    }),
});
