// ~/app/admin/farmer/edit/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface FarmerData {
  id: number;
  username: string;
  email_address: string | null;
  surname: string;
  firstname: string;
  middleName: string | null;
  extensionName: string | null;
  sex: "MALE" | "FEMALE";
  houseOrLotOrBuildingNo: string;
  streetOrSitioOrSubDivision: string;
  barangay: string;
  municipalityOrCity: string;
  province: string;
  region: string;
  contactNumber: string;
  placeOfBirth: string;
  dateOfBirth: Date;
  highestFormOfEducation: "NONE" | "ELEMENTARY" | "HIGHSCHOOL" | "SENIOR_HIGHSCHOOL" | "COLLEGE" | "POST_GRADUATE" | "VOCATIONAL";
  religion: string | null;
  civilStaus: "SINGLE" | "MARRIED" | "WIDOWED" | "SEPARATED";
  nameOfSpouse: string | null;
  FourPS_Benificiaty: string | null;
  mothersName: string | null;
  fathersName: string | null;
  govermentId: string;
  personToContactIncaseOfEmerceny: string | null;
  personContactNumberIncaseOfEmergency: string;
  grossAnualIncomeLastYearFarming: number;
  grossAnualIncomeLastYeaNonFarming: number;
  farmerImage: string;
  farmerSignatureAsImage: string | null;
  farmerFingerPrintAsImage: string | null;
  categoryType: "FARMER" | "FARMWORKER" | "FISHERFOLK" | "AGRI_YOUTH";
  numberOfFarms: number;
  farmerDetails: {
    id: number;
    rice: boolean;
    corn: boolean;
    othersCrops: string | null;
    livestock: boolean;
    livestockDetails: string | null;
    poultry: boolean;
    poultryDetails: string | null;
  } | null;
  farmworkerDetails: {
    id: number;
    landPreparation: boolean;
    plantingTransplanting: boolean;
    cultivation: boolean;
    harvesting: boolean;
    others: string | null;
  } | null;
  fisherfolkDetails: {
    id: number;
    fishCapture: boolean;
    aquaculture: boolean;
    gleaning: boolean;
    fishProcessing: boolean;
    fishVending: boolean;
    others: string | null;
  } | null;
  AGRI_YOUTH: {
    id: number;
    partOfFarmingHouseHold: boolean;
    attendedFormalAgriFishery: boolean;
    attendedNonFormalAgriFishery: boolean;
    participatedInAnyAgriculturalActivity: boolean;
    fishVending: boolean;
    others: string | null;
  }[];
  houseHead: {
    id: number;
    houseHoldHead: string;
    relationship: string;
    numberOfLivingHouseHoldMembersTotal: number;
    numberOfMale: number;
    NumberOfFemale: number;
  } | null;
  farmDetails: {
    id: number;
    Location: string;
    TotalFarmAreaInHa: number;
    withAncestordomain: boolean | null;
    agrarianReform: boolean;
    OwnerDocumentsNumber: string;
    RegisterOwner: boolean | null;
    ownerName: string;
    othersField: string | null;
    tenantOwner: boolean | null;
    teenantName: string | null;
    Leese: boolean | null;
    leeseName: string | null;
    others: string | null;
  }[];
}

const EditFarmerProfile = () => {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const { data: farmerData, isLoading, error ,refetch} = api.auth.getLatestFarmer.useQuery({ id });
  const { mutate: updateFarmer, isPending: isUpdating } = api.auth.updateFarmer.useMutation({
    onSuccess: () => {
      refetch()
      router.push(`/admin/registered-farmers/farmers`);
    },
  });

  const [formData, setFormData] = useState<FarmerData | null>(null);

  useEffect(() => {
    if (farmerData) {
      setFormData({
        ...farmerData,
        dateOfBirth: farmerData.dateOfBirth ? new Date(farmerData.dateOfBirth) : new Date(),
        personContactNumberIncaseOfEmergency: farmerData.personContactNumberIncaseOfEmergency || "",
        farmerDetails: farmerData.farmerDetails ? {
          ...farmerData.farmerDetails,
          id: farmerData.farmerDetails.id || 0
        } : null,
        farmworkerDetails: farmerData.farmworkerDetails ? {
          ...farmerData.farmworkerDetails,
          id: farmerData.farmworkerDetails.id || 0
        } : null,
        fisherfolkDetails: farmerData.fisherfolkDetails ? {
          ...farmerData.fisherfolkDetails,
          id: farmerData.fisherfolkDetails.id || 0
        } : null,
        houseHead: farmerData.houseHead ? {
          ...farmerData.houseHead,
          id: farmerData.houseHead.id || 0
        } : null,
        farmDetails: farmerData.farmDetails.map(farm => ({
          ...farm,
          id: farm.id || 0,
          Location: farm.Location || "",
          TotalFarmAreaInHa: farm.TotalFarmAreaInHa || 0,
          OwnerDocumentsNumber: farm.OwnerDocumentsNumber || "",
          ownerName: farm.ownerName || "",
          withAncestordomain: farm.withAncestordomain ?? null,
          agrarianReform: farm.agrarianReform || false,
          RegisterOwner: farm.RegisterOwner ?? null,
          tenantOwner: farm.tenantOwner ?? null,
          Leese: farm.Leese ?? null,
          others: farm.others || null,
          othersField: farm.othersField || null,
          teenantName: farm.teenantName || null,
          leeseName: farm.leeseName || null
        })),
        AGRI_YOUTH: farmerData.AGRI_YOUTH.map(youth => ({
          ...youth,
          id: youth.id || 0,
          partOfFarmingHouseHold: youth.partOfFarmingHouseHold || false,
          attendedFormalAgriFishery: youth.attendedFormalAgriFishery || false,
          attendedNonFormalAgriFishery: youth.attendedNonFormalAgriFishery || false,
          participatedInAnyAgriculturalActivity: youth.participatedInAnyAgriculturalActivity || false,
          fishVending: youth.fishVending || false,
          others: youth.others || null
        }))
      });
    }
  }, [farmerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    if (!formData) return;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCategoryDetailsChange = (field: string, value: any) => {
    if (!formData) return;

    const category = formData.categoryType.toLowerCase();
    const detailsKey = category === 'farmer' ? 'farmerDetails' :
                      category === 'farmworker' ? 'farmworkerDetails' :
                      'fisherfolkDetails';

    if (formData[detailsKey]) {
      setFormData({
        ...formData,
        [detailsKey]: {
          ...formData[detailsKey]!,
          id: formData[detailsKey]!.id || 0,
          [field]: value,
        },
      });
    }
  };

  const handleFarmChange = (index: number, field: string, value: any) => {
    if (!formData) return;

    const updatedFarms = [...formData.farmDetails];
    const currentFarm = updatedFarms[index];

    if (!currentFarm) return;

    const updatedFarm = {
      ...currentFarm,
      [field]: value,
      id: currentFarm.id || 0,
      Location: currentFarm.Location || "",
      TotalFarmAreaInHa: currentFarm.TotalFarmAreaInHa || 0,
      OwnerDocumentsNumber: currentFarm.OwnerDocumentsNumber || "",
      ownerName: currentFarm.ownerName || "",
      withAncestordomain: currentFarm.withAncestordomain ?? null,
      agrarianReform: currentFarm.agrarianReform || false,
      RegisterOwner: currentFarm.RegisterOwner ?? null,
      tenantOwner: currentFarm.tenantOwner ?? null,
      Leese: currentFarm.Leese ?? null,
      others: currentFarm.others || null,
      othersField: currentFarm.othersField || null,
      teenantName: currentFarm.teenantName || null,
      leeseName: currentFarm.leeseName || null
    };

    updatedFarms[index] = updatedFarm;
    setFormData({
      ...formData,
      farmDetails: updatedFarms,
    });
  };

  const handleHouseHeadChange = (field: string, value: any) => {
    if (!formData || !formData.houseHead) return;

    const updatedHouseHead = {
      ...formData.houseHead,
      [field]: value,
      id: formData.houseHead.id || 0,
      houseHoldHead: formData.houseHead.houseHoldHead || "",
      relationship: formData.houseHead.relationship || "",
      numberOfLivingHouseHoldMembersTotal: formData.houseHead.numberOfLivingHouseHoldMembersTotal || 0,
      numberOfMale: formData.houseHead.numberOfMale || 0,
      NumberOfFemale: formData.houseHead.NumberOfFemale || 0,
    };

    setFormData({
      ...formData,
      houseHead: updatedHouseHead,
    });
  };

  const handleAgriYouthChange = (index: number, field: string, value: any) => {
    if (!formData) return;

    const updatedYouth = [...formData.AGRI_YOUTH];
    const currentYouth = updatedYouth[index];

    if (!currentYouth) return;

    const updatedItem = {
      ...currentYouth,
      [field]: value,
      id: currentYouth.id || 0,
      partOfFarmingHouseHold: currentYouth.partOfFarmingHouseHold || false,
      attendedFormalAgriFishery: currentYouth.attendedFormalAgriFishery || false,
      attendedNonFormalAgriFishery: currentYouth.attendedNonFormalAgriFishery || false,
      participatedInAnyAgriculturalActivity: currentYouth.participatedInAnyAgriculturalActivity || false,
      fishVending: currentYouth.fishVending || false,
      others: currentYouth.others || null,
    };

    updatedYouth[index] = updatedItem;
    setFormData({
      ...formData,
      AGRI_YOUTH: updatedYouth,
    });
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData) return;

  // Helper function to transform null to empty string
  const transformNullToString = (value: any): string => {
    return value === null ? '' : value;
  };

  const submissionData: any = {
    ...formData,
    dateOfBirth: new Date(formData.dateOfBirth),
    grossAnualIncomeLastYearFarming: Number(formData.grossAnualIncomeLastYearFarming),
    grossAnualIncomeLastYeaNonFarming: Number(formData.grossAnualIncomeLastYeaNonFarming),
    
    // Transform null fields to empty strings
    FourPS_Benificiaty: transformNullToString(formData.FourPS_Benificiaty),
    farmerSignatureAsImage: transformNullToString(formData.farmerSignatureAsImage),
    farmerFingerPrintAsImage: transformNullToString(formData.farmerFingerPrintAsImage),
    
    // Handle category details - ensure they're not null
    farmerDetails: formData.farmerDetails ? {
      rice: formData.farmerDetails.rice,
      corn: formData.farmerDetails.corn,
      othersCrops: transformNullToString(formData.farmerDetails.othersCrops),
      livestock: formData.farmerDetails.livestock,
      livestockDetails: transformNullToString(formData.farmerDetails.livestockDetails),
      poultry: formData.farmerDetails.poultry,
      poultryDetails: transformNullToString(formData.farmerDetails.poultryDetails),
    } : undefined, // Use undefined instead of null
    
    farmworkerDetails: formData.farmworkerDetails ? {
      landPreparation: formData.farmworkerDetails.landPreparation,
      plantingTransplanting: formData.farmworkerDetails.plantingTransplanting,
      cultivation: formData.farmworkerDetails.cultivation,
      harvesting: formData.farmworkerDetails.harvesting,
      others: transformNullToString(formData.farmworkerDetails.others),
    } : undefined,
    
    fisherfolkDetails: formData.fisherfolkDetails ? {
      fishCapture: formData.fisherfolkDetails.fishCapture,
      aquaculture: formData.fisherfolkDetails.aquaculture,
      gleaning: formData.fisherfolkDetails.gleaning,
      fishProcessing: formData.fisherfolkDetails.fishProcessing,
      fishVending: formData.fisherfolkDetails.fishVending,
      others: transformNullToString(formData.fisherfolkDetails.others),
    } : undefined,
    
    houseHead: formData.houseHead ? {
      houseHoldHead: formData.houseHead.houseHoldHead,
      relationship: formData.houseHead.relationship,
      numberOfLivingHouseHoldMembersTotal: formData.houseHead.numberOfLivingHouseHoldMembersTotal,
      numberOfMale: formData.houseHead.numberOfMale,
      NumberOfFemale: formData.houseHead.NumberOfFemale,
    } : undefined,
    
    farmDetails: formData.farmDetails.map(farm => ({
      Location: farm.Location,
      TotalFarmAreaInHa: farm.TotalFarmAreaInHa,
      withAncestordomain: farm.withAncestordomain,
      agrarianReform: farm.agrarianReform,
      OwnerDocumentsNumber: farm.OwnerDocumentsNumber,
      RegisterOwner: farm.RegisterOwner,
      ownerName: farm.ownerName,
      othersField: transformNullToString(farm.othersField),
      tenantOwner: farm.tenantOwner,
      teenantName: transformNullToString(farm.teenantName),
      Leese: farm.Leese,
      leeseName: transformNullToString(farm.leeseName),
      others: transformNullToString(farm.others),
    })),
    
    AGRI_YOUTH: formData.AGRI_YOUTH.map(youth => ({
      partOfFarmingHouseHold: youth.partOfFarmingHouseHold,
      attendedFormalAgriFishery: youth.attendedFormalAgriFishery,
      attendedNonFormalAgriFishery: youth.attendedNonFormalAgriFishery,
      participatedInAnyAgriculturalActivity: youth.participatedInAnyAgriculturalActivity,
      fishVending: youth.fishVending,
      others: transformNullToString(youth.others),
    }))
  };

  // Remove undefined values to avoid sending them
  Object.keys(submissionData).forEach(key => {
    if (submissionData[key] === undefined) {
      delete submissionData[key];
    }
  });

  updateFarmer(submissionData);
};

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600">Loading farmer data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <div className="mb-2 text-xl text-red-600">⚠️</div>
        <p className="font-medium text-red-800">Error loading data</p>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      </div>
    </div>
  );

  if (!formData) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="mb-4 text-4xl">📄</div>
        <p>No farmer data found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Farmer Profile</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/farmer')}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to Farmers
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email_address"
                value={formData.email_address || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Extension Name</label>
              <input
                type="text"
                name="extensionName"
                value={formData.extensionName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Type</label>
              <select
                name="categoryType"
                value={formData.categoryType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="FARMER">Farmer</option>
                <option value="FARMWORKER">Farm Worker</option>
                <option value="FISHERFOLK">Fisherfolk</option>
                <option value="AGRI_YOUTH">Agri Youth</option>
              </select>
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Address Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">House/Lot/Building No</label>
              <input
                type="text"
                name="houseOrLotOrBuildingNo"
                value={formData.houseOrLotOrBuildingNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street/Sitio/Subdivision</label>
              <input
                type="text"
                name="streetOrSitioOrSubDivision"
                value={formData.streetOrSitioOrSubDivision}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barangay</label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Municipality/City</label>
              <input
                type="text"
                name="municipalityOrCity"
                value={formData.municipalityOrCity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </section>

        {/* Contact & Personal Information */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Contact & Personal Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth.toISOString().split('T')[0]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Highest Form of Education</label>
              <select
                name="highestFormOfEducation"
                value={formData.highestFormOfEducation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="NONE">None</option>
                <option value="ELEMENTARY">Elementary</option>
                <option value="HIGHSCHOOL">High School</option>
                <option value="SENIOR_HIGHSCHOOL">Senior High School</option>
                <option value="COLLEGE">College</option>
                <option value="POST_GRADUATE">Post Graduate</option>
                <option value="VOCATIONAL">Vocational</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Civil Status</label>
              <select
                name="civilStaus"
                value={formData.civilStaus}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="WIDOWED">Widowed</option>
                <option value="SEPARATED">Separated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name of Spouse</label>
              <input
                type="text"
                name="nameOfSpouse"
                value={formData.nameOfSpouse || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">4PS Beneficiary</label>
              <input
                type="text"
                name="FourPS_Benificiaty"
                value={formData.FourPS_Benificiaty || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
              <input
                type="text"
                name="mothersName"
                value={formData.mothersName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fathersName"
                value={formData.fathersName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Government ID</label>
              <input
                type="text"
                name="govermentId"
                value={formData.govermentId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Person</label>
              <input
                type="text"
                name="personToContactIncaseOfEmerceny"
                value={formData.personToContactIncaseOfEmerceny || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
              <input
                type="text"
                name="personContactNumberIncaseOfEmergency"
                value={formData.personContactNumberIncaseOfEmergency}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Income Information */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Income Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gross Annual Income (Farming)</label>
              <input
                type="number"
                name="grossAnualIncomeLastYearFarming"
                value={formData.grossAnualIncomeLastYearFarming}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gross Annual Income (Non-Farming)</label>
              <input
                type="number"
                name="grossAnualIncomeLastYeaNonFarming"
                value={formData.grossAnualIncomeLastYeaNonFarming}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
        </section>

        {/* Category-Specific Details */}
        {formData.categoryType === "FARMER" && formData.farmerDetails && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Farmer Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmerDetails.rice}
                  onChange={(e) => handleCategoryDetailsChange("rice", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Rice</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmerDetails.corn}
                  onChange={(e) => handleCategoryDetailsChange("corn", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Corn</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmerDetails.livestock}
                  onChange={(e) => handleCategoryDetailsChange("livestock", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Livestock</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmerDetails.poultry}
                  onChange={(e) => handleCategoryDetailsChange("poultry", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Poultry</label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Other Crops</label>
                <input
                  type="text"
                  value={formData.farmerDetails.othersCrops || ''}
                  onChange={(e) => handleCategoryDetailsChange("othersCrops", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Livestock Details</label>
                <input
                  type="text"
                  value={formData.farmerDetails.livestockDetails || ''}
                  onChange={(e) => handleCategoryDetailsChange("livestockDetails", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Poultry Details</label>
                <input
                  type="text"
                  value={formData.farmerDetails.poultryDetails || ''}
                  onChange={(e) => handleCategoryDetailsChange("poultryDetails", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        )}

        {formData.categoryType === "FARMWORKER" && formData.farmworkerDetails && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Farm Worker Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmworkerDetails.landPreparation}
                  onChange={(e) => handleCategoryDetailsChange("landPreparation", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Land Preparation</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmworkerDetails.plantingTransplanting}
                  onChange={(e) => handleCategoryDetailsChange("plantingTransplanting", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Planting/Transplanting</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmworkerDetails.cultivation}
                  onChange={(e) => handleCategoryDetailsChange("cultivation", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Cultivation</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.farmworkerDetails.harvesting}
                  onChange={(e) => handleCategoryDetailsChange("harvesting", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Harvesting</label>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Other Activities</label>
                <input
                  type="text"
                  value={formData.farmworkerDetails.others || ''}
                  onChange={(e) => handleCategoryDetailsChange("others", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        )}

        {formData.categoryType === "FISHERFOLK" && formData.fisherfolkDetails && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Fisherfolk Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fisherfolkDetails.fishCapture}
                  onChange={(e) => handleCategoryDetailsChange("fishCapture", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Fish Capture</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fisherfolkDetails.aquaculture}
                  onChange={(e) => handleCategoryDetailsChange("aquaculture", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Aquaculture</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fisherfolkDetails.gleaning}
                  onChange={(e) => handleCategoryDetailsChange("gleaning", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Gleaning</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fisherfolkDetails.fishProcessing}
                  onChange={(e) => handleCategoryDetailsChange("fishProcessing", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Fish Processing</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fisherfolkDetails.fishVending}
                  onChange={(e) => handleCategoryDetailsChange("fishVending", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">Fish Vending</label>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Other Activities</label>
                <input
                  type="text"
                  value={formData.fisherfolkDetails.others || ''}
                  onChange={(e) => handleCategoryDetailsChange("others", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* Farm Details */}
        {formData.farmDetails && formData.farmDetails.length > 0 && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Farm Details</h2>
            {formData.farmDetails.map((farm, index) => (
              <div key={farm.id} className="mb-6 rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Farm #{index + 1}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={farm.Location}
                      onChange={(e) => handleFarmChange(index, "Location", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Farm Area (Ha)</label>
                    <input
                      type="number"
                      value={farm.TotalFarmAreaInHa}
                      onChange={(e) => handleFarmChange(index, "TotalFarmAreaInHa", parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Documents Number</label>
                    <input
                      type="text"
                      value={farm.OwnerDocumentsNumber}
                      onChange={(e) => handleFarmChange(index, "OwnerDocumentsNumber", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                    <input
                      type="text"
                      value={farm.ownerName}
                      onChange={(e) => handleFarmChange(index, "ownerName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={farm.withAncestordomain || false}
                      onChange={(e) => handleFarmChange(index, "withAncestordomain", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">With Ancestor Domain</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={farm.agrarianReform}
                      onChange={(e) => handleFarmChange(index, "agrarianReform", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Agrarian Reform</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={farm.RegisterOwner || false}
                      onChange={(e) => handleFarmChange(index, "RegisterOwner", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Registered Owner</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={farm.tenantOwner || false}
                      onChange={(e) => handleFarmChange(index, "tenantOwner", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Tenant Owner</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={farm.Leese || false}
                      onChange={(e) => handleFarmChange(index, "Leese", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Lease</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
                    <input
                      type="text"
                      value={farm.teenantName || ''}
                      onChange={(e) => handleFarmChange(index, "teenantName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lease Name</label>
                    <input
                      type="text"
                      value={farm.leeseName || ''}
                      onChange={(e) => handleFarmChange(index, "leeseName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Other Details</label>
                    <input
                      type="text"
                      value={farm.others || ''}
                      onChange={(e) => handleFarmChange(index, "others", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Other Fields</label>
                    <input
                      type="text"
                      value={farm.othersField || ''}
                      onChange={(e) => handleFarmChange(index, "othersField", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Household Information */}
        {formData.houseHead && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Household Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Household Head</label>
                <input
                  type="text"
                  value={formData.houseHead.houseHoldHead}
                  onChange={(e) => handleHouseHeadChange("houseHoldHead", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relationship</label>
                <input
                  type="text"
                  value={formData.houseHead.relationship}
                  onChange={(e) => handleHouseHeadChange("relationship", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Household Members</label>
                <input
                  type="number"
                  value={formData.houseHead.numberOfLivingHouseHoldMembersTotal}
                  onChange={(e) => handleHouseHeadChange("numberOfLivingHouseHoldMembersTotal", parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Males</label>
                <input
                  type="number"
                  value={formData.houseHead.numberOfMale}
                  onChange={(e) => handleHouseHeadChange("numberOfMale", parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Females</label>
                <input
                  type="number"
                  value={formData.houseHead.NumberOfFemale}
                  onChange={(e) => handleHouseHeadChange("NumberOfFemale", parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
          </section>
        )}

        {/* AGRI_YOUTH Details */}
        {formData.categoryType === "AGRI_YOUTH" && formData.AGRI_YOUTH && formData.AGRI_YOUTH.length > 0 && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Agricultural Youth Details</h2>
            {formData.AGRI_YOUTH.map((youth, index) => (
              <div key={youth.id} className="mb-4 rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Youth Record #{index + 1}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={youth.partOfFarmingHouseHold}
                      onChange={(e) => handleAgriYouthChange(index, "partOfFarmingHouseHold", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Part of Farming Household</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={youth.attendedFormalAgriFishery}
                      onChange={(e) => handleAgriYouthChange(index, "attendedFormalAgriFishery", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Attended Formal Agri-Fishery</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={youth.attendedNonFormalAgriFishery}
                      onChange={(e) => handleAgriYouthChange(index, "attendedNonFormalAgriFishery", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Attended Non-Formal Agri-Fishery</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={youth.participatedInAnyAgriculturalActivity}
                      onChange={(e) => handleAgriYouthChange(index, "participatedInAnyAgriculturalActivity", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Participated in Agricultural Activities</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={youth.fishVending}
                      onChange={(e) => handleAgriYouthChange(index, "fishVending", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Fish Vending</label>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Other Activities</label>
                    <input
                      type="text"
                      value={youth.others || ''}
                      onChange={(e) => handleAgriYouthChange(index, "others", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Images Section */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Images</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Farmer Image URL</label>
              <input
                type="text"
                name="farmerImage"
                value={formData.farmerImage}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Signature Image URL</label>
              <input
                type="text"
                name="farmerSignatureAsImage"
                value={formData.farmerSignatureAsImage || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fingerprint Image URL</label>
              <input
                type="text"
                name="farmerFingerPrintAsImage"
                value={formData.farmerFingerPrintAsImage || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/farmer')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFarmerProfile;