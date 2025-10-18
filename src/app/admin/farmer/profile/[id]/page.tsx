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
  const id = params.id;
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
    pageStyle: `
      @page {
        size: 8.5in 11in;
        margin: 0.25in 0.2in 0.25in 0.2in;
      }
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 8pt !important;
          line-height: 1.1 !important;
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
          font-size: 9pt !important;
          padding: 4px 8px !important;
          margin-bottom: 8px !important;
        }
        .header-section {
          border-bottom: 1px solid #000 !important;
          margin-bottom: 12px !important;
          padding-bottom: 8px !important;
        }
        .section-divider {
          border-bottom: 1px solid #ccc !important;
        }
        .compact-spacing {
          margin-bottom: 6px !important;
        }
        .compact-section {
          margin-bottom: 12px !important;
        }
        .text-xs {
          font-size: 7pt !important;
        }
        .text-sm {
          font-size: 8pt !important;
        }
        .text-base {
          font-size: 9pt !important;
        }
        .text-lg {
          font-size: 10pt !important;
        }
        .text-xl {
          font-size: 11pt !important;
        }
        .text-2xl {
          font-size: 12pt !important;
        }
        .grid-cols-1 {
          grid-template-columns: 1fr !important;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        .grid-cols-3 {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        .grid-cols-4 {
          grid-template-columns: repeat(4, 1fr) !important;
        }
        .grid-cols-5 {
          grid-template-columns: repeat(5, 1fr) !important;
        }
        .gap-1 {
          gap: 4px !important;
        }
        .gap-2 {
          gap: 8px !important;
        }
        .gap-3 {
          gap: 12px !important;
        }
        .gap-4 {
          gap: 16px !important;
        }
        .p-1 {
          padding: 4px !important;
        }
        .p-2 {
          padding: 8px !important;
        }
        .p-3 {
          padding: 12px !important;
        }
        .p-4 {
          padding: 16px !important;
        }
        .py-1 {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }
        .py-2 {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
        .px-2 {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }
        .px-3 {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
        .mb-1 {
          margin-bottom: 4px !important;
        }
        .mb-2 {
          margin-bottom: 8px !important;
        }
        .mb-3 {
          margin-bottom: 12px !important;
        }
        .mb-4 {
          margin-bottom: 16px !important;
        }
        .mb-6 {
          margin-bottom: 24px !important;
        }
        .mt-2 {
          margin-top: 8px !important;
        }
        .mt-3 {
          margin-top: 12px !important;
        }
        .space-y-2 > * + * {
          margin-top: 8px !important;
        }
        .space-y-3 > * + * {
          margin-top: 12px !important;
        }
        .space-y-4 > * + * {
          margin-top: 16px !important;
        }
        img {
          max-height: 60px !important;
          object-fit: cover !important;
        }
        .image-container {
          height: 60px !important;
          width: 80px !important;
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
            padding: 0.25in 0.2in;
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
          {/* Compact Header with QR Code */}
          <div className="header-section document-header keep-with-next mb-4 pb-2">
            <div className="flex items-start justify-between">
              <QRCodeCanvas value={String(farmer.id)} size={50} />
              <div className="flex-1 text-center">
                <h1 className="mb-1 text-xl font-bold text-gray-900">
                  FARMER REGISTRATION PROFILE
                </h1>
                <div className="mx-auto mb-2 h-1 w-24 bg-green-500 print:bg-black"></div>
                <p className="text-xs font-medium tracking-wide text-gray-600 uppercase">
                  Republic of the Philippines | Department of Agriculture
                </p>
              </div>
              <div className="ml-4 text-center">
                <div className="mb-1 rounded border border-gray-300 p-1">
                  <QRCodeCanvas value={qrCodeData} size={40} />
                </div>
                <p className="text-xs text-gray-500">Profile QR</p>
              </div>
            </div>
          </div>

          {/* Basic Information Section - Made more compact */}
          <section className="compact-section keep-together mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              I. BASIC INFORMATION
            </h2>
            <div className="space-y-3">
              {/* Personal Details in tighter grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Full Name:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.surname}, {farmer.firstname} {farmer.middleName}{" "}
                      {farmer.extensionName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex flex-col">
                      <span className="mb-0.5 font-medium text-gray-700">
                        Sex:
                      </span>
                      <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {farmer.sex}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-0.5 font-medium text-gray-700">
                        Civil Status:
                      </span>
                      <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {formatCivilStatus(farmer.civilStaus)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Date of Birth:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.dateOfBirth.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Place of Birth:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.placeOfBirth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Education and Category in single row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    Highest Education:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {formatEducationLevel(farmer.highestFormOfEducation)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    Category Type:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {formatCategoryType(farmer.categoryType)}
                  </span>
                </div>
              </div>

              {/* Family Background - Compact */}
              <div className="avoid-break">
                <h3 className="mb-1 border-l-2 border-blue-500 pl-2 text-sm font-semibold text-gray-800">
                  Family Background
                </h3>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Father's Name:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.fathersName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Mother's Name:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.mothersName || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information - Compact */}
              <div className="avoid-break">
                <h3 className="mb-1 border-l-2 border-purple-500 pl-2 text-sm font-semibold text-gray-800">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Contact Number:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.contactNumber}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Emergency Contact:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.personContactNumberIncaseOfEmergency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents - Smaller images */}
              <div className="avoid-break">
                <h3 className="mb-1 border-l-2 border-orange-500 pl-2 text-sm font-semibold text-gray-800">
                  Documents & Images
                </h3>
                <div className="flex flex-wrap justify-start gap-2">
                  <div className="text-center">
                    <p className="mb-1 text-xs font-medium text-gray-700">
                      Gov't ID
                    </p>
                    <div className="image-container relative overflow-hidden rounded border border-gray-300 shadow-sm">
                      <Image
                        src={farmer.govermentId}
                        alt="Government ID"
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-xs font-medium text-gray-700">
                      Photo
                    </p>
                    <div className="image-container relative overflow-hidden rounded border border-gray-300 shadow-sm">
                      <Image
                        src={farmer.farmerImage}
                        alt="Farmer"
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Address Section - More compact */}
          <section className="compact-section avoid-break mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              II. ADDRESS
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex flex-col">
                <span className="mb-0.5 font-medium text-gray-700">
                  House/Lot/Building No:
                </span>
                <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.houseOrLotOrBuildingNo}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 font-medium text-gray-700">
                  Street/Sitio/Subdivision:
                </span>
                <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.streetOrSitioOrSubDivision}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 font-medium text-gray-700">
                  Barangay:
                </span>
                <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.barangay}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 font-medium text-gray-700">
                  Municipality/City:
                </span>
                <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.municipalityOrCity}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 font-medium text-gray-700">
                  Province:
                </span>
                <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.province}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 font-medium text-gray-700">Region:</span>
                <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                  {farmer.region}
                </span>
              </div>
            </div>
          </section>

          {/* Income Section - Compact */}
          <section className="compact-section avoid-break mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              III. INCOME INFORMATION
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-green-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                <h3 className="mb-0.5 text-sm font-semibold text-green-800">
                  Farming Income
                </h3>
                <p className="text-base font-bold text-green-900">
                  ₱{farmer.grossAnualIncomeLastYearFarming.toLocaleString()}
                </p>
              </div>
              <div className="rounded bg-blue-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                <h3 className="mb-0.5 text-sm font-semibold text-blue-800">
                  Non-Farming Income
                </h3>
                <p className="text-base font-bold text-blue-900">
                  ₱{farmer.grossAnualIncomeLastYeaNonFarming.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Household Information - Compact */}
          {farmer.houseHead && (
            <section className="compact-section avoid-break mb-4">
              <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
                IV. HOUSEHOLD INFORMATION
              </h2>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    Household Head:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.houseHead.houseHoldHead}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    Relationship:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.houseHead.relationship}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    Total Members:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.houseHead.numberOfLivingHouseHoldMembersTotal}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Male:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.houseHead.numberOfMale}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Female:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.houseHead.NumberOfFemale}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Category-Specific Details - Made more compact */}
          {farmer.farmerDetails && (
            <section className="compact-section avoid-break mb-4">
              <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. FARMER DETAILS
              </h2>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-700">Rice:</span>
                    <span
                      className={`rounded px-1 py-0.5 text-xs font-medium ${
                        farmer.farmerDetails.rice
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.rice ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-700">Corn:</span>
                    <span
                      className={`rounded px-1 py-0.5 text-xs font-medium ${
                        farmer.farmerDetails.corn
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.corn ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-700">
                      Livestock:
                    </span>
                    <span
                      className={`rounded px-1 py-0.5 text-xs font-medium ${
                        farmer.farmerDetails.livestock
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.farmerDetails.livestock ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-700">Poultry:</span>
                    <span
                      className={`rounded px-1 py-0.5 text-xs font-medium ${
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
                  <div className="flex flex-col text-xs">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Other Crops:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.farmerDetails.othersCrops}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {farmer.farmworkerDetails && (
            <section className="compact-section avoid-break mb-4">
              <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. FARM WORKER DETAILS
              </h2>
              <div className="grid grid-cols-4 gap-1 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">
                    Land Prep:
                  </span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.farmworkerDetails.landPreparation
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.landPreparation ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">
                    Planting:
                  </span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
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
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">
                    Cultivation:
                  </span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.farmworkerDetails.cultivation
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.cultivation ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Harvest:</span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.farmworkerDetails.harvesting
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.farmworkerDetails.harvesting ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </section>
          )}

          {farmer.fisherfolkDetails && (
            <section className="compact-section avoid-break mb-4">
              <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
                V. FISHERFOLK DETAILS
              </h2>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">
                    Fish Capture:
                  </span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.fisherfolkDetails.fishCapture
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.fishCapture ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">
                    Aquaculture:
                  </span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.fisherfolkDetails.aquaculture
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.aquaculture ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Gleaning:</span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.fisherfolkDetails.gleaning
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.fisherfolkDetails.gleaning ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Farm Details Section - Made much more compact */}
          {farmer.farmDetails && farmer.farmDetails.length > 0 && (
            <section className="mb-4">
              <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
                VI. FARM DETAILS ({farmer.numberOfFarms} Farm
                {farmer.numberOfFarms !== 1 ? "s" : ""})
              </h2>
              <div className="space-y-2">
                {farmer.farmDetails.map((farm, index) => (
                  <div
                    key={farm.id}
                    className="avoid-break rounded border border-gray-300 bg-white p-2"
                  >
                    <div className="mb-2">
                      <h3 className="border-b border-gray-200 pb-1 text-sm font-semibold text-gray-800">
                        Farm #{index + 1}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="space-y-1">
                        <div className="flex flex-col">
                          <span className="mb-0.5 font-medium text-gray-700">
                            Location:
                          </span>
                          <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                            {farm.Location}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-0.5 font-medium text-gray-700">
                            Area (Ha):
                          </span>
                          <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                            {farm.TotalFarmAreaInHa} ha
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">
                            Agrarian Reform:
                          </span>
                          <span
                            className={`rounded px-1 py-0.5 text-xs font-medium ${
                              farm.agrarianReform
                                ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                                : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                            }`}
                          >
                            {farm.agrarianReform ? "Yes" : "No"}
                          </span>
                        </div>
                        {farm.ownerName && (
                          <div className="flex flex-col">
                            <span className="mb-0.5 font-medium text-gray-700">
                              Owner:
                            </span>
                            <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {farm.ownerName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer with generation date */}
          <div className="mt-6 border-t border-gray-300 pt-2 text-center">
            <p className="text-xs text-gray-600">
              Document Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerProfilePrintGenerator;