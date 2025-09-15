"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

// Define form schema that matches your Organic_Farmer schema
const organicFarmerSignupSchema = z
  .object({
    // Basic Profile
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
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
    dateOfBirth: z.string().min(1, "Date of birth is required"),
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
    govermentId: z.string().min(1, "Government ID image is required"),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type OrganicFarmerSignupForm = z.infer<typeof organicFarmerSignupSchema>;

const OrganicFarmerSignupPage = () => {
  const [isWaray, setIsWaray] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    control,
  } = useForm<OrganicFarmerSignupForm>({
    resolver: zodResolver(organicFarmerSignupSchema),
    defaultValues: {
      sex: "MALE",
      civilStaus: "SINGLE",
      highestFormOfEducation: "NONE",
      grossAnualIncomeLastYearFarming: 0,
      grossAnualIncomeLastYeaNonFarming: 0,
      withOrganicAgricultureCertification: false,
      agriculturalCommodities: [],
      ownSharedFacilities: [],
    },
    mode: "onChange",
  });

  const {
    fields: commodityFields,
    append: appendCommodity,
    remove: removeCommodity,
  } = useFieldArray({
    control,
    name: "agriculturalCommodities",
  });

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility,
  } = useFieldArray({
    control,
    name: "ownSharedFacilities",
  });

  const { toast } = useToast();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const withCertification = watch("withOrganicAgricultureCertification");

  const signupMutation = api.organicFarmer.signup.useMutation({
    onSuccess: () => {
      toast({
        title: isWaray ? "Malinamposan!" : "Success!",
        description: isWaray
          ? "Organic farmer account nga malinamposan nga ginhimo"
          : "Organic farmer account created successfully",
        variant: "default",
      });
      router.push("/organic-registrations/info");
    },
    onError: (error) => {
      toast({
        title: isWaray ? "Sayop" : "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrganicFarmerSignupForm) => {
    setDisplayError(errors as any);
    const submitData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      agriculturalCommodities: data.agriculturalCommodities || [],
      ownSharedFacilities: data.ownSharedFacilities || [],
    };

    signupMutation.mutate(submitData);
  };

  console.log("ERROS", errors);
  const nextStep = async () => {
    let isValid = false;
    if (activeStep === 1) {
      isValid = await trigger([
        "surname",
        "firstname",
        "sex",
        "dateOfBirth",
        "placeOfBirth",
        "civilStaus",
        "highestFormOfEducation",
        "govermentId",
        "personContactNumberIncaseOfEmergency",
        "grossAnualIncomeLastYearFarming",
        "grossAnualIncomeLastYeaNonFarming",
        "farmerImage",
      ]);
    } else if (activeStep === 2) {
      isValid = await trigger([
        "houseOrLotOrBuildingNo",
        "streetOrSitioOrSubDivision",
        "barangay",
        "municipalityOrCity",
        "province",
        "region",
        "contactNumber",
      ]);
    } else if (activeStep === 3) {
      isValid = await trigger([
        "withOrganicAgricultureCertification",
        "certification",
        "whatStagesInCertification",
      ]);
    } else if (activeStep === 4) {
      isValid = await trigger([
        "productionForInputs",
        "productionForFood",
        "postHarvestAndProcessing",
        "tradingAndWholeSale",
        "retailing",
        "transPortAndLogistics",
        "WareHousing",
      ]);
    } else if (activeStep === 5) {
      isValid = await trigger([
        "direcToConsumer",
        "trader",
        "retailer",
        "institutionalBuyer",
        "internationalBasedBuyers",
      ]);
    } else if (activeStep === 6) {
      isValid = true;
    } else if (activeStep === 7 && Object.keys(errors).length === 0) {
      isValid = true;
    } else if (activeStep === 8) {
      isValid = await trigger(["username", "password", "confirmPassword"]);
    }
    console.log("IS VALID", errors);

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast({
        title: isWaray ? "Sayop ha Pag-validate" : "Validation Error",
        description: isWaray
          ? "Palihog pun-i an tanan nga kinahanglanon nga mga field nga tama"
          : "Please fill out all required fields correctly",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => setActiveStep((prev) => prev - 1);

  const addCommodity = () => {
    appendCommodity({
      type: "Grains",
      name: "",
      sizeInHa: 0,
      annualVolumeInKG: 0,
      certification: "",
    });
  };

  const addFacility = () => {
    appendFacility({
      facilitiesMachineryEquipmentUsed: "",
      ownership: "",
      model: "",
      quantity: "",
      volumeServicesArea: "",
      averageWorkingHoursDay: "",
      Remarks: "",
      dedicatedToOrganic: false,
    });
  };

  return (
    <div
      className="relative min-h-screen bg-gray-700 bg-[url('/background.png')] bg-center py-8"
      style={{ backgroundSize: "150%" }}
    >
      <div className="mx-auto max-w-[2000px] rounded-lg bg-[#f9f8f8] p-8 shadow-md lg:px-40 lg:py-10">
        <div className="relative mb-6 flex items-center justify-between">
          <a
            href="/sign-in"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isWaray ? "Back to Login" : "Balik ha Pag-login"}
          </a>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-gray-800">
            {!isWaray
              ? "Organic Farmer Registration"
              : "Pagrehistro han Organic Farmer"}
          </h1>

          {/* Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="language"
              checked={isWaray}
              onCheckedChange={setIsWaray}
            />
            <Label htmlFor="language">{isWaray ? "Waray" : "English"}</Label>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    activeStep >= step
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 8 && (
                  <div
                    className={`flex-1 border-t-2 ${activeStep > step ? "border-green-600" : "border-gray-200"}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            {activeStep === 1 &&
              (!isWaray ? "Personal Information" : "Impormasyon Personal")}
            {activeStep === 2 &&
              (!isWaray ? "Address Information" : "Impormasyon han Address")}
            {activeStep === 3 &&
              (!isWaray
                ? "Certification Details"
                : "Mga Detalye han Sertipikasyon")}
            {activeStep === 4 &&
              (!isWaray ? "Nature of Business" : "Klase han Negosyo")}
            {activeStep === 5 &&
              (!isWaray ? "Target Market" : "Target nga Merkado")}
            {activeStep === 6 &&
              (!isWaray
                ? "Agricultural Commodities"
                : "Mga Produkto Agrikultural")}
            {activeStep === 7 &&
              (!isWaray
                ? "Facilities & Equipment"
                : "Mga Pasilidad ngan Ekipo")}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="border-b pb-2 text-2xl font-bold text-gray-800">
                {!isWaray ? "Personal Information" : "Impormasyon Personal"}
              </h2>

              {/* Credentials Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray
                    ? "Account Credentials"
                    : "Mga Kredensyal han Account"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3"></div>
              </div>

              {/* Name Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray ? "Name Information" : "Impormasyon han Ngalan"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Surname*" : "Apelyido*"}
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.surname ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("surname")}
                    />
                    {errors.surname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.surname.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "First Name*" : "Pangaran*"}
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.firstname ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("firstname")}
                    />
                    {errors.firstname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Middle Name" : "Tunga nga Ngalan"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("middleName")}
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="md:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Extension Name" : "Extension han Ngalan"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("extensionName")}
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray ? "Personal Details" : "Mga Detalye Personal"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Sex*" : "Sekso*"}
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("sex")}
                    >
                      <option value="MALE">
                        {!isWaray ? "Male" : "Lalaki"}
                      </option>
                      <option value="FEMALE">
                        {!isWaray ? "Female" : "Babaye"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Date of Birth*" : "Adlaw han Pagkatawo*"}
                    </label>
                    <input
                      type="date"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.dateOfBirth
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Place of Birth*" : "Lugar han Pagkatawo*"}
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.placeOfBirth
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("placeOfBirth")}
                    />
                    {errors.placeOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.placeOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Civil Status*" : "Estado Sibil*"}
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("civilStaus")}
                    >
                      <option value="SINGLE">
                        {!isWaray ? "Single" : "Soltero/Soltera"}
                      </option>
                      <option value="MARRIED">
                        {!isWaray ? "Married" : "Minyo"}
                      </option>
                      <option value="WIDOWED">
                        {!isWaray ? "Widowed" : "Balo/Bala"}
                      </option>
                      <option value="SEPARATED">
                        {!isWaray ? "Separated" : "Nabulag"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Highest Form of Education*"
                        : "Pinakataas nga Porma han Edukasyon*"}
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("highestFormOfEducation")}
                    >
                      <option value="NONE">
                        {!isWaray ? "None" : "Waray"}
                      </option>
                      <option value="ELEMENTARY">
                        {!isWaray ? "Elementary" : "Elementarya"}
                      </option>
                      <option value="HIGHSCHOOL">
                        {!isWaray ? "High School" : "Haiskul"}
                      </option>
                      <option value="SENIOR_HIGHSCHOOL">
                        {!isWaray ? "Senior High School" : "Senior High School"}
                      </option>
                      <option value="COLLEGE">
                        {!isWaray ? "College" : "Kolehiyo"}
                      </option>
                      <option value="POST_GRADUATE">
                        {!isWaray ? "Post Graduate" : "Post Graduate"}
                      </option>
                      <option value="VOCATIONAL">
                        {!isWaray ? "Vocational" : "Bokasyonal"}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Religion" : "Relihiyon"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("religion")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Email Address" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("email_address")}
                    />
                  </div>
                </div>
              </div>

              {/* Family Information Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray ? "Family Information" : "Impormasyon han Pamilya"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Mothers Name" : "Ngaran han Iroy"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("mothersName")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Fathers Name" : "Ngaran han Amay"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("fathersName")}
                    />
                  </div>
                </div>
              </div>

              {/* Government & Emergency Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray
                    ? "Government & Emergency Information"
                    : "Impormasyon han Gobierno ngan Emergensya"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "4PS Beneficiary" : "Benepisyaryo han 4PS"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("FourPS_Benificiaty")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Government ID*" : "Government ID (Litrato)*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.govermentId
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (typeof event.target?.result === "string") {
                              setValue("govermentId", event.target.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {errors.govermentId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.govermentId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Person to contact in case of emergency"
                        : "Tao nga Kontakon Kon May Emergensya"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("personToContactIncaseOfEmerceny")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Emergency contact number*"
                        : "Numero han Kontak Kon May Emergensya*"}
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.personContactNumberIncaseOfEmergency
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("personContactNumberIncaseOfEmergency")}
                    />
                    {errors.personContactNumberIncaseOfEmergency && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.personContactNumberIncaseOfEmergency.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Income Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray ? "Income Information" : "Impormasyon han Kita"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Gross Annual Income (Farming)*"
                        : "Gross Annual Income (Pagparauma)*"}
                    </label>
                    <input
                      type="number"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.grossAnualIncomeLastYearFarming
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("grossAnualIncomeLastYearFarming", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.grossAnualIncomeLastYearFarming && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.grossAnualIncomeLastYearFarming.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Gross Annual Income (Non-Farming)*"
                        : "Gross Annual Income (Diri Pagparauma)*"}
                    </label>
                    <input
                      type="number"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.grossAnualIncomeLastYeaNonFarming
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("grossAnualIncomeLastYeaNonFarming", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.grossAnualIncomeLastYeaNonFarming && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.grossAnualIncomeLastYeaNonFarming.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray
                    ? "Ownership documents"
                    : "Pag-upload han Dokumento"}
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Farmer Image*" : "Litrato han Parauma*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                        errors.farmerImage
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (typeof event.target?.result === "string") {
                              setValue("farmerImage", event.target.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {errors.farmerImage && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.farmerImage.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-6 py-2 text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Address Information */}
          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray ? "Address Information" : "Impormasyon han Address"}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray
                      ? "House/Lot/Building No*"
                      : "Balay/Lote/Gusali No*"}
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.houseOrLotOrBuildingNo
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("houseOrLotOrBuildingNo")}
                  />
                  {errors.houseOrLotOrBuildingNo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.houseOrLotOrBuildingNo.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray
                      ? "Street/Sitio/Subdivision*"
                      : "Kalsada/Sitio/Subdivision*"}
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.streetOrSitioOrSubDivision
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("streetOrSitioOrSubDivision")}
                  />
                  {errors.streetOrSitioOrSubDivision && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.streetOrSitioOrSubDivision.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray ? "Barangay*" : "Barangay*"}
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.barangay ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("barangay")}
                  />
                  {errors.barangay && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.barangay.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray ? "Municipality/City*" : "Munispyo/Siyudad*"}
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.municipalityOrCity
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("municipalityOrCity")}
                  />
                  {errors.municipalityOrCity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.municipalityOrCity.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray ? "Province*" : "Probinsya*"}
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.province ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("province")}
                  />
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.province.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray ? "Region*" : "Rehiyon*"}
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.region ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("region")}
                  />
                  {errors.region && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.region.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {!isWaray ? "Contact Number*" : "Numero han Kontak*"}
                </label>
                <input
                  type="text"
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.contactNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("contactNumber")}
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Certification Details */}
          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray
                  ? "Certification Details"
                  : "Mga Detalye han Sertipikasyon"}
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600"
                      {...register("withOrganicAgricultureCertification")}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Do you have Organic Agriculture Certification?"
                        : "Igkakarawat ka ba hin Organic Agriculture Certification?"}
                    </span>
                  </label>
                </div>

                {withCertification && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Certification Type"
                        : "Klase han Sertipikasyon"}
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("certification")}
                    >
                      <option value="">
                        {!isWaray
                          ? "Select certification type"
                          : "Pili-a an klase han sertipikasyon"}
                      </option>
                      <option value="THIRD_PARTY_CERTIFICATION">
                        {!isWaray
                          ? "Third Party Certification"
                          : "Third Party Certification"}
                      </option>
                      <option value="PARTICIPATORY_GUARANTEE_SYSTEM">
                        {!isWaray
                          ? "Participatory Guarantee System"
                          : "Participatory Guarantee System"}
                      </option>
                    </select>
                  </div>
                )}

                {!withCertification && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "What stages are you in for certification?"
                        : "Ha ano nga mga yugto ka ha sertipikasyon?"}
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      rows={3}
                      {...register("whatStagesInCertification")}
                      placeholder={
                        !isWaray
                          ? "Describe your current certification stage..."
                          : "Iladawan an imo kasangkaran nga yugto ha sertipikasyon..."
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Nature of Business */}
          {activeStep === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray ? "Nature of Business" : "Klase han Negosyo"}
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-4 text-sm text-gray-600">
                  {!isWaray
                    ? "Select the nature of your business activities and specify if they are primary or secondary business."
                    : "Pili-a an klase han imo mga kalihokan ha negosyo ngan ispesipiko kon primary o secondary business ini."}
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: "productionForInputs",
                      label: !isWaray
                        ? "Production for Inputs"
                        : "Produksyon para ha Inputs",
                    },
                    {
                      key: "productionForFood",
                      label: !isWaray
                        ? "Production for Food"
                        : "Produksyon para ha Pagkaon",
                    },
                    {
                      key: "postHarvestAndProcessing",
                      label: !isWaray
                        ? "Post Harvest and Processing"
                        : "Post Harvest ngan Pagproseso",
                    },
                    {
                      key: "tradingAndWholeSale",
                      label: !isWaray
                        ? "Trading and Wholesale"
                        : "Trading ngan Wholesale",
                    },
                    {
                      key: "retailing",
                      label: !isWaray ? "Retailing" : "Retailing",
                    },
                    {
                      key: "transPortAndLogistics",
                      label: !isWaray
                        ? "Transport and Logistics"
                        : "Transporte ngan Logistics",
                    },
                    {
                      key: "WareHousing",
                      label: !isWaray ? "Warehousing" : "Warehousing",
                    },
                  ].map((business) => (
                    <div
                      key={business.key}
                      className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                      <div className="font-medium text-gray-700">
                        {business.label}
                      </div>
                      <div>
                        <select
                          className="block w-full rounded-md border border-gray-300 p-2"
                          {...register(business.key as any)}
                        >
                          <option value="NOT_APPLICABLE">
                            {!isWaray ? "Not applicable" : "Diri aplikable"}
                          </option>
                          <option value="PRIMARY_BUSINESS">
                            {!isWaray ? "Primary Business" : "Primary Business"}
                          </option>
                          <option value="SECONDARY_BUSINESS">
                            {!isWaray
                              ? "Secondary Business"
                              : "Secondary Business"}
                          </option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Others (specify)" : "Iba (ispesipiko)"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("businessOthers")}
                      placeholder={
                        !isWaray
                          ? "Specify other business activities..."
                          : "Ispesipiko an iba nga mga kalihokan ha negosyo..."
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Target Market */}
          {activeStep === 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray ? "Target Market" : "Target nga Merkado"}
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-4 text-sm text-gray-600">
                  {!isWaray
                    ? "Select your target markets and specify details where applicable."
                    : "Pili-a an imo target nga mga merkado ngan ispesipiko an mga detalye kon kinahanglan."}
                </p>

                <div className="space-y-6">
                  {/* Direct to Consumer */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id="direcToConsumer"
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                        {...register("direcToConsumer")}
                      />
                      <label
                        htmlFor="direcToConsumer"
                        className="ml-2 font-medium text-gray-700"
                      >
                        {!isWaray
                          ? "Direct to Consumer"
                          : "Direkta ha Konsumidor"}
                      </label>
                    </div>
                    <div className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id="trader"
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                        {...register("trader")}
                      />
                      <label
                        htmlFor="trader"
                        className="ml-2 font-medium text-gray-700"
                      >
                        {!isWaray ? "Trader" : "Trader"}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray
                          ? "Specific Type 1"
                          : "Espesipiko nga Klase 1"}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("specificType1")}
                        placeholder={
                          !isWaray
                            ? "Specify type..."
                            : "Ispesipiko an klase..."
                        }
                      />
                    </div>
                  </div>

                  {/* Retailer */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id="retailer"
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                        {...register("retailer")}
                      />
                      <label
                        htmlFor="retailer"
                        className="ml-2 font-medium text-gray-700"
                      >
                        {!isWaray ? "Retailer" : "Retailer"}
                      </label>
                    </div>
                    <div className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id="institutionalBuyer"
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                        {...register("institutionalBuyer")}
                      />
                      <label
                        htmlFor="institutionalBuyer"
                        className="ml-2 font-medium text-gray-700"
                      >
                        {!isWaray
                          ? "Institutional Buyer"
                          : "Institutional Buyer"}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray
                          ? "Specific Type 2"
                          : "Espesipiko nga Klase 2"}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("SpecificType2")}
                        placeholder={
                          !isWaray
                            ? "Specify type..."
                            : "Ispesipiko an klase..."
                        }
                      />
                    </div>
                  </div>

                  {/* International */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id="internationalBasedBuyers"
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                        {...register("internationalBasedBuyers")}
                      />
                      <label
                        htmlFor="internationalBasedBuyers"
                        className="ml-2 font-medium text-gray-700"
                      >
                        {!isWaray
                          ? "International Based Buyers"
                          : "Internasyonal nga mga Palalit"}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray
                          ? "Specific Type 3"
                          : "Espesipiko nga Klase 3"}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("SpecificType3")}
                        placeholder={
                          !isWaray
                            ? "Specify type..."
                            : "Ispesipiko an klase..."
                        }
                      />
                    </div>
                  </div>

                  {/* Others */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Others (specify)" : "Iba (ispesipiko)"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("marketOthers")}
                      placeholder={
                        !isWaray
                          ? "Specify other market types..."
                          : "Ispesipiko an iba nga mga klase han merkado..."
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Agricultural Commodities */}
          {activeStep === 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray
                  ? "Agricultural Commodities & Fishery Products"
                  : "Mga Produkto Agrikultural ngan Pangisda"}
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {!isWaray
                      ? "Add the agricultural commodities and fishery products you produce."
                      : "Dugangi an mga produkto agrikultural ngan pangisda nga imo ginproprodyus."}
                  </p>
                  <button
                    type="button"
                    onClick={addCommodity}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    {!isWaray ? "Add Commodity" : "Dugangi hin Produkto"}
                  </button>
                </div>

                <div className="space-y-4">
                  {commodityFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">
                          {!isWaray
                            ? `Commodity ${index + 1}`
                            : `Produkto ${index + 1}`}
                        </h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeCommodity(index)}
                            className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            {!isWaray ? "Remove" : "Kuhaa"}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray
                              ? "Commodity Type*"
                              : "Klase han Produkto*"}
                          </label>
                          <select
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.type` as const,
                            )}
                          >
                            <option value="Grains">
                              {!isWaray ? "Grains" : "Mga Liso"}
                            </option>
                            <option value="LowlandVegetables">
                              {!isWaray
                                ? "Lowland Vegetables"
                                : "Lowland Vegetables"}
                            </option>
                            <option value="UplandVegetables">
                              {!isWaray
                                ? "Upland Vegetables"
                                : "Upland Vegetables"}
                            </option>
                            <option value="FruitsAndNots">
                              {!isWaray
                                ? "Fruits and Nuts"
                                : "Prutas ngan Nuts"}
                            </option>
                            <option value="Mushroom">
                              {!isWaray ? "Mushroom" : "Uhong"}
                            </option>
                            <option value="OrganicSoil">
                              {!isWaray ? "Organic Soil" : "Organic Soil"}
                            </option>
                            <option value="Rootcrops">
                              {!isWaray ? "Root Crops" : "Root Crops"}
                            </option>
                            <option value="PultryProducts">
                              {!isWaray
                                ? "Poultry Products"
                                : "Mga Produkto Manok"}
                            </option>
                            <option value="LiveStockProducts">
                              {!isWaray
                                ? "Livestock Products"
                                : "Mga Produkto Hayupan"}
                            </option>
                            <option value="FisheriesAndAquaCulture">
                              {!isWaray
                                ? "Fisheries and Aquaculture"
                                : "Pangisda ngan Aquaculture"}
                            </option>
                            <option value="IndustrialCropsAndProducts">
                              {!isWaray
                                ? "Industrial Crops and Products"
                                : "Industrial Crops and Products"}
                            </option>
                            <option value="OtherCommodity">
                              {!isWaray
                                ? "Other Commodity"
                                : "Iba nga Produkto"}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Name*" : "Ngaran*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.name` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Commodity name..."
                                : "Ngaran han produkto..."
                            }
                          />

                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.agriculturalCommodities?.[index]?.name
                                ?.message
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Size (in Ha)*" : "Sukol (ha Ha)*"}
                          </label>
                          <input
                            type="number"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.sizeInHa` as const,
                              {
                                valueAsNumber: true,
                              },
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray
                              ? "Annual Volume (in KG)*"
                              : "Taonan nga Volume (ha KG)*"}
                          </label>
                          <input
                            type="number"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.annualVolumeInKG` as const,
                              {
                                valueAsNumber: true,
                              },
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Certification" : "Sertipikasyon"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.certification` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Certification details..."
                                : "Mga detalye han sertipikasyon..."
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {!isWaray
                      ? "Other Commodities (specify)"
                      : "Iba nga mga Produkto (ispesipiko)"}
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows={3}
                    {...register("othersCommodity")}
                    placeholder={
                      !isWaray
                        ? "Specify other commodities not listed above..."
                        : "Ispesipiko an iba nga mga produkto nga waray nakalista ha ibabaw..."
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 7: Facilities & Equipment */}
          {activeStep === 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray
                  ? "Owned/Shared Facilities & Equipment"
                  : "Mga Pasilidad ngan Ekipo nga Tag-iya o Ginhihimoan"}
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {!isWaray
                      ? "Add information about facilities, machinery, and equipment you own or share."
                      : "Dugangi an impormasyon bahin han mga pasilidad, makina, ngan ekipo nga imo tag-iya o ginhihimoan."}
                  </p>
                  <button
                    type="button"
                    onClick={addFacility}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    {!isWaray
                      ? "Add Facility/Equipment"
                      : "Dugangi hin Pasilidad/Ekipo"}
                  </button>
                </div>

                <div className="space-y-4">
                  {facilityFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">
                          {!isWaray
                            ? `Facility/Equipment ${index + 1}`
                            : `Pasilidad/Ekipo ${index + 1}`}
                        </h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeFacility(index)}
                            className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            {!isWaray ? "Remove" : "Kuhaa"}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray
                              ? "Facilities/Machinery/Equipment Used*"
                              : "Mga Pasilidad/Makina/Ekipo nga Gin-gamit*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.facilitiesMachineryEquipmentUsed` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Equipment name..."
                                : "Ngaran han ekipo..."
                            }
                          />
                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.ownSharedFacilities?.[index]
                                ?.facilitiesMachineryEquipmentUsed?.message
                            }
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Ownership*" : "Pagka-tag-iya*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.ownership` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Owned/Shared/Rented..."
                                : "Tag-iya/Ginhihimoan/Ginpaupahan..."
                            }
                          />
                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.ownSharedFacilities?.[index]?.ownership
                                ?.message
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Model*" : "Modelo*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.model` as const,
                            )}
                            placeholder={
                              !isWaray ? "Model/Brand..." : "Modelo/Brand..."
                            }
                          />
                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.ownSharedFacilities?.[index]?.model
                                ?.message
                            }
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Quantity*" : "Gidaghanon*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.quantity` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Number of units..."
                                : "Gidaghanon han mga units..."
                            }
                          />
                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.ownSharedFacilities?.[index]?.quantity
                                ?.message
                            }
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray
                              ? "Volume/Services Area*"
                              : "Volume/Serbisyo nga Area*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.volumeServicesArea` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Service area coverage..."
                                : "Sakop han serbisyo nga area..."
                            }
                          />
                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.ownSharedFacilities?.[index]
                                ?.volumeServicesArea?.message
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray
                              ? "Average Working Hours/Day*"
                              : "Average nga Oras han Pagtrabaho/Adlaw*"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.averageWorkingHoursDay` as const,
                            )}
                            placeholder={
                              !isWaray
                                ? "Hours per day..."
                                : "Oras kada adlaw..."
                            }
                          />
                          <p>
                            <p className="mt-1 text-sm text-red-600">
                              {
                                errors.ownSharedFacilities?.[index]
                                  ?.averageWorkingHoursDay?.message
                              }
                            </p>
                          </p>
                        </div>
                        <div className="flex items-center pt-6">
                          <input
                            type="checkbox"
                            id={`dedicatedToOrganic-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-green-600"
                            {...register(
                              `ownSharedFacilities.${index}.dedicatedToOrganic` as const,
                            )}
                          />
                          <label
                            htmlFor={`dedicatedToOrganic-${index}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {!isWaray
                              ? "Dedicated to Organic Production"
                              : "Dedikado ha Organic Production"}
                          </label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          {!isWaray ? "Remarks" : "Mga Komento"}
                        </label>
                        <textarea
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          rows={3}
                          {...register(
                            `ownSharedFacilities.${index}.Remarks` as const,
                          )}
                          placeholder={
                            !isWaray
                              ? "Additional remarks or notes..."
                              : "Dugang nga mga komento o nota..."
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {activeStep === 8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="border-b pb-2 text-2xl font-bold text-gray-800">
                {!isWaray
                  ? "Account Credentials"
                  : "Mga Kredensyal han Account"}
              </h2>

              {/* Credentials Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  {!isWaray
                    ? "Account Credentials"
                    : "Mga Kredensyal han Account"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Username*" : "Username*"}
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Password*" : "Password*"}
                    </label>
                    <input
                      type="password"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Confirm Password*"
                        : "Ikonpirma an Password*"}
                    </label>
                    <input
                      type="password"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {!isWaray ? "Back" : "Balik"}
                </button>
                <button
                  type="submit"
                  disabled={displayError || signupMutation.isPending}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting || signupMutation.isPending
                    ? !isWaray
                      ? "Submitting..."
                      : "Ginpapadara..."
                    : !isWaray
                      ? "Submit"
                      : "Isumite"}
                </button>
              </div>
              <p className="text-end text-red-400">
                {errors
                  ? "Please review all required fields in the previous steps "
                  : ""}
              </p>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrganicFarmerSignupPage;
