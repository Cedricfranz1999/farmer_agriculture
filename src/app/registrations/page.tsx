"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

// Define form schema that matches your exact Prisma schema

const signupSchema = z
  .object({
    // Basic info
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
    nameOfSpouse: z.string().optional(),
    FourPS_Benificiaty: z.string().optional(),
    mothersName: z.string().optional(),
    fathersName: z.string().optional(),
    govermentIdType: z.string().optional(),

    govermentId: z.string(),
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
    categoryType: z.enum(["FARMER", "FARMWORKER", "FISHERFOLK", "AGRI_YOUTH"]),

    // Farmer details
    rice: z.boolean().optional(),
    corn: z.boolean().optional(),
    othersCrops: z.string().optional(),
    livestock: z.boolean().optional(),
    livestockDetails: z.string().optional(),
    poultry: z.boolean().optional(),
    poultryDetails: z.string().optional(),

    // Farm worker details
    landPreparation: z.boolean().optional(),
    plantingTransplanting: z.boolean().optional(),
    cultivation: z.boolean().optional(),
    harvesting: z.boolean().optional(),
    farmWorkerOthers: z.string().optional(),

    // Fisherfolk details
    fishCapture: z.boolean().optional(),
    aquaculture: z.boolean().optional(),
    gleaning: z.boolean().optional(),
    fishProcessing: z.boolean().optional(),
    fishVending: z.boolean().optional(),
    fisherfolkOthers: z.string().optional(),

    // Agri youth details
    partOfFarmingHouseHold: z.boolean().optional(),
    attendedFormalAgriFishery: z.boolean().optional(),
    attendedNonFormalAgriFishery: z.boolean().optional(),
    participatedInAnyAgriculturalActivity: z.boolean().optional(),
    agriYouthFishVending: z.boolean().optional(),
    agriYouthOthers: z.string().optional(),

    // House head details
    houseHoldHead: z.string().min(1, "House hold must be requird"),

    relationship: z.string().optional(),
    numberOfLivingHouseHoldMembersTotal: z.number().optional(),
    numberOfMale: z.number().optional(),
    NumberOfFemale: z.number().optional(),

    // Farm details - Updated to match exact schema
    farmDetails: z
      .array(
        z.object({
          Location: z.string().min(1, "Location is required"),
          TotalFarmAreaInHa: z.number().min(0, "Area must be at least 0"),
          withAncestordomain: z.boolean().optional(),
          agrarianReform: z.boolean().optional(),
          OwnerDocumentsNumber: z
            .string()
            .min(1, "Owner documents number is required"),

          // Owner type - only one should be true
          RegisterOwner: z.boolean().optional(),
          ownerName: z.string().optional(),
          tenantOwner: z.boolean().optional(),
          teenantName: z.string().optional(),
          Leese: z.boolean().optional(),
          leeseName: z.string().optional(),
          others: z.string().optional(),
          othersField: z.string().optional(),

          // Lot details (for farmers only) - Note: sizeInHa is Int in schema
          lotDetails: z
            .object({
              cropsORCommodity: z.string().optional(),
              sizeInHa: z.number().int().min(0, "Size must be at least 0"),
              numberOfHeadForLivestockAndPoultry: z
                .number()
                .int()
                .min(0, "Number must be at least 0"),
              FarmType: z.string().optional(),
              organicPractitioner: z.boolean(),
            })
            .optional(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.categoryType === "FARMER") {
        return (
          data.rice ||
          data.corn ||
          data.livestock ||
          data.poultry ||
          (data.othersCrops && data.othersCrops.trim() !== "")
        );
      }
      if (data.categoryType === "FARMWORKER") {
        return (
          data.landPreparation ||
          data.plantingTransplanting ||
          data.cultivation ||
          data.harvesting ||
          (data.farmWorkerOthers && data.farmWorkerOthers.trim() !== "")
        );
      }
      if (data.categoryType === "FISHERFOLK") {
        return (
          data.fishCapture ||
          data.aquaculture ||
          data.gleaning ||
          data.fishProcessing ||
          data.fishVending ||
          (data.fisherfolkOthers && data.fisherfolkOthers.trim() !== "")
        );
      }
      if (data.categoryType === "AGRI_YOUTH") {
        return (
          data.partOfFarmingHouseHold ||
          data.attendedFormalAgriFishery ||
          data.attendedNonFormalAgriFishery ||
          data.participatedInAnyAgriculturalActivity ||
          data.agriYouthFishVending ||
          (data.agriYouthOthers && data.agriYouthOthers.trim() !== "")
        );
      }
      return true;
    },
    {
      message: "At least one activity must be selected for your category",
      path: ["categoryType"],
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

const FarmerSignupPage = () => {
  const [isWaray, setIsWaray] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    control,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      categoryType: "FARMER",
      civilStaus: "SINGLE",
      sex: "MALE",
      highestFormOfEducation: "NONE",
      grossAnualIncomeLastYearFarming: 0,
      grossAnualIncomeLastYeaNonFarming: 0,
      farmDetails: [
        {
          Location: "",
          TotalFarmAreaInHa: 0,
          OwnerDocumentsNumber: "",
          ownerName: "",
          withAncestordomain: false,
          agrarianReform: false,
          RegisterOwner: false,
          tenantOwner: false,
          Leese: false,
          lotDetails: {
            cropsORCommodity: "",
            sizeInHa: 0,
            numberOfHeadForLivestockAndPoultry: 0,
            FarmType: "",
            organicPractitioner: false,
          },
        },
      ],
    },
    mode: "onChange",
  });

  console.log("ERRORS", errors);
  const { toast } = useToast();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [farmCount, setFarmCount] = useState(1);
  const categoryType = watch("categoryType");

  console.log("OWSHIE ", errors);
  const farmDetails = useWatch({
    control,
    name: "farmDetails",
    defaultValue: [
      {
        Location: "",
        TotalFarmAreaInHa: 0,
        OwnerDocumentsNumber: "",
        ownerName: "",
        withAncestordomain: false,
        agrarianReform: false,
        RegisterOwner: false,
        tenantOwner: false,
        Leese: false,
        lotDetails: {
          cropsORCommodity: "",
          sizeInHa: 0,
          numberOfHeadForLivestockAndPoultry: 0,
          FarmType: "",
          organicPractitioner: false,
        },
      },
    ],
  });

  // Reset category-specific fields when category changes
  useEffect(() => {
    if (categoryType === "FARMER") {
      setValue("landPreparation", undefined);
      setValue("plantingTransplanting", undefined);
      setValue("cultivation", undefined);
      setValue("harvesting", undefined);
      setValue("farmWorkerOthers", undefined);
      setValue("fishCapture", undefined);
      setValue("aquaculture", undefined);
      setValue("gleaning", undefined);
      setValue("fishProcessing", undefined);
      setValue("fishVending", undefined);
      setValue("fisherfolkOthers", undefined);
      setValue("partOfFarmingHouseHold", undefined);
      setValue("attendedFormalAgriFishery", undefined);
      setValue("attendedNonFormalAgriFishery", undefined);
      setValue("participatedInAnyAgriculturalActivity", undefined);
      setValue("agriYouthFishVending", undefined);
      setValue("agriYouthOthers", undefined);
    } else if (categoryType === "FARMWORKER") {
      setValue("rice", undefined);
      setValue("corn", undefined);
      setValue("othersCrops", undefined);
      setValue("livestock", undefined);
      setValue("livestockDetails", undefined);
      setValue("poultry", undefined);
      setValue("poultryDetails", undefined);
      setValue("fishCapture", undefined);
      setValue("aquaculture", undefined);
      setValue("gleaning", undefined);
      setValue("fishProcessing", undefined);
      setValue("fishVending", undefined);
      setValue("fisherfolkOthers", undefined);
      setValue("partOfFarmingHouseHold", undefined);
      setValue("attendedFormalAgriFishery", undefined);
      setValue("attendedNonFormalAgriFishery", undefined);
      setValue("participatedInAnyAgriculturalActivity", undefined);
      setValue("agriYouthFishVending", undefined);
      setValue("agriYouthOthers", undefined);
    } else if (categoryType === "FISHERFOLK") {
      setValue("rice", undefined);
      setValue("corn", undefined);
      setValue("othersCrops", undefined);
      setValue("livestock", undefined);
      setValue("livestockDetails", undefined);
      setValue("poultry", undefined);
      setValue("poultryDetails", undefined);
      setValue("landPreparation", undefined);
      setValue("plantingTransplanting", undefined);
      setValue("cultivation", undefined);
      setValue("harvesting", undefined);
      setValue("farmWorkerOthers", undefined);
      setValue("partOfFarmingHouseHold", undefined);
      setValue("attendedFormalAgriFishery", undefined);
      setValue("attendedNonFormalAgriFishery", undefined);
      setValue("participatedInAnyAgriculturalActivity", undefined);
      setValue("agriYouthFishVending", undefined);
      setValue("agriYouthOthers", undefined);
    } else if (categoryType === "AGRI_YOUTH") {
      setValue("rice", undefined);
      setValue("corn", undefined);
      setValue("othersCrops", undefined);
      setValue("livestock", undefined);
      setValue("livestockDetails", undefined);
      setValue("poultry", undefined);
      setValue("poultryDetails", undefined);
      setValue("landPreparation", undefined);
      setValue("plantingTransplanting", undefined);
      setValue("cultivation", undefined);
      setValue("harvesting", undefined);
      setValue("farmWorkerOthers", undefined);
      setValue("fishCapture", undefined);
      setValue("aquaculture", undefined);
      setValue("gleaning", undefined);
      setValue("fishProcessing", undefined);
      setValue("fishVending", undefined);
      setValue("fisherfolkOthers", undefined);
    }
  }, [categoryType, setValue]);

  const signupMutation = api.auth.signup.useMutation({
    onSuccess: () => {
      toast({
        title: isWaray ? "Malinamposan!" : "Success!",
        description: isWaray
          ? "Account nga malinamposan nga ginhimo"
          : "Account created successfully",
        variant: "default",
      });
      router.push("/registrations/info");
    },
    onError: (error) => {
      toast({
        title: isWaray ? "Sayop" : "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    // Prepare the data for the API call according to your exact schema
    const submitData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      farmerDetails:
        data.categoryType === "FARMER"
          ? {
              rice: data.rice || false,
              corn: data.corn || false,
              othersCrops: data.othersCrops,
              livestock: data.livestock || false,
              livestockDetails: data.livestockDetails,
              poultry: data.poultry || false,
              poultryDetails: data.poultryDetails,
            }
          : undefined,
      farmworkerDetails:
        data.categoryType === "FARMWORKER"
          ? {
              landPreparation: data.landPreparation || false,
              plantingTransplanting: data.plantingTransplanting || false,
              cultivation: data.cultivation || false,
              harvesting: data.harvesting || false,
              others: data.farmWorkerOthers,
            }
          : undefined,
      fisherfolkDetails:
        data.categoryType === "FISHERFOLK"
          ? {
              fishCapture: data.fishCapture || false,
              aquaculture: data.aquaculture || false,
              gleaning: data.gleaning || false,
              fishProcessing: data.fishProcessing || false,
              fishVending: data.fishVending || false,
              others: data.fisherfolkOthers,
            }
          : undefined,
      agriYouthDetails:
        data.categoryType === "AGRI_YOUTH"
          ? {
              partOfFarmingHouseHold: data.partOfFarmingHouseHold || false,
              attendedFormalAgriFishery:
                data.attendedFormalAgriFishery || false,
              attendedNonFormalAgriFishery:
                data.attendedNonFormalAgriFishery || false,
              participatedInAnyAgriculturalActivity:
                data.participatedInAnyAgriculturalActivity || false,
              fishVending: data.agriYouthFishVending || false,
              others: data.agriYouthOthers,
            }
          : undefined,
      houseHead: data.houseHoldHead
        ? {
            houseHoldHead: data.houseHoldHead,
            relationship: data.relationship || "",
            numberOfLivingHouseHoldMembersTotal:
              data.numberOfLivingHouseHoldMembersTotal || 0,
            numberOfMale: data.numberOfMale || 0,
            NumberOfFemale: data.NumberOfFemale || 0,
          }
        : undefined,
      farmDetails: data.farmDetails || [],
      numberOfFarms: data.farmDetails?.length || 0,
    };

    signupMutation.mutate(submitData);
  };

  const nextStep = async () => {
    let isValid = false;

    if (activeStep === 1) {
      // Remove username/password validation from step 1
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
        "personToContactIncaseOfEmerceny",
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
      if (categoryType === "FARMER") {
        isValid = await trigger([
          "categoryType",
          "rice",
          "corn",
          "livestock",
          "poultry",
        ]);
      } else if (categoryType === "FARMWORKER") {
        isValid = await trigger([
          "categoryType",
          "landPreparation",
          "plantingTransplanting",
          "cultivation",
          "harvesting",
        ]);
      } else if (categoryType === "FISHERFOLK") {
        isValid = await trigger([
          "categoryType",
          "fishCapture",
          "aquaculture",
          "gleaning",
          "fishProcessing",
          "fishVending",
        ]);
      } else if (categoryType === "AGRI_YOUTH") {
        isValid = await trigger([
          "categoryType",
          "partOfFarmingHouseHold",
          "attendedFormalAgriFishery",
          "attendedNonFormalAgriFishery",
          "participatedInAnyAgriculturalActivity",
          "agriYouthFishVending",
        ]);
      }
    } else if (activeStep === 4) {
      // Add validation for step 4 if needed
      isValid = true; // Or add specific validation for household/farm details
    } else if (activeStep === 5) {
      // Validate credentials in step 5
      isValid = await trigger(["username", "password", "confirmPassword"]);
    }

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

  const addFarm = () => {
    setFarmCount(farmCount + 1);
    setValue("farmDetails", [
      ...(farmDetails || []),
      {
        Location: "",
        TotalFarmAreaInHa: 0,
        OwnerDocumentsNumber: "",
        ownerName: "",
        withAncestordomain: false,
        agrarianReform: false,
        RegisterOwner: false,
        tenantOwner: false,
        Leese: false,
        lotDetails:
          categoryType === "FARMER"
            ? {
                cropsORCommodity: "",
                sizeInHa: 0,
                numberOfHeadForLivestockAndPoultry: 0,
                FarmType: "",
                organicPractitioner: false,
              }
            : undefined,
      },
    ]);
  };

  const removeFarm = (index: number) => {
    if (farmCount > 1) {
      setFarmCount(farmCount - 1);
      const newFarms = [...(farmDetails || [])];
      newFarms.splice(index, 1);
      setValue("farmDetails", newFarms);
    }
  };

  const handleOwnerTypeChange = (farmIndex: number, ownerType: string) => {
    // Reset all owner type fields for this farm
    setValue(`farmDetails.${farmIndex}.RegisterOwner`, false);
    setValue(`farmDetails.${farmIndex}.tenantOwner`, false);
    setValue(`farmDetails.${farmIndex}.Leese`, false);

    // Set the selected owner type
    setValue(`farmDetails.${farmIndex}.${ownerType}` as any, true);
  };

  return (
    <div
      className="relative min-h-screen bg-gray-700 bg-[url('/background.png')] bg-center py-8"
      style={{ backgroundSize: "150%" }} // zoom in
    >
      {" "}
      <div className="mx-auto max-w-[2000px] rounded-lg bg-[#f9f8f8] shadow-md lg:px-32 lg:py-10">
        <div className="relative mb-6 flex items-center justify-between">
          <a
            href="/sign-in"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isWaray ? "Back to login" : "Balik ha Pag-login"}
          </a>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-gray-800">
            {!isWaray ? "Farmer Registration" : "Pagrehistro han Parauma"}
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
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    activeStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 border-t-2 ${activeStep > step ? "border-blue-600" : "border-gray-200"}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
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
                <h3 className="mb-4 text-lg font-medium text-gray-700"></h3>
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
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register("religion")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Email Address" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      {!isWaray
                        ? "Name of Spouse (if married)"
                        : "Ngaran han Asawa (kon minyo)"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register("nameOfSpouse")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Mothers Name" : "Ngaran han Iroy"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register("mothersName")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Fathers Name" : "Ngaran han Amay"}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register("fathersName")}
                    />
                  </div>

                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {!isWaray ? "4Ps Beneficiary" : "Api sa 4Ps"}
                </label>
                <select
                  className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...register("FourPS_Benificiaty")}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
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
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {!isWaray
                      ? "Government ID (Image)*"
                      : "Government ID (Litrato)*"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.govermentId ? "border-red-500" : "border-gray-300"
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
                    required
                  />
                  {errors.govermentId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.govermentId.message}
                    </p>
                  )}
                </div>

                  <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 mt-3">
                    {!isWaray ? "Government ID Type" : "Gobyerno ID"}
                  </label>
                  <select
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    {...register("govermentIdType")}
                  >
                    <option value="">Select ID Type</option>
                    <option value="Philippine Passport">Philippine Passport</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="UMID">UMID</option>
                    <option value="PhilHealth ID">PhilHealth ID</option>
                    <option value="SSS ID">SSS ID</option>
                    <option value="GSIS ID">GSIS ID</option>
                    <option value="Postal ID">Postal ID</option>
                    <option value="Voter's ID">Voter's ID</option>
                    <option value="TIN ID">TIN ID</option>
                    <option value="PRC ID">PRC ID</option>
                    <option value="Senior Citizen ID">Senior Citizen ID</option>
                    <option value="PWD ID">PWD ID</option>
                    <option value="Philippine National ID (PhilSys)">Philippine National ID (PhilSys)</option>
                    <option value="NBI Clearance">NBI Clearance</option>
                    <option value="Police Clearance">Police Clearance</option>
                    <option value="Barangay ID">Barangay ID</option>
                  </select>
                </div>


                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {!isWaray
                      ? "Person To Contact In Case Of Emergency"
                      : "Tao nga Kontakon Kon May Emergensya"}
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    {...register("personToContactIncaseOfEmerceny")}
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {!isWaray
                      ? "Person Contact Number In Case Of Emergency"
                      : "Numero han Kontak Kon May Emergensya"}
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    {...register("personContactNumberIncaseOfEmergency")}
                  />
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
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                  {!isWaray ? "Document Upload" : "Pag-upload han Dokumento"}
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {!isWaray ? "Farmer Image*" : "Litrato han Parauma*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
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
                  className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
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
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Category and Details */}
          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray
                  ? "Category and Details"
                  : "Kategorya ngan mga Detalye"}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {!isWaray ? "Category Type*" : "Klase han Kategorya*"}
                </label>
                <select
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.categoryType ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("categoryType")}
                >
                  <option value="FARMER">
                    {!isWaray ? "Farmer" : "Parauma"}
                  </option>
                  <option value="FARMWORKER">
                    {!isWaray ? "Farm Worker" : "Parag-uma"}
                  </option>
                  <option value="FISHERFOLK">
                    {!isWaray ? "Fisherfolk" : "Mangingisda"}
                  </option>
                  <option value="AGRI_YOUTH">
                    {!isWaray ? "Agri Youth" : "Agri Youth"}
                  </option>
                </select>
                {errors.categoryType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoryType.message}
                  </p>
                )}
              </div>

              {/* Farmer Details */}
              {categoryType === "FARMER" && (
                <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium">
                    {!isWaray ? "Farmer Details" : "Mga Detalye han Parauma"}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rice"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("rice")}
                      />
                      <label
                        htmlFor="rice"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Rice" : "Paray"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="corn"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("corn")}
                      />
                      <label
                        htmlFor="corn"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Corn" : "Mais"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Other Crops" : "Iba nga mga Tanom"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("othersCrops")}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="livestock"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("livestock")}
                      />
                      <label
                        htmlFor="livestock"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Livestock" : "Hayupan"}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray
                          ? "Livestock Details"
                          : "Mga Detalye han Hayupan"}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("livestockDetails")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="poultry"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("poultry")}
                      />
                      <label
                        htmlFor="poultry"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Poultry" : "Manok"}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray ? "Poultry Details" : "Mga Detalye han Manok"}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        {...register("poultryDetails")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Farm Worker Details */}
              {categoryType === "FARMWORKER" && (
                <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium">
                    {!isWaray
                      ? "Farm Worker Details"
                      : "Mga Detalye han Parag-uma"}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="landPreparation"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("landPreparation")}
                      />
                      <label
                        htmlFor="landPreparation"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Land Preparation" : "Pagpreparar han Duta"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="plantingTransplanting"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("plantingTransplanting")}
                      />
                      <label
                        htmlFor="plantingTransplanting"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray
                          ? "Planting/Transplanting"
                          : "Pagtanom/Pagtransplant"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cultivation"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("cultivation")}
                      />
                      <label
                        htmlFor="cultivation"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Cultivation" : "Pag-uma"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="harvesting"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("harvesting")}
                      />
                      <label
                        htmlFor="harvesting"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Harvesting" : "Pag-ani"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Other Activities" : "Iba nga mga Kalihokan"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("farmWorkerOthers")}
                    />
                  </div>
                </div>
              )}

              {/* Fisherfolk Details */}
              {categoryType === "FISHERFOLK" && (
                <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium">
                    {!isWaray
                      ? "Fisherfolk Details"
                      : "Mga Detalye han Mangingisda"}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fishCapture"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("fishCapture")}
                      />
                      <label
                        htmlFor="fishCapture"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Fish Capture" : "Pangisda"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="aquaculture"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("aquaculture")}
                      />
                      <label
                        htmlFor="aquaculture"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Aquaculture" : "Aquaculture"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="gleaning"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("gleaning")}
                      />
                      <label
                        htmlFor="gleaning"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Gleaning" : "Gleaning"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fishProcessing"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("fishProcessing")}
                      />
                      <label
                        htmlFor="fishProcessing"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Fish Processing" : "Pagproseso han Isda"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fishVending"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("fishVending")}
                      />
                      <label
                        htmlFor="fishVending"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Fish Vending" : "Pagbaligya han Isda"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Other Activities" : "Iba nga mga Kalihokan"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("fisherfolkOthers")}
                    />
                  </div>
                </div>
              )}

              {/* Agri Youth Details */}
              {categoryType === "AGRI_YOUTH" && (
                <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium">
                    {!isWaray
                      ? "Agri Youth Details"
                      : "Mga Detalye han Agri Youth"}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="partOfFarmingHouseHold"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("partOfFarmingHouseHold")}
                      />
                      <label
                        htmlFor="partOfFarmingHouseHold"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray
                          ? "Part of Farming Household"
                          : "Kabahin han Pamilya nga Parauma"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="attendedFormalAgriFishery"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("attendedFormalAgriFishery")}
                      />
                      <label
                        htmlFor="attendedFormalAgriFishery"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray
                          ? "Attended Formal Agri-Fishery Training"
                          : "Nakarawat han Pormal nga Paghanas ha Agri-Fishery"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="attendedNonFormalAgriFishery"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("attendedNonFormalAgriFishery")}
                      />
                      <label
                        htmlFor="attendedNonFormalAgriFishery"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray
                          ? "Attended Non-Formal Agri-Fishery Training"
                          : "Nakarawat han Diri Pormal nga Paghanas ha Agri-Fishery"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="participatedInAnyAgriculturalActivity"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("participatedInAnyAgriculturalActivity")}
                      />
                      <label
                        htmlFor="participatedInAnyAgriculturalActivity"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray
                          ? "Participated in Any Agricultural Activity"
                          : "Nakikibahin ha Bisán Anu nga Kalihokan Agrikultural"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="agriYouthFishVending"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register("agriYouthFishVending")}
                      />
                      <label
                        htmlFor="agriYouthFishVending"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {!isWaray ? "Fish Vending" : "Pagbaligya han Isda"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Other Activities" : "Iba nga mga Kalihokan"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("agriYouthOthers")}
                    />
                  </div>
                </div>
              )}

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
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {!isWaray ? "Next" : "Sunod"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Household and Farm Details */}
          {activeStep === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {!isWaray
                  ? "Household and Farm Details"
                  : "Mga Detalye han Panimalay ngan Uma"}
              </h2>

              {/* Household Head Information */}
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium">
                  {!isWaray
                    ? "Household Head Information"
                    : "Impormasyon han Ulo han Panimalay"}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Household Head Name"
                        : "Ngaran han Ulo han Panimalay"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("houseHoldHead")}
                    />
                    {errors.houseHoldHead && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.houseHoldHead?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Relationship to Household Head"
                        : "Relasyon ha Ulo han Panimalay"}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("relationship")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray
                        ? "Total Household Members"
                        : "Total nga Miyembro han Panimalay"}
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("numberOfLivingHouseHoldMembersTotal", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.numberOfLivingHouseHoldMembersTotal && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.numberOfLivingHouseHoldMembersTotal?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Number of Male" : "Gidaghanon han Lalaki"}
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("numberOfMale", { valueAsNumber: true })}
                    />
                    {errors.numberOfMale && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.numberOfMale?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {!isWaray ? "Number of Female" : "Gidaghanon han Babaye"}
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      {...register("NumberOfFemale", { valueAsNumber: true })}
                    />
                    {errors.NumberOfFemale && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.NumberOfFemale?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium">
                  {!isWaray ? "Farm Details" : "Mga Detalye han Uma"}
                </h3>
                {farmDetails?.map((farm, index) => (
                  <div
                    key={index}
                    className="mb-6 space-y-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium">
                        {!isWaray ? `Farm ${index + 1}` : `Uma ${index + 1}`}
                      </h4>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFarm(index)}
                          className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        >
                          {!isWaray ? "Remove" : "Kuhaa"}
                        </button>
                      )}
                    </div>

                    {/* Basic Farm Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {!isWaray ? "Farm Location*" : "Lugar han Uma*"}
                        </label>
                        <input
                          type="text"
                          className={`mt-1 block w-full rounded-md border p-2 ${
                            errors.farmDetails?.[index]?.Location
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...register(
                            `farmDetails.${index}.Location` as const,
                          )}
                        />
                        {errors.farmDetails?.[index]?.Location && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.farmDetails[index]?.Location?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {!isWaray
                            ? "Total Farm Area (in Ha)*"
                            : "Total nga Area han Uma (ha Ha)*"}
                        </label>
                        <input
                          type="number"
                          className={`mt-1 block w-full rounded-md border p-2 ${
                            errors.farmDetails?.[index]?.TotalFarmAreaInHa
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...register(
                            `farmDetails.${index}.TotalFarmAreaInHa` as const,
                            {
                              valueAsNumber: true,
                            },
                          )}
                        />
                        {errors.farmDetails?.[index]?.TotalFarmAreaInHa && (
                          <p className="mt-1 text-sm text-red-600">
                            {
                              errors.farmDetails[index]?.TotalFarmAreaInHa
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Land Classification */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray ? "Land Classification" : "Klase han Duta"}
                      </label>
                      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`withAncestordomain-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            {...register(
                              `farmDetails.${index}.withAncestordomain` as const,
                            )}
                          />
                          <label
                            htmlFor={`withAncestordomain-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray
                              ? "With Ancestor Domain"
                              : "May Ancestor Domain"}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`agrarianReform-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            {...register(
                              `farmDetails.${index}.agrarianReform` as const,
                            )}
                          />
                          <label
                            htmlFor={`agrarianReform-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray ? "Agrarian Reform" : "Agrarian Reform"}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Owner Documents */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {!isWaray
                          ? "Owner Documents Number*"
                          : "Numero han Dokumento han Tag-iya*"}
                      </label>
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border p-2 ${
                          errors.farmDetails?.[index]?.OwnerDocumentsNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        {...register(
                          `farmDetails.${index}.OwnerDocumentsNumber` as const,
                        )}
                      />
                      {errors.farmDetails?.[index]?.OwnerDocumentsNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            errors.farmDetails[index]?.OwnerDocumentsNumber
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Owner Type Selection */}
                    <div className="mt-4 rounded-lg border border-gray-200 p-4">
                      <h4 className="mb-3 text-sm font-medium text-gray-700">
                        {!isWaray
                          ? "Owner Type (Select one)*"
                          : "Klase han Tag-iya (Pili hin usa)*"}
                      </h4>
                      <div className="space-y-4">
                        {/* Registered Owner */}
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`registerOwner-${index}`}
                            name={`ownerType-${index}`}
                            className="h-4 w-4 text-blue-600"
                            onChange={() =>
                              handleOwnerTypeChange(index, "RegisterOwner")
                            }
                            checked={watch(
                              `farmDetails.${index}.RegisterOwner`,
                            )}
                          />
                          <label
                            htmlFor={`registerOwner-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray
                              ? "Registered Owner"
                              : "Rehistradong Tag-iya"}
                          </label>
                        </div>
                        {watch(`farmDetails.${index}.RegisterOwner`) && (
                          <div className="ml-6">
                            <label className="block text-sm font-medium text-gray-700">
                              {!isWaray ? "Owner Name*" : "Ngaran han Tag-iya*"}
                            </label>
                            <input
                              type="text"
                              className={`mt-1 block w-full rounded-md border p-2 ${
                                errors.farmDetails?.[index]?.ownerName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              {...register(
                                `farmDetails.${index}.ownerName` as const,
                              )}
                            />
                            {errors.farmDetails?.[index]?.ownerName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.farmDetails[index]?.ownerName?.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Tenant Owner */}
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`tenantOwner-${index}`}
                            name={`ownerType-${index}`}
                            className="h-4 w-4 text-blue-600"
                            onChange={() =>
                              handleOwnerTypeChange(index, "tenantOwner")
                            }
                            checked={watch(`farmDetails.${index}.tenantOwner`)}
                          />
                          <label
                            htmlFor={`tenantOwner-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray
                              ? "Tenant Owner"
                              : "Tag-iya nga Nagpapaupa"}
                          </label>
                        </div>
                        {watch(`farmDetails.${index}.tenantOwner`) && (
                          <div className="ml-6">
                            <label className="block text-sm font-medium text-gray-700">
                              {!isWaray
                                ? "Tenant Name*"
                                : "Ngaran han Nagpapaupa*"}
                            </label>
                            <input
                              type="text"
                              className={`mt-1 block w-full rounded-md border p-2 ${
                                errors.farmDetails?.[index]?.teenantName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              {...register(
                                `farmDetails.${index}.teenantName` as const,
                              )}
                            />
                            {errors.farmDetails?.[index]?.teenantName && (
                              <p className="mt-1 text-sm text-red-600">
                                {
                                  errors.farmDetails[index]?.teenantName
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        )}

                        {/* Lease */}
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`lease-${index}`}
                            name={`ownerType-${index}`}
                            className="h-4 w-4 text-blue-600"
                            onChange={() =>
                              handleOwnerTypeChange(index, "Leese")
                            }
                            checked={watch(`farmDetails.${index}.Leese`)}
                          />
                          <label
                            htmlFor={`lease-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray ? "Lease" : "Lease"}
                          </label>
                        </div>
                        {watch(`farmDetails.${index}.Leese`) && (
                          <div className="ml-6">
                            <label className="block text-sm font-medium text-gray-700">
                              {!isWaray ? "Lease Name*" : "Ngaran han Lease*"}
                            </label>
                            <input
                              type="text"
                              className={`mt-1 block w-full rounded-md border p-2 ${
                                errors.farmDetails?.[index]?.leeseName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              {...register(
                                `farmDetails.${index}.leeseName` as const,
                              )}
                            />
                            {errors.farmDetails?.[index]?.leeseName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.farmDetails[index]?.leeseName?.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Others */}
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`others-${index}`}
                            name={`ownerType-${index}`}
                            className="h-4 w-4 text-blue-600"
                            onChange={() => {
                              handleOwnerTypeChange(index, "RegisterOwner");
                              setValue(
                                `farmDetails.${index}.RegisterOwner`,
                                false,
                              );
                            }}
                          />
                          <label
                            htmlFor={`others-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray ? "Others" : "Iba"}
                          </label>
                        </div>
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Other Details" : "Iba nga mga Detalye"}
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            {...register(
                              `farmDetails.${index}.othersField` as const,
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lot Details (for Farmers only) */}
                    {categoryType === "FARMER" && (
                      <div className="mt-4 rounded-lg border border-gray-200 p-4">
                        <h4 className="text-md font-medium">
                          {!isWaray ? "Lot Details*" : "Mga Detalye han Lote*"}
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              {!isWaray
                                ? "Crops/Commodity*"
                                : "Mga Tanom/Komodidad*"}
                            </label>
                            <input
                              type="text"
                              className={`mt-1 block w-full rounded-md border p-2 ${
                                errors.farmDetails?.[index]?.lotDetails
                                  ?.cropsORCommodity
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              {...register(
                                `farmDetails.${index}.lotDetails.cropsORCommodity` as const,
                              )}
                            />
                            {errors.farmDetails?.[index]?.lotDetails
                              ?.cropsORCommodity && (
                              <p className="mt-1 text-sm text-red-600">
                                {
                                  errors.farmDetails[index]?.lotDetails
                                    ?.cropsORCommodity?.message
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              {!isWaray ? "Size (in Ha)*" : "Sukol (ha Ha)*"}
                            </label>
                            <input
                              type="number"
                              className={`mt-1 block w-full rounded-md border p-2 ${
                                errors.farmDetails?.[index]?.lotDetails
                                  ?.sizeInHa
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              {...register(
                                `farmDetails.${index}.lotDetails.sizeInHa` as const,
                                {
                                  valueAsNumber: true,
                                },
                              )}
                            />
                            {errors.farmDetails?.[index]?.lotDetails
                              ?.sizeInHa && (
                              <p className="mt-1 text-sm text-red-600">
                                {
                                  errors.farmDetails[index]?.lotDetails
                                    ?.sizeInHa?.message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray
                              ? "Number of Head (Livestock/Poultry)*"
                              : "Gidaghanon han Ulo (Hayupan/Manok)*"}
                          </label>
                          <input
                            type="number"
                            className={`mt-1 block w-full rounded-md border p-2 ${
                              errors.farmDetails?.[index]?.lotDetails
                                ?.numberOfHeadForLivestockAndPoultry
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            {...register(
                              `farmDetails.${index}.lotDetails.numberOfHeadForLivestockAndPoultry` as const,
                              {
                                valueAsNumber: true,
                              },
                            )}
                          />
                          {errors.farmDetails?.[index]?.lotDetails
                            ?.numberOfHeadForLivestockAndPoultry && (
                            <p className="mt-1 text-sm text-red-600">
                              {
                                errors.farmDetails[index]?.lotDetails
                                  ?.numberOfHeadForLivestockAndPoultry?.message
                              }
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            {!isWaray ? "Farm Type*" : "Klase han Uma*"}
                          </label>
                          <input
                            type="text"
                            className={`mt-1 block w-full rounded-md border p-2 ${
                              errors.farmDetails?.[index]?.lotDetails?.FarmType
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            {...register(
                              `farmDetails.${index}.lotDetails.FarmType` as const,
                            )}
                          />
                          {errors.farmDetails?.[index]?.lotDetails
                            ?.FarmType && (
                            <p className="mt-1 text-sm text-red-600">
                              {
                                errors.farmDetails[index]?.lotDetails?.FarmType
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex items-center">
                          <input
                            type="checkbox"
                            id={`organicPractitioner-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            {...register(
                              `farmDetails.${index}.lotDetails.organicPractitioner` as const,
                            )}
                          />
                          <label
                            htmlFor={`organicPractitioner-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {!isWaray
                              ? "Organic Practitioner"
                              : "Organic Practitioner"}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

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
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    {!isWaray ? "Next" : "Sunod"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 5 && (
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
                  disabled={isSubmitting || signupMutation.isPending}
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
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FarmerSignupPage;
