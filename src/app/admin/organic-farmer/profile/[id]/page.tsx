"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

// Type definitions based on your Prisma schema
interface CommodityData {
  id: number;
  name: string;
  sizeInHa: number;
  annualVolumeInKG: number;
  Certification: string | null;
}

interface FacilityData {
  id: number;
  facilitiesMachineryEquipmentUsed: string;
  ownership: string;
  model: string;
  quantity: string;
  volumeServicesArea: string;
  averageWorkingHoursDay: string;
  Remarks: string | null;
  dedicatedToOrganic: boolean;
  organicFarmerId: number | null;
}

const FarmerProfilePrintView = () => {
  const [showActions, setShowActions] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const id = params.id;
  const {
    data: farmer,
    isLoading,
    error,
  } = api.organicFarmer.getLatestOrganicFarmer.useQuery({ id: Number(id) });

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
      break-before: always !important;
    }
    .page-break-after {
      page-break-after: always !important;
      break-after: always !important;
    }
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
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
      page-break-after: avoid !important;
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
    h1, h2, h3 {
      page-break-after: avoid !important;
    }
       body::after {
      display: none !important;
    }
    table, figure {
      page-break-inside: avoid !important;
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

  // Helper function to render commodity section
  const renderCommoditySection = (
    commodity: CommodityData | null,
    title: string,
  ) => {
    if (!commodity) return null;

    return (
      <div className="avoid-break compact-spacing mb-4">
        <h3 className="mb-2 border-l-4 border-green-500 pl-3 text-base font-semibold text-gray-800">
          {title}
        </h3>
        <div className="ml-6 rounded-lg bg-gray-50 p-3 print:border print:border-gray-300 print:bg-transparent">
          <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
            <p>
              <span className="font-medium text-gray-700">Name:</span>{" "}
              {commodity.name}
            </p>
            <p>
              <span className="font-medium text-gray-700">Size:</span>{" "}
              {commodity.sizeInHa} ha
            </p>
            <p>
              <span className="font-medium text-gray-700">Annual Volume:</span>{" "}
              {commodity.annualVolumeInKG.toLocaleString()} kg
            </p>
            {commodity.Certification && (
              <p>
                <span className="font-medium text-gray-700">
                  Certification:
                </span>{" "}
                {commodity.Certification}
              </p>
            )}
          </div>
        </div>
      </div>
    );
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
            width: 1500px;
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

      <div className="min-h-screen bg-gray-200 print:bg-white ">
        <div
          ref={printRef}
          className="print-container print-preview  "
          style={{
            breakInside: "avoid",
            breakAfter: "avoid",
            breakBefore: "avoid",
          }}
        >
          {/* Enhanced Header with QR Code */}
          {/* Enhanced Header with QR Code */}
          <div className="header-section document-header avoid-break mb-6 pb-4">
            <div className="flex items-start justify-between">
                 <QRCodeCanvas value={String(farmer.id)} size={70} />

              <div className="flex-1 text-center">
                <h1 className="avoid-break mb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  ORGANIC AGRICULTURE PROFILE
                </h1>
                <div className="avoid-break mx-auto mb-3 h-1 w-32 bg-green-500 print:bg-black"></div>
                <p className="avoid-break text-xs font-medium tracking-wide text-gray-600 uppercase">
                  Republic of the Philippines | Department of Agriculture
                </p>
              </div>
              <div className="avoid-break ml-6 text-center">
              
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <section
            className="compact-section avoid-break mb-6"
            style={{ pageBreakBefore: "avoid" }}
          >
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
                        {farmer.civilStaus}
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
                      {farmer.highestFormOfEducation}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
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
                        4Ps Beneficiary:
                      </span>
                      <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                        {farmer.FourPS_Benificiaty || "N/A"}
                      </span>
                    </div>
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
                      {farmer.personContactNumberIncaseOfEmergency || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="avoid-break">
                <h3 className="mb-2 border-l-4 border-orange-500 pl-3 text-base font-semibold text-gray-800">
                  Documents
                </h3>
                <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                  {farmer.govermentId && (
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
                        />
                      </div>
                    </div>
                  )}
                  {farmer.farmerImage && (
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

          {/* Certification Section */}
          <section className="compact-section avoid-break mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              IV. CERTIFICATION
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">
                  Organic Agriculture Certification:
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    farmer.withOrganicAgricultureCertification
                      ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                      : "bg-red-100 text-red-800 print:border print:border-red-600 print:bg-transparent"
                  }`}
                >
                  {farmer.withOrganicAgricultureCertification
                    ? "✓ Yes"
                    : "✗ No"}
                </span>
              </div>
              {farmer.withOrganicAgricultureCertification && (
                <div className="ml-4 space-y-2">
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Certification Type:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.certification || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 font-medium text-gray-700">
                      Certification Stage:
                    </span>
                    <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.whatStagesInCertification || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Nature of Business Section */}
          <section className="compact-section avoid-break mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              V. NATURE OF BUSINESS
            </h2>
            <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Production for Inputs:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.productionForInputs || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Production for Food:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.productionForFood || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Post Harvest & Processing:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.postHarvestAndProcessing || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Transport & Logistics:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.transPortAndLogistics || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Trading & Wholesale:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.tradingAndWholeSale || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Retailing:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.retailing || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Warehousing:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.WareHousing || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Others:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.Others || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Target Market Section */}
          <section className="compact-section avoid-break mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              VI. TARGET MARKET
            </h2>
            <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded bg-gray-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                  <span className="font-medium text-gray-700">
                    Direct to Consumer:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.direcToConsumer
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.direcToConsumer ? "Yes" : "No"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                    <span className="font-medium text-gray-700">Trader:</span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.trader
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.trader ? "Yes" : "No"}
                    </span>
                  </div>
                  {farmer.trader && farmer.specificType1 && (
                    <div className="ml-3 rounded bg-blue-50 p-1 print:border print:border-blue-300 print:bg-transparent">
                      <span className="text-xs text-blue-800">
                        <strong>Type:</strong> {farmer.specificType1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between rounded bg-gray-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                  <span className="font-medium text-gray-700">Retailer:</span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      farmer.retailer
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.retailer ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                    <span className="font-medium text-gray-700">
                      Institutional Buyer:
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.institutionalBuyer
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.institutionalBuyer ? "Yes" : "No"}
                    </span>
                  </div>
                  {(farmer.retailer || farmer.institutionalBuyer) &&
                    farmer.SpecificType2 && (
                      <div className="ml-3 rounded bg-blue-50 p-1 print:border print:border-blue-300 print:bg-transparent">
                        <span className="text-xs text-blue-800">
                          <strong>Type:</strong> {farmer.SpecificType2}
                        </span>
                      </div>
                    )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-2 print:border print:border-gray-300 print:bg-transparent">
                    <span className="font-medium text-gray-700">
                      International Buyers:
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        farmer.internationalBasedBuyers
                          ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                          : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                      }`}
                    >
                      {farmer.internationalBasedBuyers ? "Yes" : "No"}
                    </span>
                  </div>
                  {farmer.internationalBasedBuyers && farmer.SpecificType3 && (
                    <div className="ml-3 rounded bg-blue-50 p-1 print:border print:border-blue-300 print:bg-transparent">
                      <span className="text-xs text-blue-800">
                        <strong>Type:</strong> {farmer.SpecificType3}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 font-medium text-gray-700">
                    Others:
                  </span>
                  <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.others || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Agricultural Commodities Section */}
          <section className="mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              VII. AGRICULTURAL COMMODITIES
            </h2>
            <div className="space-y-3">
              {renderCommoditySection(farmer.Grains, "Grains")}
              {renderCommoditySection(
                farmer.LowlandVegetables,
                "Lowland Vegetables",
              )}
              {renderCommoditySection(
                farmer.UplandVegetables,
                "Upland Vegetables",
              )}
              {renderCommoditySection(farmer.FruitsAndNots, "Fruits and Nuts")}
              {renderCommoditySection(farmer.Mushroom, "Mushroom")}
              {renderCommoditySection(farmer.OrganicSoil, "Organic Soil")}
              {renderCommoditySection(farmer.Rootcrops, "Root Crops")}
              {renderCommoditySection(
                farmer.PultryProducts,
                "Poultry Products",
              )}
              {renderCommoditySection(
                farmer.LiveStockProducts,
                "Livestock Products",
              )}
              {renderCommoditySection(
                farmer.FisheriesAndAquaCulture,
                "Fisheries and Aquaculture",
              )}
              {renderCommoditySection(
                farmer.IndustrialCropsAndProducts,
                "Industrial Crops and Products",
              )}
              {renderCommoditySection(farmer.OtherCommodity, "Other Commodity")}
              {farmer.othersCommodity && (
                <div className="avoid-break compact-spacing mb-4">
                  <h3 className="mb-2 border-l-4 border-yellow-500 pl-3 text-base font-semibold text-gray-800">
                    Additional Commodities
                  </h3>
                  <div className="ml-6 rounded-lg bg-yellow-50 p-3 print:border print:border-yellow-300 print:bg-transparent">
                    <p className="text-xs text-gray-900">
                      {farmer.othersCommodity}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Facilities Section */}
          <section className="mb-6">
            <h2 className="section-header section-divider mb-4 rounded-lg bg-gray-50 px-3 py-2 text-lg font-bold text-gray-900 print:bg-gray-100">
              VIII. OWNED/SHARED FACILITIES
            </h2>
            {farmer.ownSharedFacilities &&
            farmer.ownSharedFacilities.length > 0 ? (
              <div className="space-y-4">
                {farmer.ownSharedFacilities.map(
                  (facility: FacilityData, index: number) => (
                    <div
                      key={facility.id || index}
                      className="facility-card avoid-break rounded-lg border border-gray-300 bg-white p-3 shadow-sm print:shadow-none"
                    >
                      <div className="mb-3">
                        <h3 className="border-b border-gray-200 pb-1 text-base font-semibold text-gray-800">
                          Facility #{index + 1}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Equipment:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.facilitiesMachineryEquipmentUsed}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Ownership:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.ownership}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Model:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.model}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Quantity:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Volume/Service Area:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.volumeServicesArea}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="mb-1 font-medium text-gray-700">
                              Working Hours/Day:
                            </span>
                            <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.averageWorkingHoursDay}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-700">
                              Dedicated to Organic:
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                facility.dedicatedToOrganic
                                  ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                                  : "bg-red-100 text-red-800 print:border print:border-red-600 print:bg-transparent"
                              }`}
                            >
                              {facility.dedicatedToOrganic ? "✓ Yes" : "✗ No"}
                            </span>
                          </div>
                          {facility.Remarks && (
                            <div className="flex flex-col">
                              <span className="mb-1 font-medium text-gray-700">
                                Remarks:
                              </span>
                              <span className="rounded bg-gray-50 px-2 py-1 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                                {facility.Remarks}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <div className="mb-2 text-2xl">📦</div>
                <p className="text-sm">No facilities recorded</p>
              </div>
            )}
          </section>

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
              <p>Organic Agriculture Profile - Official Document</p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default FarmerProfilePrintView;
