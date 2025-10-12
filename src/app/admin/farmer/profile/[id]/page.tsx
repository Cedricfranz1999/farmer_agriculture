"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

// Type definitions based on your Prisma schema
interface FarmerDetails {
  id: number;
  rice: boolean;
  corn: boolean;
  othersCrops: string | null;
  livestock: boolean;
  livestockDetails: string | null;
  poultry: boolean;
  poultryDetails: string | null;
}

interface FarmWorkerDetails {
  id: number;
  landPreparation: boolean;
  plantingTransplanting: boolean;
  cultivation: boolean;
  harvesting: boolean;
  others: string | null;
}

interface FisherfolkDetails {
  id: number;
  fishCapture: boolean;
  aquaculture: boolean;
  gleaning: boolean;
  fishProcessing: boolean;
  fishVending: boolean;
  others: string | null;
}

interface AgriYouth {
  id: number;
  partOfFarmingHouseHold: boolean;
  attendedFormalAgriFishery: boolean;
  attendedNonFormalAgriFishery: boolean;
  participatedInAnyAgriculturalActivity: boolean;
  fishVending: boolean;
  others: string | null;
}

interface HouseHead {
  id: number;
  houseHoldHead: string;
  relationship: string;
  numberOfLivingHouseHoldMembersTotal: number;
  numberOfMale: number;
  NumberOfFemale: number;
}

interface FarmDetails {
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
  farmerId: number;
}

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
  highestFormOfEducation:
    | "NONE"
    | "ELEMENTARY"
    | "HIGHSCHOOL"
    | "SENIOR_HIGHSCHOOL"
    | "COLLEGE"
    | "POST_GRADUATE"
    | "VOCATIONAL";
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
  farmerDetails: FarmerDetails | null;
  farmworkerDetails: FarmWorkerDetails | null;
  fisherfolkDetails: FisherfolkDetails | null;
  AGRI_YOUTH: AgriYouth[];
  houseHead: HouseHead | null;
  farmDetails: FarmDetails[];
}

const FarmerProfilePrintGenerator = () => {
  const params = useParams();
  const id = params.id; // 👈 this is your dynamic [id]
  const [showActions, setShowActions] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const {
    data: farmer,
    isLoading,
    error,
  } = api.auth.getLatestFarmer.useQuery({ id: Number(id) });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Farmer_Profile_${farmer?.firstname}_${farmer?.surname}`,
    onBeforePrint: () => {
      setShowActions(false);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setShowActions(true);
    },
    // Add this to your pageStyle in useReactToPrint
    pageStyle: `
  @page {
    size: 8.5in 11in;
    margin: 0.5in 0.4in 0.5in 0.4in;
  }
  @media print {
    body {
      margin: 0 !important;
      padding: 0 !important;
      font-size: 10pt !important;
      line-height: 1.2 !important;
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    .no-print {
      display: none !important;
    }
    .page-break {
      page-break-before: always !important;
      break-before: page !important;
    }
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .force-break-after {
      page-break-after: always !important;
      break-after: page !important;
    }
    .print-container {
      max-width: none !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      background: white !important;
    }
    .section-header {
      background-color: #f8f9fa !important;
      -webkit-print-color-adjust: exact !important;
    }
    .header-section {
      border-bottom: 1px solid #000 !important;
      margin-bottom: 0.3in !important;
      padding-bottom: 0.2in !important;
    }
    .section-divider {
      border-bottom: 1px solid #ccc !important;
    }
    .compact-spacing {
      margin-bottom: 0.15in !important;
    }
    .compact-section {
      margin-bottom: 0.2in !important;
    }
  }
`,
  });

  const handleLogin = () => {
    window.location.href = "/sign-in";
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading farmer data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="mb-2 text-xl text-red-600">⚠️</div>
          <p className="font-medium text-red-800">Error loading data</p>
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );

  if (!farmer)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="mb-4 text-4xl">📄</div>
          <p>No farmer data found</p>
        </div>
      </div>
    );

  // Helper function to format education level
  const formatEducationLevel = (level: string) => {
    const educationMap: Record<string, string> = {
      NONE: "None",
      ELEMENTARY: "Elementary",
      HIGHSCHOOL: "High School",
      SENIOR_HIGHSCHOOL: "Senior High School",
      COLLEGE: "College",
      POST_GRADUATE: "Post Graduate",
      VOCATIONAL: "Vocational",
    };
    return educationMap[level] || level;
  };

  // Helper function to format civil status
  const formatCivilStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      SINGLE: "Single",
      MARRIED: "Married",
      WIDOWED: "Widowed",
      SEPARATED: "Separated",
    };
    return statusMap[status] || status;
  };

  // Helper function to format category type
  const formatCategoryType = (category: string) => {
    const categoryMap: Record<string, string> = {
      FARMER: "Farmer",
      FARMWORKER: "Farm Worker",
      FISHERFOLK: "Fisherfolk",
      AGRI_YOUTH: "Agricultural Youth",
    };
    return categoryMap[category] || category;
  };

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    farmerId: farmer.id,
    name: `${farmer.firstname} ${farmer.surname}`,
    generatedAt: new Date().toISOString(),
    profileUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/farmer/${farmer.id}`,
  });

  return (
    <>
      {/* Hide any navigation/breadcrumb elements */}
      <style jsx global>{`
        @media print {
          nav,
          .breadcrumb,
          .navigation,
          header:not(.document-header),
          .navbar {
            display: none !important;
          }
        }
        @media screen {
          .print-preview {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            background: white;
            min-height: 11in;
            width: 1600px;
            margin: 2rem auto;
            padding: 0.5in 0.4in;
          }
        }
      `}</style>

      {/* Action Buttons */}
      {showActions && (
        <div className="no-print fixed top-4 right-4 z-50 flex space-x-4">
          <button
            onClick={() => handlePrint()}
            className="flex transform items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>Print Profile</span>
          </button>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 print:bg-white">
        <div ref={printRef} className="print-container print-preview">
          {/* Enhanced Header with QR Code */}
          <div className="header-section document-header keep-with-next mb-6 pb-4">
            <div className="flex items-start justify-between">
                             <QRCodeCanvas value={String(farmer.id)} size={70} />

              <div className="flex-1 text-center">

                <h1 className="mb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  FARMER REGISTRATION PROFILE
                </h1>

                <div className="mx-auto mb-3 h-1 w-32 bg-green-500 print:bg-black"></div>
                <p className="text-xs font-medium tracking-wide text-gray-600 uppercase">
                  Republic of the Philippines | Department of Agriculture
                </p>
              </div>
              <div className="ml-6 text-center">
                <div className="mb-1 rounded-lg border-2 border-gray-300 p-1">
                  <QRCodeCanvas value={qrCodeData} size={60} />
                </div>
                <p className="text-xs text-gray-500">Profile QR</p>
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <section className="compact-section keep-together mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              I. BASIC INFORMATION
            </h2>
            <div className="space-y-4">
              {/* Personal Details */}
              <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Full Name:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.surname}, {farmer.firstname} {farmer.middleName}{" "}
                      {farmer.extensionName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="mb-1 font-medium text-gray-700">
                        Sex:
                      </span>
                      <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {farmer.sex}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 font-medium text-gray-700">
                        Civil Status:
                      </span>
                      <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {formatCivilStatus(farmer.civilStaus)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Date of Birth:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.dateOfBirth.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Username:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.username}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Place of Birth:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.placeOfBirth}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Highest Education:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {formatEducationLevel(farmer.highestFormOfEducation)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Religion:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.religion || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Category Type:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {formatCategoryType(farmer.categoryType)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Family Background */}
              <div className="avoid-break">
                <h3 className="mb-2 border-l-4 border-blue-500 pl-3 text-base font-semibold text-gray-800">
                  Family Background
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Fathers Name:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.fathersName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Mothers Name:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.mothersName || "N/A"}
                    </span>
                  </div>
                  {farmer.nameOfSpouse && (
                    <div className="flex flex-col">
                      <span className="mb-1 font-medium text-gray-700">
                        Spouse Name:
                      </span>
                      <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {farmer.nameOfSpouse}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      4Ps Beneficiary:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.FourPS_Benificiaty || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="avoid-break">
                <h3 className="mb-2 border-l-4 border-purple-500 pl-3 text-base font-semibold text-gray-800">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Contact Number:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.contactNumber}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Email Address:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.email_address || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Emergency Contact:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.personToContactIncaseOfEmerceny || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Emergency Contact Number:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.personContactNumberIncaseOfEmergency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="avoid-break">
                <h3 className="mb-2 border-l-4 border-orange-500 pl-3 text-base font-semibold text-gray-800">
                  Documents & Images
                </h3>
                <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                  <div className="text-center">
                    <p className="mb-2 text-xs font-medium text-gray-700">
                      Government ID
                    </p>
                    <div className="relative h-20 w-32 overflow-hidden rounded-lg border-2 border-gray-300 shadow-sm">
                      <Image
                        src={farmer.govermentId}
                        alt="Government ID"
                        fill
                        className="object-cover"
                        sizes="128px"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="mb-2 text-xs font-medium text-gray-700">
                      Farmer Photo
                    </p>
                    <div className="relative h-20 w-32 overflow-hidden rounded-lg border-2 border-gray-300 shadow-sm">
                      <Image
                        src={farmer.farmerImage}
                        alt="Farmer"
                        fill
                        className="object-cover"
                        sizes="128px"
                        unoptimized
                      />
                    </div>
                  </div>
                  {farmer.farmerSignatureAsImage && (
                    <div className="text-center">
                      <p className="mb-2 text-xs font-medium text-gray-700">
                        Signature
                      </p>
                      <div className="relative h-20 w-32 overflow-hidden rounded-lg border-2 border-gray-300 shadow-sm">
                        <Image
                          src={
                            farmer.farmerSignatureAsImage || "/placeholder.svg"
                          }
                          alt="Signature"
                          fill
                          className="object-cover"
                          sizes="128px"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                  {farmer.farmerFingerPrintAsImage && (
                    <div className="text-center">
                      <p className="mb-2 text-xs font-medium text-gray-700">
                        Fingerprint
                      </p>
                      <div className="relative h-20 w-32 overflow-hidden rounded-lg border-2 border-gray-300 shadow-sm">
                        <Image
                          src={farmer.farmerFingerPrintAsImage}
                          alt="Fingerprint"
                          fill
                          className="object-cover"
                          sizes="128px"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section className="compact-section avoid-break mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              II. ADDRESS
            </h2>
            <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col">
                <span className="mb-1 font-medium text-gray-700">
                  House/Lot/Building No:
                </span>
                <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.houseOrLotOrBuildingNo}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 font-medium text-gray-700">
                  Street/Sitio/Subdivision:
                </span>
                <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.streetOrSitioOrSubDivision}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 font-medium text-gray-700">
                  Barangay:
                </span>
                <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.barangay}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 font-medium text-gray-700">
                  Municipality/City:
                </span>
                <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.municipalityOrCity}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 font-medium text-gray-700">
                  Province:
                </span>
                <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.province}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 font-medium text-gray-700">Region:</span>
                <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.region}
                </span>
              </div>
            </div>
          </section>

          {/* Income Section */}
          <section className="compact-section avoid-break mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              III. INCOME INFORMATION
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-green-50 p-3 print:border print:border-gray-300 print:bg-transparent">
                <h3 className="mb-1 text-sm font-semibold text-green-800">
                  Farming Income
                </h3>
                <p className="text-lg font-bold text-green-900">
                  ₱{farmer.grossAnualIncomeLastYearFarming.toLocaleString()}
                </p>
                <p className="text-xs text-green-700">Gross Annual Income</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 print:border print:border-gray-300 print:bg-transparent">
                <h3 className="mb-1 text-sm font-semibold text-blue-800">
                  Non-Farming Income
                </h3>
                <p className="text-lg font-bold text-blue-900">
                  ₱{farmer.grossAnualIncomeLastYeaNonFarming.toLocaleString()}
                </p>
                <p className="text-xs text-blue-700">Gross Annual Income</p>
              </div>
            </div>
          </section>

          {/* Household Information */}
          {farmer.houseHead && (
            <section className="compact-section avoid-break mb-6">
              <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
                IV. HOUSEHOLD INFORMATION
              </h2>
              <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Household Head:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.houseHead.houseHoldHead}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Relationship:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.houseHead.relationship}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Total Household Members:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.houseHead.numberOfLivingHouseHoldMembersTotal}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Male:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.houseHead.numberOfMale}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Female:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.houseHead.NumberOfFemale}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Category-Specific Details */}
          {farmer.farmerDetails && (
            <section className="compact-section avoid-break mb-6">
              <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. FARMER DETAILS
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Rice:</span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.farmerDetails.rice
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.rice ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Corn:</span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.farmerDetails.corn
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.corn ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">
                      Livestock:
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.farmerDetails.livestock
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.livestock ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Poultry:</span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.farmerDetails.poultry
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.poultry ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                {farmer.farmerDetails.othersCrops && (
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Other Crops:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.farmerDetails.othersCrops}
                    </span>
                  </div>
                )}
                {farmer.farmerDetails.livestockDetails && (
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Livestock Details:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.farmerDetails.livestockDetails}
                    </span>
                  </div>
                )}
                {farmer.farmerDetails.poultryDetails && (
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Poultry Details:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.farmerDetails.poultryDetails}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {farmer.farmworkerDetails && (
            <section className="compact-section avoid-break mb-6">
              <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. FARM WORKER DETAILS
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Land Preparation:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.farmworkerDetails.landPreparation
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.landPreparation ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Planting/Transplanting:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.farmworkerDetails.plantingTransplanting
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.plantingTransplanting
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Cultivation:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.farmworkerDetails.cultivation
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.cultivation ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Harvesting:</span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.farmworkerDetails.harvesting
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.harvesting ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {farmer.farmworkerDetails.others && (
                <div className="mt-3 flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Others:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.farmworkerDetails.others}
                  </span>
                </div>
              )}
            </section>
          )}

          {farmer.fisherfolkDetails && (
            <section className="compact-section avoid-break mb-6">
              <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. FISHERFOLK DETAILS
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-5">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Fish Capture:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.fisherfolkDetails.fishCapture
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.fishCapture ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Aquaculture:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.fisherfolkDetails.aquaculture
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.aquaculture ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Gleaning:</span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.fisherfolkDetails.gleaning
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.gleaning ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Fish Processing:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.fisherfolkDetails.fishProcessing
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.fishProcessing ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Fish Vending:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.fisherfolkDetails.fishVending
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.fishVending ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {farmer.fisherfolkDetails.others && (
                <div className="mt-3 flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Others:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.fisherfolkDetails.others}
                  </span>
                </div>
              )}
            </section>
          )}

          {farmer.AGRI_YOUTH && farmer.AGRI_YOUTH.length > 0 && (
            <section className="compact-section avoid-break mb-6">
              <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. AGRICULTURAL YOUTH DETAILS
              </h2>
              {farmer.AGRI_YOUTH.map((youth, index) => (
                <div
                  key={youth.id}
                  className="mb-4 rounded-lg border border-gray-300 p-3"
                >
                  <h3 className="mb-2 text-sm font-semibold text-gray-800">
                    Youth Record #{index + 1}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">
                        Part of Farming Household:
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          youth.partOfFarmingHouseHold
                            ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                            : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                        }`}
                      >
                        {youth.partOfFarmingHouseHold ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">
                        Formal Agri/Fishery:
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          youth.attendedFormalAgriFishery
                            ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                            : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                        }`}
                      >
                        {youth.attendedFormalAgriFishery ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">
                        Non-Formal Agri/Fishery:
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          youth.attendedNonFormalAgriFishery
                            ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                            : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                        }`}
                      >
                        {youth.attendedNonFormalAgriFishery ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  {youth.others && (
                    <div className="mt-2 flex flex-col">
                      <span className="mb-1 font-medium text-gray-700">
                        Others:
                      </span>
                      <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {youth.others}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Farm Details Section */}
          {farmer.farmDetails && farmer.farmDetails.length > 0 && (
            <section className="mb-6">
              <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
                VI. FARM DETAILS ({farmer.numberOfFarms} Farm
                {farmer.numberOfFarms !== 1 ? "s" : ""})
              </h2>
              <div className="space-y-4">
                {farmer.farmDetails.map((farm, index) => (
                  <div
                    key={farm.id}
                    className="avoid-break rounded-lg border border-gray-300 bg-white p-3 shadow-sm print:shadow-none"
                  >
                    <div className="mb-3">
                      <h3 className="border-b border-gray-200 pb-1 text-base font-semibold text-gray-800">
                        Farm #{index + 1}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="mb-1 font-medium text-gray-700">
                            Location:
                          </span>
                          <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                            {farm.Location}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-1 font-medium text-gray-700">
                            Total Farm Area (Ha):
                          </span>
                          <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                            {farm.TotalFarmAreaInHa} hectares
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-1 font-medium text-gray-700">
                            Owner Documents Number:
                          </span>
                          <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                            {farm.OwnerDocumentsNumber}
                          </span>
                        </div>
                        {farm.ownerName && (
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Owner Name:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {farm.ownerName}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-700">
                            Ancestral Domain:
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              farm.withAncestordomain
                                ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                                : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                            }`}
                          >
                            {farm.withAncestordomain ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-700">
                            Agrarian Reform:
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              farm.agrarianReform
                                ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                                : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                            }`}
                          >
                            {farm.agrarianReform ? "Yes" : "No"}
                          </span>
                        </div>
                        {farm.teenantName && (
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Tenant Name:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {farm.teenantName}
                            </span>
                          </div>
                        )}
                        {farm.leeseName && (
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Lessee Name:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {farm.leeseName}
                            </span>
                          </div>
                        )}
                        {farm.others && (
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Others:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {farm.others}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remove the entire Lot Details section since it doesn't exist in your schema */}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* <div className="page-break mt-12 border-t-2 border-black pt-6">
            <div className="mb-8 text-center">
              <p className="mb-1 text-base font-semibold text-gray-800">
                Document Generated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-600 italic">
                This document contains confidential agricultural information.
                Handle with care.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="text-center">
                <div className="mb-3 flex h-12 items-end justify-center border-b-2 border-black">
                  <span className="pb-1 text-xs text-gray-400">
                    (Signature)
                  </span>
                </div>
                <div className="mb-1 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Thumbmark</span>
                </div>
                <p className="mb-2 text-base font-bold text-gray-800">
                  FARMERS SIGNATURE
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-xs font-medium text-gray-700">
                    Date:
                  </span>
                  <div className="h-4 w-24 border-b border-black"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="mb-3 flex h-12 items-end justify-center border-b-2 border-black">
                  <span className="pb-1 text-xs text-gray-400">
                    (Signature)
                  </span>
                </div>
                <p className="mb-2 text-base font-bold text-gray-800">
                  AUTHORIZED OFFICER
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-xs font-medium text-gray-700">
                    Date:
                  </span>
                  <div className="h-4 w-24 border-b border-black"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              <p>Republic of the Philippines | Department of Agriculture</p>
              <p>Farmer Registration Profile - Official Document</p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default FarmerProfilePrintGenerator;
// Add to your style jsx
<style jsx global>{`
  @media print {
    .keep-with-next {
      page-break-after: avoid;
      break-after: avoid-page;
    }
    .keep-together {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-header {
      page-break-after: avoid;
    }
    /* Reduce header size if needed */
    .header-section {
      padding: 0.2in 0;
      margin-bottom: 0.1in;
    }
  }
`}</style>;
