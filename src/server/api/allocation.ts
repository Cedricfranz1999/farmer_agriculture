import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const allocationRouter = createTRPCRouter({
  // Find a farmer by ID
  findFarmerById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const farmer = await ctx.db.farmer.findUnique({
        where: { id: parseInt(input.id), status: "REGISTERED" },
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
        where: { id: parseInt(input.id), status: "REGISTERED" },
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
          type: z.string(),
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
          AllocationType: input.type,
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

  // Get farmer allocation history
  getFarmerAllocationHistory: publicProcedure
    .input(z.object({ farmerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allocations = await ctx.db.allocation.findMany({
        where: {
          farmers: {
            some: {
              farmerId: parseInt(input.farmerId)
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return allocations;
    }),

  // Get organic farmer allocation history
  getOrganicFarmerAllocationHistory: publicProcedure
    .input(z.object({ organicFarmerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allocations = await ctx.db.allocation.findMany({
        where: {
          farmers: {
            some: {
              organicFarmerId: parseInt(input.organicFarmerId)
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return allocations;
    }),

  // Get all allocations
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
                createdAt: true,
              },
            },
            organicFarmer: {
              select: {
                firstname: true,
                surname: true,
                farmerImage: true,
                createdAt: true
              },
            },
          },
        },
      },
    });
    return allocations;
  }),

  // Get farmers with allocations
  getFarmersWithAllocations: publicProcedure.query(async ({ ctx }) => {
    const farmersWithAllocations = await ctx.db.farmer.findMany({
      where: {
        status: "REGISTERED",
        allocations: {
          some: {}
        }
      },
      include: {
        allocations: {
          include: {
            allocation: true
          }
        }
      }
    });

    return farmersWithAllocations;
  }),

  // Get farmers without allocations
  getFarmersWithoutAllocations: publicProcedure.query(async ({ ctx }) => {
    const farmersWithoutAllocations = await ctx.db.farmer.findMany({
      where: {
        status: "REGISTERED",
        allocations: {
          none: {}
        }
      }
    });

    return farmersWithoutAllocations;
  }),

  // Get organic farmers with allocations
  getOrganicFarmersWithAllocations: publicProcedure.query(async ({ ctx }) => {
    const organicFarmersWithAllocations = await ctx.db.organic_Farmer.findMany({
      where: {
        status: "REGISTERED",
        allocations: {
          some: {}
        }
      },
      include: {
        allocations: {
          include: {
            allocation: true
          }
        }
      }
    });

    return organicFarmersWithAllocations;
  }),

  // Get organic farmers without allocations
  getOrganicFarmersWithoutAllocations: publicProcedure.query(async ({ ctx }) => {
    const organicFarmersWithoutAllocations = await ctx.db.organic_Farmer.findMany({
      where: {
        status: "REGISTERED",
        allocations: {
          none: {}
        }
      }
    });

    return organicFarmersWithoutAllocations;
  }),

  // Get all farmers (both with and without allocations) separated
  getAllFarmersSeparated: publicProcedure.query(async ({ ctx }) => {
    const [farmersWithAllocations, farmersWithoutAllocations] = await Promise.all([
      ctx.db.farmer.findMany({
        where: {
          status: "REGISTERED",
          allocations: {
            some: {}
          }
        },
        include: {
          allocations: {
            include: {
              allocation: true
            }
          }
        }
      }),
      ctx.db.farmer.findMany({
        where: {
          status: "REGISTERED",
          allocations: {
            none: {}
          }
        }
      })
    ]);

    const [organicFarmersWithAllocations, organicFarmersWithoutAllocations] = await Promise.all([
      ctx.db.organic_Farmer.findMany({
        where: {
          status: "REGISTERED",
          allocations: {
            some: {}
          }
        },
        include: {
          allocations: {
            include: {
              allocation: true
            }
          }
        }
      }),
      ctx.db.organic_Farmer.findMany({
        where: {
          status: "REGISTERED",
          allocations: {
            none: {}
          }
        }
      })
    ]);

    return {
      farmersWithAllocations,
      farmersWithoutAllocations,
      organicFarmersWithAllocations,
      organicFarmersWithoutAllocations
    };
  }),

  // Get all organic farmers (both with and without allocations) separated
  getOrganicFarmersSeparated: publicProcedure.query(async ({ ctx }) => {
    const [organicFarmersWithAllocations, organicFarmersWithoutAllocations] = await Promise.all([
      ctx.db.organic_Farmer.findMany({
        where: {
          status: "REGISTERED",
          allocations: {
            some: {}
          }
        },
        include: {
          allocations: {
            include: {
              allocation: true
            }
          }
        }
      }),
      ctx.db.organic_Farmer.findMany({
        where: {
          status: "REGISTERED",
          allocations: {
            none: {}
          }
        }
      })
    ]);

    return {
      organicFarmersWithAllocations,
      organicFarmersWithoutAllocations
    };
  })
});