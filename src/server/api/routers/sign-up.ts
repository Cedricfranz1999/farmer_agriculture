/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// ~/server/api/routers/farmer.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt, { compare } from "bcryptjs";
import { Input } from "~/components/ui/input";

export const signupRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        // Basic info
        username: z.string().min(1, "Username is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        email_address: z.string().optional(),
        surname: z.string().min(1, "Surname is required"),
        firstname: z.string().min(1, "First name is required"),
        middleName: z.string().optional(),
        extensionName: z.string().optional(),
        sex: z.enum(["MALE", "FEMALE"]),

        // Address
        houseOrLotOrBuildingNo: z
          .string()
          .min(1, "House/Lot/Building No is required"),
        streetOrSitioOrSubDivision: z
          .string()
          .min(1, "Street/Sitio/Subdivision is required"),
        barangay: z.string().min(1, "Barangay is required"),
        municipalityOrCity: z.string().min(1, "Municipality/City is required"),
        province: z.string().min(1, "Province is required"),
        region: z.string().min(1, "Region is required"),

        // Contact & personal info
        contactNumber: z.string().min(1, "Contact number is required"),
        placeOfBirth: z.string().min(1, "Place of birth is required"),
        dateOfBirth: z.date(),
        highestFormOfEducation: z.enum([
          "NONE",
          "ELEMENTARY",
          "HIGHSCHOOL",
          "SENIOR_HIGHSCHOOL",
          "COLLEGE",
          "POST_GRADUATE",
          "VOCATIONAL",
        ]),
        religion: z.string().optional(),
        civilStaus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "SEPARATED"]),
        nameOfSpouse: z.string().optional(),
        FourPS_Benificiaty: z.string().optional(),
        mothersName: z.string().optional(),
        fathersName: z.string().optional(),
        govermentId: z.string().min(1, "Government ID is required"),
        personToContactIncaseOfEmerceny: z.string().optional(),
        personContactNumberIncaseOfEmergency: z.string().optional(),

        // Income
        grossAnualIncomeLastYearFarming: z.number().min(0),
        grossAnualIncomeLastYeaNonFarming: z.number().min(0),

        // Images
        farmerImage: z.string().min(1, "Farmer image is required"),
        farmerSignatureAsImage: z.string().optional(),
        farmerFingerPrintAsImage: z.string().optional(),

        // Category
        categoryType: z.enum([
          "FARMER",
          "FARMWORKER",
          "FISHERFOLK",
          "AGRI_YOUTH",
        ]),

        // Farmer details (if category is FARMER)
        farmerDetails: z
          .object({
            rice: z.boolean().optional(),
            corn: z.boolean().optional(),
            othersCrops: z.string().optional(),
            livestock: z.boolean().optional(),
            livestockDetails: z.string().optional(),
            poultry: z.boolean().optional(),
            poultryDetails: z.string().optional(),
          })
          .optional(),

        // Farm worker details (if category is FARMWORKER)
        farmworkerDetails: z
          .object({
            landPreparation: z.boolean().optional(),
            plantingTransplanting: z.boolean().optional(),
            cultivation: z.boolean().optional(),
            harvesting: z.boolean().optional(),
            others: z.string().optional(),
          })
          .optional(),

        // Fisherfolk details (if category is FISHERFOLK)
        fisherfolkDetails: z
          .object({
            fishCapture: z.boolean().optional(),
            aquaculture: z.boolean().optional(),
            gleaning: z.boolean().optional(),
            fishProcessing: z.boolean().optional(),
            fishVending: z.boolean().optional(),
            others: z.string().optional(),
          })
          .optional(),

        // Agri Youth details (if category is AGRI_YOUTH)
        agriYouthDetails: z
          .object({
            partOfFarmingHouseHold: z.boolean().optional(),
            attendedFormalAgriFishery: z.boolean().optional(),
            attendedNonFormalAgriFishery: z.boolean().optional(),
            participatedInAnyAgriculturalActivity: z.boolean().optional(),
            fishVending: z.boolean().optional(),
            others: z.string().optional(),
          })
          .optional(),

        // House head details
        houseHead: z
          .object({
            houseHoldHead: z.string().optional(),
            relationship: z.string().optional(),
            numberOfLivingHouseHoldMembersTotal: z.number().optional(),
            numberOfMale: z.number().optional(),
            NumberOfFemale: z.number().optional(),
          })
          .optional(),

        // Farm details - Updated to match exact schema
        farmDetails: z
          .array(
            z.object({
              Location: z.string().min(1, "Location is required"),
              TotalFarmAreaInHa: z.number().min(0),
              withAncestordomain: z.boolean().optional(),
              agrarianReform: z.boolean().optional(),
              OwnerDocumentsNumber: z
                .string()
                .min(1, "Owner documents number is required"),

              // Owner type fields - only one should be true
              RegisterOwner: z.boolean().optional(),
              ownerName: z.string().optional(),
              tenantOwner: z.boolean().optional(),
              teenantName: z.string().optional(),
              Leese: z.boolean().optional(),
              leeseName: z.string().optional(),
              others: z.string().optional(),
              othersField: z.string().optional(),

              // Lot details (for farmers only) - Note: Int fields in schema
              lotDetails: z
                .object({
                  cropsORCommodity: z.string().optional().nullable(),

                  sizeInHa: z.number().int().min(0, "Size must be at least 0"),
                  numberOfHeadForLivestockAndPoultry: z
                    .number()
                    .int()
                    .min(0, "Number must be at least 0"),
                  FarmType: z.string().optional().nullable(),
                  organicPractitioner: z.boolean(),
                })
                .optional(),
            }),
          )
          .optional(),

        numberOfFarms: z.number().min(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        password,
        categoryType,
        farmerDetails,
        farmworkerDetails,
        fisherfolkDetails,
        agriYouthDetails,
        houseHead,
        farmDetails,
        numberOfFarms,
        ...farmerData
      } = input;

      // Check if username already exists
      const existingFarmer = await ctx.db.farmer.findFirst({
        where: { username: farmerData.username },
      });

      if (existingFarmer) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const calculatedNumberOfFarms =
        numberOfFarms ?? (farmDetails?.length || 0);

      // Create farmer with related data using transaction
      const farmer = await ctx.db.$transaction(async (tx) => {
        // Create the main farmer record
        const createdFarmer = await tx.farmer.create({
          data: {
            ...farmerData,
            password: hashedPassword,
            categoryType,
            numberOfFarms: calculatedNumberOfFarms,

            // Handle farmer details (if category is FARMER)
            ...(categoryType === "FARMER" &&
              farmerDetails && {
                farmerDetails: {
                  create: {
                    rice: farmerDetails.rice ?? false,
                    corn: farmerDetails.corn ?? false,
                    othersCrops: farmerDetails.othersCrops,
                    livestock: farmerDetails.livestock ?? false,
                    livestockDetails: farmerDetails.livestockDetails,
                    poultry: farmerDetails.poultry ?? false,
                    poultryDetails: farmerDetails.poultryDetails,
                  },
                },
              }),

            // Handle farmworker details (if category is FARMWORKER)
            ...(categoryType === "FARMWORKER" &&
              farmworkerDetails && {
                farmworkerDetails: {
                  create: {
                    landPreparation: farmworkerDetails.landPreparation ?? false,
                    plantingTransplanting:
                      farmworkerDetails.plantingTransplanting ?? false,
                    cultivation: farmworkerDetails.cultivation ?? false,
                    harvesting: farmworkerDetails.harvesting ?? false,
                    others: farmworkerDetails.others,
                  },
                },
              }),

            // Handle fisherfolk details (if category is FISHERFOLK)
            ...(categoryType === "FISHERFOLK" &&
              fisherfolkDetails && {
                fisherfolkDetails: {
                  create: {
                    fishCapture: fisherfolkDetails.fishCapture ?? false,
                    aquaculture: fisherfolkDetails.aquaculture ?? false,
                    gleaning: fisherfolkDetails.gleaning ?? false,
                    fishProcessing: fisherfolkDetails.fishProcessing ?? false,
                    fishVending: fisherfolkDetails.fishVending ?? false,
                    others: fisherfolkDetails.others,
                  },
                },
              }),

            // Handle Agri Youth details (if category is AGRI_YOUTH)
            ...(categoryType === "AGRI_YOUTH" &&
              agriYouthDetails && {
                AGRI_YOUTH: {
                  create: {
                    partOfFarmingHouseHold:
                      agriYouthDetails.partOfFarmingHouseHold ?? false,
                    attendedFormalAgriFishery:
                      agriYouthDetails.attendedFormalAgriFishery ?? false,
                    attendedNonFormalAgriFishery:
                      agriYouthDetails.attendedNonFormalAgriFishery ?? false,
                    participatedInAnyAgriculturalActivity:
                      agriYouthDetails.participatedInAnyAgriculturalActivity ??
                      false,
                    fishVending: agriYouthDetails.fishVending ?? false,
                    others: agriYouthDetails.others,
                  },
                },
              }),

            // Handle house head
            ...(houseHead && {
              houseHead: {
                create: {
                  houseHoldHead: houseHead.houseHoldHead ?? "",
                  relationship: houseHead.relationship ?? "",
                  numberOfLivingHouseHoldMembersTotal:
                    houseHead.numberOfLivingHouseHoldMembersTotal ?? 0,
                  numberOfMale: houseHead.numberOfMale ?? 0,
                  NumberOfFemale: houseHead.NumberOfFemale ?? 0,
                },
              },
            }),
          },
        });

        // Handle farm details separately due to complex relationships
        if (farmDetails && farmDetails.length > 0) {
          for (const farm of farmDetails) {
            await tx.farmDetails.create({
              data: {
                farmerId: createdFarmer.id,
                Location: farm.Location,
                TotalFarmAreaInHa: farm.TotalFarmAreaInHa,
                withAncestordomain: true,
                agrarianReform: farm.agrarianReform ?? false,
                OwnerDocumentsNumber: farm.OwnerDocumentsNumber,

                RegisterOwner: farm.RegisterOwner ?? false,
                ownerName: farm.ownerName ?? "",
                tenantOwner: farm.tenantOwner ?? false,
                teenantName: farm.teenantName,
                Leese: farm.Leese ?? false,
                leeseName: farm.leeseName,
                others: farm.others,
                othersField: farm.othersField,

                ...(categoryType === "FARMER" &&
                  farm.lotDetails && {
                    lotDetails: {
                      create: {
                        cropsORCommodity: farm.lotDetails.cropsORCommodity,
                        sizeInHa: farm.lotDetails.sizeInHa,
                        numberOfHeadForLivestockAndPoultry:
                          farm.lotDetails.numberOfHeadForLivestockAndPoultry,
                        FarmType: farm.lotDetails.FarmType,
                        organicPractitioner:
                          farm.lotDetails.organicPractitioner,
                      },
                    },
                  }),
              },
            });
          }
        }

        return createdFarmer;
      });

      const completeFarmer = await ctx.db.farmer.findUnique({
        where: { id: farmer.id },
        include: {
          farmerDetails: true,
          farmworkerDetails: true,
          fisherfolkDetails: true,
          AGRI_YOUTH: true,
          houseHead: true,
          farmDetails: {
            include: {
              lotDetails: true,
            },
          },
        },
      });

      return completeFarmer;
    }),
  getLatestFarmer: publicProcedure
    .input(
      z.object({
        id: z.number().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const latestFarmer = await ctx.db.farmer.findFirst({
        where: {
          id: input.id ?? undefined,
        },
        orderBy: { createdAt: "desc" },
        include: {
          farmerDetails: true,
          farmworkerDetails: true,
          fisherfolkDetails: true,
          AGRI_YOUTH: true,
          houseHead: true,
          farmDetails: true,
        },
      });

      if (!latestFarmer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No farmers found",
        });
      }

      return latestFarmer;
    }),

  farmerLogin: publicProcedure
    .input(
      z.object({
        usernameOrEmail: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { usernameOrEmail, password } = input;

      const farmer = await ctx.db.farmer.findFirst({
        where: {
          OR: [
            { username: usernameOrEmail },
            { email_address: usernameOrEmail },
          ],
        },
      });

      if (!farmer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const passwordValid = await compare(password, farmer.password);
      if (!passwordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      return {
        success: true,
        user: {
          id: farmer.id,
          username: farmer.username,
          email: farmer.email_address,
          type: "farmer" as const,
        },
        token: "your-jwt-token-or-session-id", // Replace with actual token generation
      };
    }),

  organicFarmerLogin: publicProcedure
    .input(
      z.object({
        usernameOrEmail: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { usernameOrEmail, password } = input;

      const organicFarmer = await ctx.db.organic_Farmer.findFirst({
        where: {
          OR: [
            { username: usernameOrEmail },
            { email_address: usernameOrEmail },
          ],
        },
      });

      if (!organicFarmer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const passwordValid = await compare(password, organicFarmer.password);
      if (!passwordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      return {
        success: true,
        user: {
          id: organicFarmer.id,
          username: organicFarmer.username,
          email: organicFarmer.email_address,
          type: "organicFarmer" as const,
        },
        token: "your-jwt-token-or-session-id",
      };
    }),

  adminLogin: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;

      const admin = await ctx.db.admin.findFirst({
        where: {
          username: String(username),
        },
      });

      if (!admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const passwordValid = await bcrypt.compare(password, admin.password);
      if (!passwordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      return {
        success: true,
        user: {
          id: admin.id,
          username: admin.username,
          type: "admin" as const,
        },
        token: "your-jwt-token-or-session-id",
      };
    }),
});
