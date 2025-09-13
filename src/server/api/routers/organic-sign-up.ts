/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// ~/server/api/routers/organic-farmer.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";

export const organicFarmerRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        // Basic Profile
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
        FourPS_Benificiaty: z.string().optional(),
        mothersName: z.string().optional(),
        fathersName: z.string().optional(),
        govermentId: z.string().min(1, "Government ID is required"),
        personToContactIncaseOfEmerceny: z.string().optional(),
        personContactNumberIncaseOfEmergency: z
          .string()
          .min(1, "Emergency contact number is required"),

        // Income
        grossAnualIncomeLastYearFarming: z.number().min(0),
        grossAnualIncomeLastYeaNonFarming: z.number().min(0),

        // Images
        farmerImage: z.string().min(1, "Farmer image is required"),

        // Certification
        withOrganicAgricultureCertification: z.boolean().optional(),
        certification: z
          .enum(["THIRD_PARTY_CERTIFICATION", "PARTICIPATORY_GUARANTEE_SYSTEM"])
          .optional(),
        whatStagesInCertification: z.string().optional(),

        // Nature of Business
        productionForInputs: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        productionForFood: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        postHarvestAndProcessing: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        tradingAndWholeSale: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        retailing: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        transPortAndLogistics: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        WareHousing: z
          .enum(["PRIMARY_BUSINESS", "SECONDARY_BUSINESS", "NOT_APPLICABLE"])
          .optional(),
        businessOthers: z.string().optional(),

        // Target Market
        direcToConsumer: z.boolean().optional(),
        trader: z.boolean().optional(),
        specificType1: z.string().optional(),
        retailer: z.boolean().optional(),
        institutionalBuyer: z.boolean().optional(),
        SpecificType2: z.string().optional(),
        internationalBasedBuyers: z.boolean().optional(),
        SpecificType3: z.string().optional(),
        marketOthers: z.string().optional(),

        // Agricultural Commodities
        agriculturalCommodities: z
          .array(
            z.object({
              type: z.enum([
                "Grains",
                "LowlandVegetables",
                "UplandVegetables",
                "FruitsAndNots",
                "Mushroom",
                "OrganicSoil",
                "Rootcrops",
                "PultryProducts",
                "LiveStockProducts",
                "FisheriesAndAquaCulture",
                "IndustrialCropsAndProducts",
                "OtherCommodity",
              ]),
              name: z.string().min(1, "Name is required"),
              sizeInHa: z.number().int().min(0, "Size must be at least 0"),
              annualVolumeInKG: z
                .number()
                .int()
                .min(0, "Volume must be at least 0"),
              certification: z.string().optional(),
            }),
          )
          .optional(),

        othersCommodity: z.string().optional(),

        // Owned/Shared Facilities
        ownSharedFacilities: z
          .array(
            z.object({
              facilitiesMachineryEquipmentUsed: z
                .string()
                .min(1, "Equipment name is required"),
              ownership: z.string().min(1, "Ownership is required"),
              model: z.string().min(1, "Model is required"),
              quantity: z.string().min(1, "Quantity is required"),
              volumeServicesArea: z.string().min(1, "Service area is required"),
              averageWorkingHoursDay: z
                .string()
                .min(1, "Working hours is required"),
              Remarks: z.string().optional(),
              dedicatedToOrganic: z.boolean(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        password,
        agriculturalCommodities,
        ownSharedFacilities,
        businessOthers,
        marketOthers,
        ...organicFarmerData
      } = input;

      // Check if username already exists
      const existingFarmer = await ctx.db.organic_Farmer.findFirst({
        where: { username: organicFarmerData.username },
      });

      if (existingFarmer) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create organic farmer with related data using transaction
      const organicFarmer = await ctx.db.$transaction(async (tx) => {
        // Create the main organic farmer record
        const createdFarmer = await tx.organic_Farmer.create({
          data: {
            ...organicFarmerData,
            password: hashedPassword,
            Others: businessOthers,
            others: marketOthers,
          },
        });

        // Handle agricultural commodities
        if (agriculturalCommodities && agriculturalCommodities.length > 0) {
          for (const commodity of agriculturalCommodities) {
            // Create the commodity record with the appropriate foreign key
            const commodityData: any = {
              name: commodity.name,
              sizeInHa: commodity.sizeInHa,
              annualVolumeInKG: commodity.annualVolumeInKG,
              Certification: commodity.certification,
            };

            // Set the appropriate foreign key based on the type
            switch (commodity.type) {
              case "Grains":
                commodityData.GrainsId = createdFarmer.id;
                break;
              case "LowlandVegetables":
                commodityData.LowlandVegetablesId = createdFarmer.id;
                break;
              case "UplandVegetables":
                commodityData.UplandVegetablesId = createdFarmer.id;
                break;
              case "FruitsAndNots":
                commodityData.FruitsAndNotsId = createdFarmer.id;
                break;
              case "Mushroom":
                commodityData.MushroomId = createdFarmer.id;
                break;
              case "OrganicSoil":
                commodityData.OrganicSoilId = createdFarmer.id;
                break;
              case "Rootcrops":
                commodityData.RootcropsId = createdFarmer.id;
                break;
              case "PultryProducts":
                commodityData.PultryProductsId = createdFarmer.id;
                break;
              case "LiveStockProducts":
                commodityData.LiveStockProductsId = createdFarmer.id;
                break;
              case "FisheriesAndAquaCulture":
                commodityData.FisheriesAndAquaCultureId = createdFarmer.id;
                break;
              case "IndustrialCropsAndProducts":
                commodityData.IndustrialCropsAndProductsId = createdFarmer.id;
                break;
              case "OtherCommodity":
                commodityData.OtherCommodityId = createdFarmer.id;
                break;
            }

            await tx.agriculturalCommoditiesFisheryProducts.create({
              data: commodityData,
            });
          }
        }

        // Handle owned/shared facilities
        if (ownSharedFacilities && ownSharedFacilities.length > 0) {
          for (const facility of ownSharedFacilities) {
            await tx.ownSharedFacilities.create({
              data: {
                ...facility,
                organicFarmerId: createdFarmer.id,
              },
            });
          }
        }

        return createdFarmer;
      });

      // Fetch the complete organic farmer data with all relations
      const completeOrganicFarmer = await ctx.db.organic_Farmer.findUnique({
        where: { id: organicFarmer.id },
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
        },
      });

      return completeOrganicFarmer;
    }),

  getLatestOrganicFarmer: publicProcedure
    .input(
      z.object({
        id: z.number().optional().nullable(),
      }),
    )
    .query(async ({ ctx }) => {
      const latestFarmer = await ctx.db.organic_Farmer.findFirst({
        orderBy: { createdAt: "desc" },
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
});
