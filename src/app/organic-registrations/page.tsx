"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
        title: "Success!",
        description: "Organic farmer account created successfully",
        variant: "default",
      });
      router.push("/organic-farmer/login");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrganicFarmerSignupForm) => {
    console.log("TEST");
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
        "username",
        "password",
        "confirmPassword",
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
    }

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields correctly",
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
    <div className="relative min-h-screen bg-gray-800 bg-[url('/farmers4.png')] bg-cover bg-center py-8 bg-blend-overlay">
      <div className="mx-auto max-w-[1800px] rounded-lg bg-[#f9f8f8] p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Organic Farmer Registration
        </h1>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
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
                {step < 7 && (
                  <div
                    className={`flex-1 border-t-2 ${activeStep > step ? "border-green-600" : "border-gray-200"}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            {activeStep === 1 && "Personal Information"}
            {activeStep === 2 && "Address Information"}
            {activeStep === 3 && "Certification Details"}
            {activeStep === 4 && "Nature of Business"}
            {activeStep === 5 && "Target Market"}
            {activeStep === 6 && "Agricultural Commodities"}
            {activeStep === 7 && "Facilities & Equipment"}
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
                Personal Information
              </h2>

              {/* Credentials Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  Account Credentials
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Username*
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
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
                      Password*
                    </label>
                    <input
                      type="password"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
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
                      Confirm Password*
                    </label>
                    <input
                      type="password"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-green-500 focus:ring-green-500 ${
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

              {/* Name Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  Name Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Surname*
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
                      First Name*
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
                      Middle Name
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
                      Extension Name
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
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Sex*
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("sex")}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Date of Birth*
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
                      Place of Birth*
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
                      Civil Status*
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("civilStaus")}
                    >
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                      <option value="WIDOWED">Widowed</option>
                      <option value="SEPARATED">Separated</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Highest Form of Education*
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("highestFormOfEducation")}
                    >
                      <option value="NONE">None</option>
                      <option value="ELEMENTARY">Elementary</option>
                      <option value="HIGHSCHOOL">High School</option>
                      <option value="SENIOR_HIGHSCHOOL">
                        Senior High School
                      </option>
                      <option value="COLLEGE">College</option>
                      <option value="POST_GRADUATE">Post Graduate</option>
                      <option value="VOCATIONAL">Vocational</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Religion
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("religion")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email Address
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
                  Family Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Mothers Name
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("mothersName")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Fathers Name
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
                  Government & Emergency Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      4PS Beneficiary
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("FourPS_Benificiaty")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Government ID*
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
                      Person to contact in case of emergency
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                      {...register("personToContactIncaseOfEmerceny")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Emergency contact number*
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
                  Income Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Gross Annual Income (Farming)*
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
                      Gross Annual Income (Non-Farming)*
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
                  Document Upload
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Farmer Image*
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
                  Next
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
              <h2 className="text-xl font-semibold">Address Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    House/Lot/Building No*
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
                    Street/Sitio/Subdivision*
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
                    Barangay*
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
                    Municipality/City*
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
                    Province*
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
                    Region*
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
                  Contact Number*
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Next
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
              <h2 className="text-xl font-semibold">Certification Details</h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600"
                      {...register("withOrganicAgricultureCertification")}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Do you have Organic Agriculture Certification?
                    </span>
                  </label>
                </div>

                {withCertification && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Certification Type
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("certification")}
                    >
                      <option value="">Select certification type</option>
                      <option value="THIRD_PARTY_CERTIFICATION">
                        Third Party Certification
                      </option>
                      <option value="PARTICIPATORY_GUARANTEE_SYSTEM">
                        Participatory Guarantee System
                      </option>
                    </select>
                  </div>
                )}

                {!withCertification && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      What stages are you in for certification?
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      rows={3}
                      {...register("whatStagesInCertification")}
                      placeholder="Describe your current certification stage..."
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Next
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
              <h2 className="text-xl font-semibold">Nature of Business</h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-4 text-sm text-gray-600">
                  Select the nature of your business activities and specify if
                  they are primary or secondary business.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: "productionForInputs",
                      label: "Production for Inputs",
                    },
                    { key: "productionForFood", label: "Production for Food" },
                    {
                      key: "postHarvestAndProcessing",
                      label: "Post Harvest and Processing",
                    },
                    {
                      key: "tradingAndWholeSale",
                      label: "Trading and Wholesale",
                    },
                    { key: "retailing", label: "Retailing" },
                    {
                      key: "transPortAndLogistics",
                      label: "Transport and Logistics",
                    },
                    { key: "WareHousing", label: "Warehousing" },
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
                          <option value="NOT_APPLICABLE">Not applicable</option>
                          <option value="PRIMARY_BUSINESS">
                            Primary Business
                          </option>
                          <option value="SECONDARY_BUSINESS">
                            Secondary Business
                          </option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Others (specify)
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("businessOthers")}
                      placeholder="Specify other business activities..."
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Next
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
              <h2 className="text-xl font-semibold">Target Market</h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-4 text-sm text-gray-600">
                  Select your target markets and specify details where
                  applicable.
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
                        Direct to Consumer
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
                        Trader
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Specific Type 1
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("specificType1")}
                        placeholder="Specify type..."
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
                        Retailer
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
                        Institutional Buyer
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Specific Type 2
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("SpecificType2")}
                        placeholder="Specify type..."
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
                        International Based Buyers
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Specific Type 3
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("SpecificType3")}
                        placeholder="Specify type..."
                      />
                    </div>
                  </div>

                  {/* Others */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Others (specify)
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("marketOthers")}
                      placeholder="Specify other market types..."
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Next
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
                Agricultural Commodities & Fishery Products
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Add the agricultural commodities and fishery products you
                    produce.
                  </p>
                  <button
                    type="button"
                    onClick={addCommodity}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    Add Commodity
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
                          Commodity {index + 1}
                        </h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeCommodity(index)}
                            className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Commodity Type*
                          </label>
                          <select
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.type` as const,
                            )}
                          >
                            <option value="Grains">Grains</option>
                            <option value="LowlandVegetables">
                              Lowland Vegetables
                            </option>
                            <option value="UplandVegetables">
                              Upland Vegetables
                            </option>
                            <option value="FruitsAndNots">
                              Fruits and Nuts
                            </option>
                            <option value="Mushroom">Mushroom</option>
                            <option value="OrganicSoil">Organic Soil</option>
                            <option value="Rootcrops">Root Crops</option>
                            <option value="PultryProducts">
                              Poultry Products
                            </option>
                            <option value="LiveStockProducts">
                              Livestock Products
                            </option>
                            <option value="FisheriesAndAquaCulture">
                              Fisheries and Aquaculture
                            </option>
                            <option value="IndustrialCropsAndProducts">
                              Industrial Crops and Products
                            </option>
                            <option value="OtherCommodity">
                              Other Commodity
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.name` as const,
                            )}
                            placeholder="Commodity name..."
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Size (in Ha)*
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
                            Annual Volume (in KG)*
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
                            Certification
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `agriculturalCommodities.${index}.certification` as const,
                            )}
                            placeholder="Certification details..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Other Commodities (specify)
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows={3}
                    {...register("othersCommodity")}
                    placeholder="Specify other commodities not listed above..."
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Next
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
                Owned/Shared Facilities & Equipment
              </h2>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Add information about facilities, machinery, and equipment
                    you own or share.
                  </p>
                  <button
                    type="button"
                    onClick={addFacility}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    Add Facility/Equipment
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
                          Facility/Equipment {index + 1}
                        </h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeFacility(index)}
                            className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Facilities/Machinery/Equipment Used*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.facilitiesMachineryEquipmentUsed` as const,
                            )}
                            placeholder="Equipment name..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ownership*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.ownership` as const,
                            )}
                            placeholder="Owned/Shared/Rented..."
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Model*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.model` as const,
                            )}
                            placeholder="Model/Brand..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.quantity` as const,
                            )}
                            placeholder="Number of units..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Volume/Services Area*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.volumeServicesArea` as const,
                            )}
                            placeholder="Service area coverage..."
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Average Working Hours/Day*
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `ownSharedFacilities.${index}.averageWorkingHoursDay` as const,
                            )}
                            placeholder="Hours per day..."
                          />
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
                            Dedicated to Organic Production
                          </label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Remarks
                        </label>
                        <textarea
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          rows={3}
                          {...register(
                            `ownSharedFacilities.${index}.Remarks` as const,
                          )}
                          placeholder="Additional remarks or notes..."
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
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || signupMutation.isPending}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting || signupMutation.isPending
                    ? "Submitting..."
                    : "Submit Registration"}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrganicFarmerSignupPage;
