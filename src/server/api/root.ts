import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { signupRouter } from "./routers/sign-up";
import { organicFarmerRouter } from "./routers/organic-sign-up";
import { farmerDashboardRouter } from "./routers/dashboard";
import { farmersRouter } from "./routers/farmers";
import { OrganicfarmersRouterData } from "./routers/organic-farmer";
import { eventsRouter } from "./routers/events";
import { messagesRouter } from "./routers/messages";
import { reportsRouter } from "./routers/reports";
import { allocationRouter } from "./allocation";
import { scannerRouter } from "./routers/scanner";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: signupRouter,
  organicFarmer: organicFarmerRouter,
  dashboardData: farmerDashboardRouter,
  farmers: farmersRouter,
  organicFarmersData: OrganicfarmersRouterData,
  events: eventsRouter,
  messages: messagesRouter,
  reports: reportsRouter,
  allocation: allocationRouter,
  scanner:scannerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
