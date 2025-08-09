import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Fixed Helper function for random enum values
function randomEnum<T extends Record<string, string | number>>(
  anEnum: T,
): T[keyof T] {
  const enumValues = Object.values(anEnum) as T[keyof T][];
  const randomIndex = faker.number.int({ min: 0, max: enumValues.length - 1 });
  return enumValues[randomIndex] as any;
}

// Define enums (these should match your Prisma schema)
enum FarmerRegistrationsStatus {
  APPLICANTS = "APPLICANTS",
  NOT_QUALIFIED = "NOT_QUALIFIED",
  REGISTERED = "REGISTERED",
}

enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

enum EDUCATION_LEVEL {
  NONE = "NONE",
  ELEMENTARY = "ELEMENTARY",
  HIGHSCHOOL = "HIGHSCHOOL",
  SENIOR_HIGHSCHOOL = "SENIOR_HIGHSCHOOL",
  COLLEGE = "COLLEGE",
  POST_GRADUATE = "POST_GRADUATE",
  VOCATIONAL = "VOCATIONAL",
}

enum CIVIL_STATUS {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
}

enum FARMER_CATEGORY {
  FARMER = "FARMER",
  FARMWORKER = "FARMWORKER",
  FISHERFOLK = "FISHERFOLK",
  AGRI_YOUTH = "AGRI_YOUTH",
}

enum organicFarmerRegistrationsStatus {
  APPLICANTS = "APPLICANTS",
  NOT_QUALIFIED = "NOT_QUALIFIED",
  REGISTERED = "REGISTERED",
}

enum Certification {
  THIRD_PARTY_CERTIFICATION = "THIRD_PARTY_CERTIFICATION",
  PARTICIPATORY_GUARANTEE_SYSTEM = "PARTICIPATORY_GUARANTEE_SYSTEM",
}

enum CHOICES_BUSINESS_NATURE {
  PRIMARY_BUSINESS = "PRIMARY_BUSINESS",
  SECONDARY_BUSINESS = "SECONDARY_BUSINESS",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

enum ConcernStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

enum MessageSenderType {
  ADMIN = "ADMIN",
  FARMER = "FARMER",
  ORGANIC_FARMER = "ORGANIC_FARMER",
}

async function main() {
  // Seed 5 Admins
  for (let i = 0; i < 5; i++) {
    await prisma.admin.create({
      data: {
        username: faker.internet.username(), // Changed from userName() to username()
        password: "placeholder_password",
      },
    });
  }

  // Seed 50 HouseHeads (one for each farmer)
  const houseHeads = [];
  for (let i = 0; i < 50; i++) {
    const houseHead = await prisma.houseHead.create({
      data: {
        houseHoldHead: faker.person.fullName(),
        relationship: faker.helpers.arrayElement([
          "Father",
          "Mother",
          "Grandfather",
          "Grandmother",
          "Uncle",
        ]),
        numberOfLivingHouseHoldMembersTotal: faker.number.int({
          min: 1,
          max: 10,
        }),
        numberOfMale: faker.number.int({ min: 0, max: 5 }),
        NumberOfFemale: faker.number.int({ min: 0, max: 5 }),
      },
    });
    houseHeads.push(houseHead);
  }

  // Seed 50 Farmers
  const farmers = [];
  for (let i = 0; i < 50; i++) {
    const farmer = await prisma.farmer.create({
      data: {
        status: randomEnum(FarmerRegistrationsStatus),
        username: faker.internet.username(), // Changed from userName() to username()
        password: "placeholder_password",
        email_address: faker.internet.email(),
        surname: faker.person.lastName(),
        firstname: faker.person.firstName(),
        middleName: faker.person.middleName(),
        extensionName: faker.helpers.arrayElement(["Jr.", "Sr.", "III", ""]),
        sex: randomEnum(GENDER),
        houseOrLotOrBuildingNo: faker.location.buildingNumber(),
        streetOrSitioOrSubDivision: faker.location.street(),
        barangay: `Barangay ${faker.location.city()}`,
        municipalityOrCity: faker.location.city(),
        province: faker.location.state(),
        region: faker.location.country(),
        contactNumber: faker.phone.number(),
        placeOfBirth: faker.location.city(),
        dateOfBirth: faker.date.past({ years: 60, refDate: "2000-01-01" }),
        highestFormOfEducation: randomEnum(EDUCATION_LEVEL),
        religion: faker.helpers.arrayElement([
          "Catholic",
          "Protestant",
          "Muslim",
          "Buddhist",
          "None",
        ]),
        civilStaus: randomEnum(CIVIL_STATUS),
        nameOfSpouse: faker.person.fullName(),
        FourPS_Benificiaty: faker.helpers.arrayElement(["Yes", "No"]),
        mothersName: faker.person.fullName(),
        fathersName: faker.person.fullName(),
        govermentId: faker.string.numeric(12),
        personToContactIncaseOfEmerceny: faker.person.fullName(),
        personContactNumberIncaseOfEmergency: faker.phone.number(),
        grossAnualIncomeLastYearFarming: faker.number.int({
          min: 10000,
          max: 500000,
        }),
        grossAnualIncomeLastYeaNonFarming: faker.number.int({
          min: 0,
          max: 200000,
        }),
        farmerImage: "placeholder_image",
        categoryType: randomEnum(FARMER_CATEGORY),
        houseHeadId: houseHeads[i]?.id, // Assign unique houseHeadId to each farmer
        numberOfFarms: faker.number.int({ min: 1, max: 5 }),
      },
    });
    farmers.push(farmer);
  }

  // Seed FarmerDetails for each farmer
  for (const farmer of farmers) {
    await prisma.farmerDetails.create({
      data: {
        farmerId: farmer.id,
        rice: faker.datatype.boolean(),
        corn: faker.datatype.boolean(),
        othersCrops: faker.helpers.arrayElement([
          null,
          "Vegetables",
          "Fruits",
          "Coffee",
        ]),
        livestock: faker.datatype.boolean(),
        livestockDetails: faker.helpers.arrayElement([
          null,
          "Cows",
          "Goats",
          "Pigs",
        ]),
        poultry: faker.datatype.boolean(),
        poultryDetails: faker.helpers.arrayElement([null, "Chickens", "Ducks"]),
      },
    });
  }

  // Seed FarmDetails for each farmer
  for (const farmer of farmers) {
    const farmDetails = await prisma.farmDetails.create({
      data: {
        Location: faker.location.streetAddress(),
        TotalFarmAreaInHa: faker.number.int({ min: 1, max: 50 }),
        withAncestordomain: faker.datatype.boolean(),
        agrarianReform: faker.datatype.boolean(),
        OwnerDocumentsNumber: faker.string.alphanumeric(10),
        RegisterOwner: faker.datatype.boolean(),
        ownerName: faker.person.fullName(),
        othersField: faker.helpers.arrayElement([null, "Additional info"]),
        tenantOwner: faker.datatype.boolean(),
        teenantName: faker.person.fullName(),
        Leese: faker.datatype.boolean(),
        leeseName: faker.person.fullName(),
        others: faker.helpers.arrayElement([null, "Other details"]),
        farmerId: farmer.id,
      },
    });

    // Seed LotDetails for each farm
    await prisma.lotDetails.create({
      data: {
        cropsORCommodity: faker.helpers.arrayElement([
          "Rice",
          "Corn",
          "Vegetables",
          "Fruits",
        ]),
        sizeInHa: faker.number.int({
          min: 1,
          max: farmDetails.TotalFarmAreaInHa,
        }),
        numberOfHeadForLivestockAndPoultry: faker.number.int({
          min: 0,
          max: 100,
        }),
        FarmType: faker.helpers.arrayElement([
          "Irrigated",
          "Rainfed",
          "Upland",
        ]),
        organicPractitioner: faker.datatype.boolean(),
        farmerDetailsId: farmDetails.id,
      },
    });
  }

  // Seed 30 Organic Farmers
  const organicFarmers = [];
  for (let i = 0; i < 30; i++) {
    const organicFarmer = await prisma.organic_Farmer.create({
      data: {
        status: randomEnum(organicFarmerRegistrationsStatus),
        username: faker.internet.userName(),
        password: "placeholder_password",
        email_address: faker.internet.email(),
        surname: faker.person.lastName(),
        firstname: faker.person.firstName(),
        middleName: faker.person.middleName(),
        extensionName: faker.helpers.arrayElement(["Jr.", "Sr.", "III", ""]),
        sex: randomEnum(GENDER),
        houseOrLotOrBuildingNo: faker.location.buildingNumber(),
        streetOrSitioOrSubDivision: faker.location.street(),
        barangay: `Barangay ${faker.location.city()}`,
        municipalityOrCity: faker.location.city(),
        province: faker.location.state(),
        region: faker.location.country(),
        contactNumber: faker.phone.number(),
        placeOfBirth: faker.location.city(),
        dateOfBirth: faker.date.past({ years: 60, refDate: "2000-01-01" }),
        highestFormOfEducation: randomEnum(EDUCATION_LEVEL),
        religion: faker.helpers.arrayElement([
          "Catholic",
          "Protestant",
          "Muslim",
          "Buddhist",
          "None",
        ]),
        civilStaus: randomEnum(CIVIL_STATUS),
        FourPS_Benificiaty: faker.helpers.arrayElement(["Yes", "No"]),
        mothersName: faker.person.fullName(),
        fathersName: faker.person.fullName(),
        govermentId: faker.string.numeric(12),
        personToContactIncaseOfEmerceny: faker.person.fullName(),
        personContactNumberIncaseOfEmergency: faker.phone.number(),
        grossAnualIncomeLastYearFarming: faker.number.int({
          min: 10000,
          max: 500000,
        }),
        grossAnualIncomeLastYeaNonFarming: faker.number.int({
          min: 0,
          max: 200000,
        }),
        farmerImage: "placeholder_image",
        withOrganicAgricultureCertification: faker.datatype.boolean(),
        certification: randomEnum(Certification),
        whatStagesInCertification: faker.helpers.arrayElement([
          "Stage 1",
          "Stage 2",
          "Stage 3",
        ]),
        productionForInputs: randomEnum(CHOICES_BUSINESS_NATURE),
        productionForFood: randomEnum(CHOICES_BUSINESS_NATURE),
        postHarvestAndProcessing: randomEnum(CHOICES_BUSINESS_NATURE),
        tradingAndWholeSale: randomEnum(CHOICES_BUSINESS_NATURE),
        retailing: randomEnum(CHOICES_BUSINESS_NATURE),
        transPortAndLogistics: randomEnum(CHOICES_BUSINESS_NATURE),
        WareHousing: randomEnum(CHOICES_BUSINESS_NATURE),
        Others: faker.helpers.arrayElement([null, "Other business"]),
        direcToConsumer: faker.datatype.boolean(),
        trader: faker.datatype.boolean(),
        specificType1: faker.commerce.productName(),
        retailer: faker.datatype.boolean(),
        institutionalBuyer: faker.datatype.boolean(),
        SpecificType2: faker.commerce.productName(),
        internationalBasedBuyers: faker.datatype.boolean(),
        SpecificType3: faker.commerce.productName(),
        others: faker.helpers.arrayElement([null, "Other details"]),
        othersCommodity: faker.helpers.arrayElement([
          null,
          "Other commodities",
        ]),
      },
    });
    organicFarmers.push(organicFarmer);
  }

  // Seed AgriculturalCommodities for organic farmers
  for (const farmer of organicFarmers) {
    // Create one commodity for each type (randomly)
    if (faker.datatype.boolean()) {
      await prisma.agriculturalCommoditiesFisheryProducts.create({
        data: {
          name: "Rice",
          sizeInHa: faker.number.int({ min: 1, max: 20 }),
          annualVolumeInKG: faker.number.int({ min: 100, max: 10000 }),
          Certification: faker.helpers.arrayElement(["Organic", "Fair Trade"]),
          GrainsId: farmer.id,
        },
      });
    }

    if (faker.datatype.boolean()) {
      await prisma.agriculturalCommoditiesFisheryProducts.create({
        data: {
          name: "Vegetables",
          sizeInHa: faker.number.int({ min: 1, max: 10 }),
          annualVolumeInKG: faker.number.int({ min: 50, max: 5000 }),
          Certification: faker.helpers.arrayElement(["Organic", "Fair Trade"]),
          LowlandVegetablesId: farmer.id,
        },
      });
    }

    // Add more commodity types as needed...
  }

  // Seed OwnSharedFacilities for organic farmers
  for (const farmer of organicFarmers) {
    await prisma.ownSharedFacilities.create({
      data: {
        facilitiesMachineryEquipmentUsed: faker.helpers.arrayElement([
          "Tractor",
          "Plow",
          "Irrigation System",
        ]),
        ownership: faker.helpers.arrayElement(["Owned", "Shared", "Rented"]),
        model: faker.vehicle.model(),
        quantity: faker.number.int({ min: 1, max: 5 }).toString(),
        volumeServicesArea: faker.number.int({ min: 1, max: 100 }).toString(),
        averageWorkingHoursDay: faker.number
          .int({ min: 1, max: 12 })
          .toString(),
        Remarks: faker.helpers.arrayElement([
          null,
          "Needs maintenance",
          "New equipment",
        ]),
        dedicatedToOrganic: faker.datatype.boolean(),
        organicFarmerId: farmer.id,
      },
    });
  }

  // Seed FarmerConcerns
  for (const farmer of farmers) {
    await prisma.farmerConcern.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        image: faker.helpers.arrayElement([null, "placeholder_image"]),
        status: randomEnum(ConcernStatus),
        farmerId: farmer.id,
      },
    });
  }

  // Seed OrganicFarmerConcerns
  for (const farmer of organicFarmers) {
    await prisma.organicFarmerConcern.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        image: faker.helpers.arrayElement([null, "placeholder_image"]),
        status: randomEnum(ConcernStatus),
        farmerId: farmer.id,
      },
    });
  }

  // Seed ConcernMessages
  const concerns = await prisma.farmerConcern.findMany();
  for (const concern of concerns) {
    await prisma.concernMessage.create({
      data: {
        content: faker.lorem.paragraph(),
        senderType: randomEnum(MessageSenderType),
        adminId: faker.helpers.arrayElement([
          null,
          (await prisma.admin.findFirst())?.id,
        ]),
        farmerId: concern.farmerId,
        farmerConcernId: concern.id,
        createdAt: faker.date.recent(),
      },
    });
  }

  // Seed Events
  for (let i = 0; i < 15; i++) {
    await prisma.events.create({
      data: {
        Eventdate: faker.date.future(),
        What: faker.lorem.words(5),
        Where: faker.location.city(),
        Image: faker.helpers.arrayElement([null, "placeholder_image"]),
        Note: faker.lorem.sentence(),
        forFarmersOnly: faker.datatype.boolean(),
        forOgranicsFarmersOnly: faker.datatype.boolean(),
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
