-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "EDUCATION_LEVEL" AS ENUM ('NONE', 'ELEMENTARY', 'HIGHSCHOOL', 'SENIOR_HIGHSCHOOL', 'COLLEGE', 'POST_GRADUATE', 'VOCATIONAL');

-- CreateEnum
CREATE TYPE "CIVIL_STATUS" AS ENUM ('SINGLE', 'MARRIED', 'WIDOWED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "FARMER_CATEGORY" AS ENUM ('FARMER', 'FARMWORKER', 'FISHERFOLK', 'AGRI_YOUTH');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_address" TEXT,
    "surname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "middleName" TEXT,
    "extensionName" TEXT,
    "sex" "GENDER" NOT NULL,
    "houseOrLotOrBuildingNo" TEXT NOT NULL,
    "streetOrSitioOrSubDivision" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "municipalityOrCity" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "highestFormOfEducation" "EDUCATION_LEVEL" NOT NULL,
    "religion" TEXT,
    "civilStaus" "CIVIL_STATUS" NOT NULL,
    "nameOfSpouse" TEXT,
    "FourPS_Benificiaty" TEXT,
    "mothersName" TEXT,
    "fathersName" TEXT,
    "govermentId" TEXT NOT NULL,
    "personToContactIncaseOfEmerceny" TEXT,
    "personContactNumberIncaseOfEmergency" TEXT NOT NULL,
    "grossAnualIncomeLastYearFarming" INTEGER NOT NULL,
    "grossAnualIncomeLastYeaNonFarming" INTEGER NOT NULL,
    "farmerImage" TEXT NOT NULL,
    "farmerSignatureAsImage" TEXT,
    "farmerFingerPrintAsImage" TEXT,
    "categoryType" "FARMER_CATEGORY" NOT NULL,
    "houseHeadId" INTEGER,
    "numberOfFarms" INTEGER NOT NULL,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerDetails" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "rice" BOOLEAN NOT NULL DEFAULT false,
    "corn" BOOLEAN NOT NULL DEFAULT false,
    "othersCrops" TEXT,
    "livestock" BOOLEAN NOT NULL DEFAULT false,
    "livestockDetails" TEXT,
    "poultry" BOOLEAN NOT NULL DEFAULT false,
    "poultryDetails" TEXT,

    CONSTRAINT "FarmerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotDetails" (
    "id" SERIAL NOT NULL,
    "cropsORCommodity" TEXT NOT NULL,
    "sizeInHa" INTEGER NOT NULL,
    "numberOfHeadForLivestockAndPoultry" INTEGER NOT NULL,
    "FarmType" TEXT NOT NULL,
    "organicPractitioner" BOOLEAN NOT NULL,
    "farmerDetailsId" INTEGER NOT NULL,

    CONSTRAINT "LotDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmDetails" (
    "id" SERIAL NOT NULL,
    "Location" TEXT NOT NULL,
    "TotalFarmAreaInHa" INTEGER NOT NULL,
    "withAncestordomain" BOOLEAN,
    "agrarianReform" BOOLEAN NOT NULL,
    "OwnerDocumentsNumber" TEXT NOT NULL,
    "RegisterOwner" BOOLEAN,
    "ownerName" TEXT NOT NULL,
    "othersField" TEXT,
    "tenantOwner" BOOLEAN,
    "teenantName" TEXT,
    "Leese" BOOLEAN,
    "leeseName" TEXT,
    "others" TEXT,
    "farmerId" INTEGER NOT NULL,

    CONSTRAINT "FarmDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmWorkerDetails" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "landPreparation" BOOLEAN NOT NULL DEFAULT false,
    "plantingTransplanting" BOOLEAN NOT NULL DEFAULT false,
    "cultivation" BOOLEAN NOT NULL DEFAULT false,
    "harvesting" BOOLEAN NOT NULL DEFAULT false,
    "others" TEXT,

    CONSTRAINT "FarmWorkerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FisherfolkDetails" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "fishCapture" BOOLEAN NOT NULL DEFAULT false,
    "aquaculture" BOOLEAN NOT NULL DEFAULT false,
    "gleaning" BOOLEAN NOT NULL DEFAULT false,
    "fishProcessing" BOOLEAN NOT NULL DEFAULT false,
    "fishVending" BOOLEAN NOT NULL DEFAULT false,
    "others" TEXT,

    CONSTRAINT "FisherfolkDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AGRI_YOUTH" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "partOfFarmingHouseHold" BOOLEAN NOT NULL DEFAULT false,
    "attendedFormalAgriFishery" BOOLEAN NOT NULL DEFAULT false,
    "attendedNonFormalAgriFishery" BOOLEAN NOT NULL DEFAULT false,
    "participatedInAnyAgriculturalActivity" BOOLEAN NOT NULL DEFAULT false,
    "fishVending" BOOLEAN NOT NULL DEFAULT false,
    "others" TEXT,

    CONSTRAINT "AGRI_YOUTH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "houseHead" (
    "id" SERIAL NOT NULL,
    "houseHoldHead" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "numberOfLivingHouseHoldMembersTotal" INTEGER NOT NULL,
    "numberOfMale" INTEGER NOT NULL,
    "NumberOfFemale" INTEGER NOT NULL,

    CONSTRAINT "houseHead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_houseHeadId_key" ON "Farmer"("houseHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerDetails_farmerId_key" ON "FarmerDetails"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "LotDetails_farmerDetailsId_key" ON "LotDetails"("farmerDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "FarmWorkerDetails_farmerId_key" ON "FarmWorkerDetails"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "FisherfolkDetails_farmerId_key" ON "FisherfolkDetails"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "AGRI_YOUTH_farmerId_key" ON "AGRI_YOUTH"("farmerId");

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_houseHeadId_fkey" FOREIGN KEY ("houseHeadId") REFERENCES "houseHead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmerDetails" ADD CONSTRAINT "FarmerDetails_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotDetails" ADD CONSTRAINT "LotDetails_farmerDetailsId_fkey" FOREIGN KEY ("farmerDetailsId") REFERENCES "FarmDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmDetails" ADD CONSTRAINT "FarmDetails_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmWorkerDetails" ADD CONSTRAINT "FarmWorkerDetails_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisherfolkDetails" ADD CONSTRAINT "FisherfolkDetails_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AGRI_YOUTH" ADD CONSTRAINT "AGRI_YOUTH_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
