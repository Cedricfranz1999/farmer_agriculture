"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";

interface CommodityFormData {
  type: string;
  name: string;
  sizeInHa: number;
  annualVolumeInKG: number;
  certification: string;
}

interface FacilityFormData {
  facilitiesMachineryEquipmentUsed: string;
  ownership: string;
  model: string;
  quantity: string;
  volumeServicesArea: string;
  averageWorkingHoursDay: string;
  Remarks: string;
  dedicatedToOrganic: boolean;
}

const EditOrganicFarmer = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: farmer, isLoading } = api.organicFarmer.getById.useQuery(
    { id: Number(id) },
    { enabled: !!id }
  );

  const updateFarmerMutation = api.organicFarmer.update.useMutation({
    onSuccess: () => {
      router.push("/admin/organic-farmer");
    },
  });

  const [formData, setFormData] = useState({
    // Basic Information
    surname: "",
    firstname: "",
    middleName: "",
    extensionName: "",
    sex: "MALE" as "MALE" | "FEMALE",
    civilStaus: "SINGLE" as "SINGLE" | "MARRIED" | "WIDOWED" | "SEPARATED",
    dateOfBirth: "",
    placeOfBirth: "",
    highestFormOfEducation: "ELEMENTARY" as 
      "NONE" | "ELEMENTARY" | "HIGHSCHOOL" | "SENIOR_HIGHSCHOOL" | "COLLEGE" | "POST_GRADUATE" | "VOCATIONAL",
    religion: "",
    FourPS_Benificiaty: "",
    mothersName: "",
    fathersName: "",
    contactNumber: "",
    email_address: "",
    personToContactIncaseOfEmerceny: "",
    personContactNumberIncaseOfEmergency: "",
    // Address
    houseOrLotOrBuildingNo: "",
    streetOrSitioOrSubDivision: "",
    barangay: "",
    municipalityOrCity: "",
    province: "",
    region: "",
    // Income
    grossAnualIncomeLastYearFarming: 0,
    grossAnualIncomeLastYeaNonFarming: 0,
    // Certification
    withOrganicAgricultureCertification: false,
    certification: "" as "THIRD_PARTY_CERTIFICATION" | "PARTICIPATORY_GUARANTEE_SYSTEM" | "",
    whatStagesInCertification: "",
    // Nature of Business
    productionForInputs: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    productionForFood: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    postHarvestAndProcessing: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    tradingAndWholeSale: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    retailing: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    transPortAndLogistics: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    WareHousing: "" as "PRIMARY_BUSINESS" | "SECONDARY_BUSINESS" | "NOT_APPLICABLE" | "",
    Others: "",
    // Target Market
    direcToConsumer: false,
    trader: false,
    specificType1: "",
    retailer: false,
    institutionalBuyer: false,
    SpecificType2: "",
    internationalBasedBuyers: false,
    SpecificType3: "",
    others: "",
    // Agricultural Commodities
    agriculturalCommodities: [] as CommodityFormData[],
    othersCommodity: "",
    // Facilities
    ownSharedFacilities: [] as FacilityFormData[],
  });

  // Pre-populate form data when farmer data is loaded
  useEffect(() => {
    if (farmer) {
      // Collect all commodities from different relations
      const commodities: CommodityFormData[] = [];
      
      // Helper function to add commodity if it exists
      const addCommodityIfExists = (commodity: any, type: string) => {
        if (commodity) {
          commodities.push({
            type: type,
            name: commodity.name,
            sizeInHa: commodity.sizeInHa,
            annualVolumeInKG: commodity.annualVolumeInKG,
            certification: commodity.Certification || "",
          });
        }
      };

      addCommodityIfExists(farmer.Grains, "Grains");
      addCommodityIfExists(farmer.LowlandVegetables, "LowlandVegetables");
      addCommodityIfExists(farmer.UplandVegetables, "UplandVegetables");
      addCommodityIfExists(farmer.FruitsAndNots, "FruitsAndNots");
      addCommodityIfExists(farmer.Mushroom, "Mushroom");
      addCommodityIfExists(farmer.OrganicSoil, "OrganicSoil");
      addCommodityIfExists(farmer.Rootcrops, "Rootcrops");
      addCommodityIfExists(farmer.PultryProducts, "PultryProducts");
      addCommodityIfExists(farmer.LiveStockProducts, "LiveStockProducts");
      addCommodityIfExists(farmer.FisheriesAndAquaCulture, "FisheriesAndAquaCulture");
      addCommodityIfExists(farmer.IndustrialCropsAndProducts, "IndustrialCropsAndProducts");
      addCommodityIfExists(farmer.OtherCommodity, "OtherCommodity");

      setFormData({
        // Basic Information
        surname: farmer.surname || "",
        firstname: farmer.firstname || "",
        middleName: farmer.middleName || "",
        extensionName: farmer.extensionName || "",
        sex: farmer.sex,
        civilStaus: farmer.civilStaus,
        dateOfBirth: farmer.dateOfBirth ? new Date(farmer.dateOfBirth).toISOString().split('T')[0] : "" as any,
        placeOfBirth: farmer.placeOfBirth || "",
        highestFormOfEducation: farmer.highestFormOfEducation,
        religion: farmer.religion || "",
        FourPS_Benificiaty: farmer.FourPS_Benificiaty || "",
        mothersName: farmer.mothersName || "",
        fathersName: farmer.fathersName || "",
        contactNumber: farmer.contactNumber || "",
        email_address: farmer.email_address || "",
        personToContactIncaseOfEmerceny: farmer.personToContactIncaseOfEmerceny || "",
        personContactNumberIncaseOfEmergency: farmer.personContactNumberIncaseOfEmergency || "",
        // Address
        houseOrLotOrBuildingNo: farmer.houseOrLotOrBuildingNo || "",
        streetOrSitioOrSubDivision: farmer.streetOrSitioOrSubDivision || "",
        barangay: farmer.barangay || "",
        municipalityOrCity: farmer.municipalityOrCity || "",
        province: farmer.province || "",
        region: farmer.region || "",
        // Income
        grossAnualIncomeLastYearFarming: farmer.grossAnualIncomeLastYearFarming || 0,
        grossAnualIncomeLastYeaNonFarming: farmer.grossAnualIncomeLastYeaNonFarming || 0,
        // Certification
        withOrganicAgricultureCertification: farmer.withOrganicAgricultureCertification || false,
        certification: farmer.certification || "",
        whatStagesInCertification: farmer.whatStagesInCertification || "",
        // Nature of Business
        productionForInputs: farmer.productionForInputs || "",
        productionForFood: farmer.productionForFood || "",
        postHarvestAndProcessing: farmer.postHarvestAndProcessing || "",
        tradingAndWholeSale: farmer.tradingAndWholeSale || "",
        retailing: farmer.retailing || "",
        transPortAndLogistics: farmer.transPortAndLogistics || "",
        WareHousing: farmer.WareHousing || "",
        Others: farmer.Others || "",
        // Target Market
        direcToConsumer: farmer.direcToConsumer || false,
        trader: farmer.trader || false,
        specificType1: farmer.specificType1 || "",
        retailer: farmer.retailer || false,
        institutionalBuyer: farmer.institutionalBuyer || false,
        SpecificType2: farmer.SpecificType2 || "",
        internationalBasedBuyers: farmer.internationalBasedBuyers || false,
        SpecificType3: farmer.SpecificType3 || "",
        others: farmer.others || "",
        // Agricultural Commodities
        agriculturalCommodities: commodities,
        othersCommodity: farmer.othersCommodity || "",
        // Facilities
        ownSharedFacilities: farmer.ownSharedFacilities.map((facility) => ({
          facilitiesMachineryEquipmentUsed: facility.facilitiesMachineryEquipmentUsed,
          ownership: facility.ownership,
          model: facility.model,
          quantity: facility.quantity,
          volumeServicesArea: facility.volumeServicesArea,
          averageWorkingHoursDay: facility.averageWorkingHoursDay,
          Remarks: facility.Remarks || "",
          dedicatedToOrganic: facility.dedicatedToOrganic,
        })),
      });
    }
  }, [farmer]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommodityChange = (index: number, field: keyof CommodityFormData, value: any) => {
    const updatedCommodities = [...formData.agriculturalCommodities];
    updatedCommodities[index] = {
      ...updatedCommodities[index] as any,
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      agriculturalCommodities: updatedCommodities
    }));
  };

  const handleFacilityChange = (index: number, field: keyof FacilityFormData, value: any) => {
    const updatedFacilities = [...formData.ownSharedFacilities];
    updatedFacilities[index] = {
      ...updatedFacilities[index] as any,
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      ownSharedFacilities: updatedFacilities
    }));
  };

  const addCommodity = () => {
    setFormData(prev => ({
      ...prev,
      agriculturalCommodities: [
        ...prev.agriculturalCommodities,
        { type: "", name: "", sizeInHa: 0, annualVolumeInKG: 0, certification: "" }
      ]
    }));
  };

  const removeCommodity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agriculturalCommodities: prev.agriculturalCommodities.filter((_, i) => i !== index)
    }));
  };

  const addFacility = () => {
    setFormData(prev => ({
      ...prev,
      ownSharedFacilities: [
        ...prev.ownSharedFacilities,
        {
          facilitiesMachineryEquipmentUsed: "",
          ownership: "",
          model: "",
          quantity: "",
          volumeServicesArea: "",
          averageWorkingHoursDay: "",
          Remarks: "",
          dedicatedToOrganic: false
        }
      ]
    }));
  };

  const removeFacility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ownSharedFacilities: prev.ownSharedFacilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      id: Number(id),
      dateOfBirth: new Date(formData.dateOfBirth),
      // Convert empty strings to undefined for optional fields
      certification: formData.certification || undefined,
      productionForInputs: formData.productionForInputs || undefined,
      productionForFood: formData.productionForFood || undefined,
      postHarvestAndProcessing: formData.postHarvestAndProcessing || undefined,
      tradingAndWholeSale: formData.tradingAndWholeSale || undefined,
      retailing: formData.retailing || undefined,
      transPortAndLogistics: formData.transPortAndLogistics || undefined,
      WareHousing: formData.WareHousing || undefined,
    };

    updateFarmerMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading farmer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Organic Farmer</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-md">
        {/* Basic Information Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Surname</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Extension Name</label>
              <input
                type="text"
                value={formData.extensionName}
                onChange={(e) => handleInputChange("extensionName", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                value={formData.sex}
                onChange={(e) => handleInputChange("sex", e.target.value as "MALE" | "FEMALE")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Civil Status</label>
              <select
                value={formData.civilStaus}
                onChange={(e) => handleInputChange("civilStaus", e.target.value as "SINGLE" | "MARRIED" | "WIDOWED" | "SEPARATED")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="WIDOWED">Widowed</option>
                <option value="SEPARATED">Separated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Highest Form of Education</label>
              <select
                value={formData.highestFormOfEducation}
                onChange={(e) => handleInputChange("highestFormOfEducation", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
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
                value={formData.religion}
                onChange={(e) => handleInputChange("religion", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">4Ps Beneficiary</label>
              <input
                type="text"
                value={formData.FourPS_Benificiaty}
                onChange={(e) => handleInputChange("FourPS_Benificiaty", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
              <input
                type="text"
                value={formData.mothersName}
                onChange={(e) => handleInputChange("mothersName", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                value={formData.fathersName}
                onChange={(e) => handleInputChange("fathersName", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={formData.email_address}
                onChange={(e) => handleInputChange("email_address", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Person</label>
              <input
                type="text"
                value={formData.personToContactIncaseOfEmerceny}
                onChange={(e) => handleInputChange("personToContactIncaseOfEmerceny", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
              <input
                type="text"
                value={formData.personContactNumberIncaseOfEmergency}
                onChange={(e) => handleInputChange("personContactNumberIncaseOfEmergency", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Address Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Address</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">House/Lot/Building No</label>
              <input
                type="text"
                value={formData.houseOrLotOrBuildingNo}
                onChange={(e) => handleInputChange("houseOrLotOrBuildingNo", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street/Sitio/Subdivision</label>
              <input
                type="text"
                value={formData.streetOrSitioOrSubDivision}
                onChange={(e) => handleInputChange("streetOrSitioOrSubDivision", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barangay</label>
              <input
                type="text"
                value={formData.barangay}
                onChange={(e) => handleInputChange("barangay", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Municipality/City</label>
              <input
                type="text"
                value={formData.municipalityOrCity}
                onChange={(e) => handleInputChange("municipalityOrCity", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </section>

        {/* Income Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Income Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gross Annual Income Last Year (Farming)</label>
              <input
                type="number"
                value={formData.grossAnualIncomeLastYearFarming}
                onChange={(e) => handleInputChange("grossAnualIncomeLastYearFarming", Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gross Annual Income Last Year (Non-Farming)</label>
              <input
                type="number"
                value={formData.grossAnualIncomeLastYeaNonFarming}
                onChange={(e) => handleInputChange("grossAnualIncomeLastYeaNonFarming", Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>
        </section>

        {/* Certification Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Certification</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.withOrganicAgricultureCertification}
                onChange={(e) => handleInputChange("withOrganicAgricultureCertification", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                With Organic Agriculture Certification
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Certification Type</label>
              <select
                value={formData.certification}
                onChange={(e) => handleInputChange("certification", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Certification</option>
                <option value="THIRD_PARTY_CERTIFICATION">Third Party Certification</option>
                <option value="PARTICIPATORY_GUARANTEE_SYSTEM">Participatory Guarantee System</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Stages in Certification</label>
              <input
                type="text"
                value={formData.whatStagesInCertification}
                onChange={(e) => handleInputChange("whatStagesInCertification", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Nature of Business Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Nature of Business</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Production for Inputs</label>
              <select
                value={formData.productionForInputs}
                onChange={(e) => handleInputChange("productionForInputs", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Production for Food</label>
              <select
                value={formData.productionForFood}
                onChange={(e) => handleInputChange("productionForFood", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Post Harvest and Processing</label>
              <select
                value={formData.postHarvestAndProcessing}
                onChange={(e) => handleInputChange("postHarvestAndProcessing", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trading and Wholesale</label>
              <select
                value={formData.tradingAndWholeSale}
                onChange={(e) => handleInputChange("tradingAndWholeSale", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Retailing</label>
              <select
                value={formData.retailing}
                onChange={(e) => handleInputChange("retailing", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transport and Logistics</label>
              <select
                value={formData.transPortAndLogistics}
                onChange={(e) => handleInputChange("transPortAndLogistics", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warehousing</label>
              <select
                value={formData.WareHousing}
                onChange={(e) => handleInputChange("WareHousing", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="PRIMARY_BUSINESS">Primary Business</option>
                <option value="SECONDARY_BUSINESS">Secondary Business</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Others</label>
              <input
                type="text"
                value={formData.Others}
                onChange={(e) => handleInputChange("Others", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Target Market Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Target Market</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.direcToConsumer}
                onChange={(e) => handleInputChange("direcToConsumer", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Direct to Consumer
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.trader}
                onChange={(e) => handleInputChange("trader", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Trader
              </label>
            </div>
            {formData.trader && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Trader Specific Type</label>
                <input
                  type="text"
                  value={formData.specificType1}
                  onChange={(e) => handleInputChange("specificType1", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.retailer}
                onChange={(e) => handleInputChange("retailer", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Retailer
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.institutionalBuyer}
                onChange={(e) => handleInputChange("institutionalBuyer", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Institutional Buyer
              </label>
            </div>
            {(formData.retailer || formData.institutionalBuyer) && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Specific Type</label>
                <input
                  type="text"
                  value={formData.SpecificType2}
                  onChange={(e) => handleInputChange("SpecificType2", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.internationalBasedBuyers}
                onChange={(e) => handleInputChange("internationalBasedBuyers", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                International Based Buyers
              </label>
            </div>
            {formData.internationalBasedBuyers && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">International Specific Type</label>
                <input
                  type="text"
                  value={formData.SpecificType3}
                  onChange={(e) => handleInputChange("SpecificType3", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Other Markets</label>
              <input
                type="text"
                value={formData.others}
                onChange={(e) => handleInputChange("others", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Agricultural Commodities Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Agricultural Commodities</h2>
            <button
              type="button"
              onClick={addCommodity}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Commodity
            </button>
          </div>
          
          {formData.agriculturalCommodities.length === 0 ? (
            <p className="text-gray-500">No commodities added. Click "Add Commodity" to add one.</p>
          ) : (
            formData.agriculturalCommodities.map((commodity, index) => (
              <div key={index} className="mb-4 rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex justify-between">
                  <h3 className="font-semibold">Commodity {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeCommodity(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={commodity.type}
                      onChange={(e) => handleCommodityChange(index, "type", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Grains">Grains</option>
                      <option value="LowlandVegetables">Lowland Vegetables</option>
                      <option value="UplandVegetables">Upland Vegetables</option>
                      <option value="FruitsAndNots">Fruits and Nuts</option>
                      <option value="Mushroom">Mushroom</option>
                      <option value="OrganicSoil">Organic Soil</option>
                      <option value="Rootcrops">Root Crops</option>
                      <option value="PultryProducts">Poultry Products</option>
                      <option value="LiveStockProducts">Livestock Products</option>
                      <option value="FisheriesAndAquaCulture">Fisheries and Aquaculture</option>
                      <option value="IndustrialCropsAndProducts">Industrial Crops and Products</option>
                      <option value="OtherCommodity">Other Commodity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={commodity.name}
                      onChange={(e) => handleCommodityChange(index, "name", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size (Ha)</label>
                    <input
                      type="number"
                      value={commodity.sizeInHa}
                      onChange={(e) => handleCommodityChange(index, "sizeInHa", Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Volume (KG)</label>
                    <input
                      type="number"
                      value={commodity.annualVolumeInKG}
                      onChange={(e) => handleCommodityChange(index, "annualVolumeInKG", Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Certification</label>
                    <input
                      type="text"
                      value={commodity.certification}
                      onChange={(e) => handleCommodityChange(index, "certification", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Other Commodities</label>
            <input
              type="text"
              value={formData.othersCommodity}
              onChange={(e) => handleInputChange("othersCommodity", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Facilities Section */}
        <section className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Owned/Shared Facilities</h2>
            <button
              type="button"
              onClick={addFacility}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Facility
            </button>
          </div>
          
          {formData.ownSharedFacilities.length === 0 ? (
            <p className="text-gray-500">No facilities added. Click "Add Facility" to add one.</p>
          ) : (
            formData.ownSharedFacilities.map((facility, index) => (
              <div key={index} className="mb-4 rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex justify-between">
                  <h3 className="font-semibold">Facility {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facilities/Machinery/Equipment Used</label>
                    <input
                      type="text"
                      value={facility.facilitiesMachineryEquipmentUsed}
                      onChange={(e) => handleFacilityChange(index, "facilitiesMachineryEquipmentUsed", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ownership</label>
                    <input
                      type="text"
                      value={facility.ownership}
                      onChange={(e) => handleFacilityChange(index, "ownership", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      value={facility.model}
                      onChange={(e) => handleFacilityChange(index, "model", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="text"
                      value={facility.quantity}
                      onChange={(e) => handleFacilityChange(index, "quantity", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Volume/Services Area</label>
                    <input
                      type="text"
                      value={facility.volumeServicesArea}
                      onChange={(e) => handleFacilityChange(index, "volumeServicesArea", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Average Working Hours/Day</label>
                    <input
                      type="text"
                      value={facility.averageWorkingHoursDay}
                      onChange={(e) => handleFacilityChange(index, "averageWorkingHoursDay", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Remarks</label>
                    <textarea
                      value={facility.Remarks}
                      onChange={(e) => handleFacilityChange(index, "Remarks", e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={facility.dedicatedToOrganic}
                      onChange={(e) => handleFacilityChange(index, "dedicatedToOrganic", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Dedicated to Organic
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={updateFarmerMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateFarmerMutation.isPending ? "Updating..." : "Update Farmer"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-gray-600 px-6 py-3 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrganicFarmer;             