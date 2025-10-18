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
        .py-1 {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }
        .py-2 {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
        .px-1 {
          padding-left: 4px !important;
          padding-right: 4px !important;
        }
        .px-2 {
          padding-left: 8px !important;
          padding-right: 8px !important;
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
          max-height: 50px !important;
          object-fit: cover !important;
        }
        .image-container {
          height: 50px !important;
          width: 70px !important;
        }
        h1, h2, h3 {
          page-break-after: avoid !important;
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

  // Helper function to render commodity section - made more compact
  const renderCommoditySection = (
    commodity: CommodityData | null,
    title: string,
  ) => {
    if (!commodity) return null;

    return (
      <div className="avoid-break compact-spacing mb-2">
        <h3 className="mb-1 border-l-2 border-green-500 pl-2 text-sm font-semibold text-gray-800">
          {title}
        </h3>
        <div className="ml-4 rounded bg-gray-50 p-2 print:border print:border-gray-300 print:bg-transparent">
          <div className="grid grid-cols-3 gap-1 text-xs">
            <p>
              <span className="font-medium text-gray-700">Name:</span>{" "}
              {commodity.name}
            </p>
            <p>
              <span className="font-medium text-gray-700">Size:</span>{" "}
              {commodity.sizeInHa} ha
            </p>
            <p>
              <span className="font-medium text-gray-700">Volume:</span>{" "}
              {commodity.annualVolumeInKG.toLocaleString()} kg
            </p>
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

      <div className="min-h-screen bg-gray-200 print:bg-white">
        <div
          ref={printRef}
          className="print-container print-preview"
          style={{
            breakInside: "avoid",
            breakAfter: "avoid",
            breakBefore: "avoid",
          }}
        >
          {/* Compact Header with QR Code */}
          <div className="header-section document-header avoid-break mb-4 pb-2">
            <div className="flex items-start justify-between">
              <QRCodeCanvas value={String(farmer.id)} size={50} />
              <div className="flex-1 text-center">
                <h1 className="avoid-break mb-1 text-xl font-bold text-gray-900">
                  ORGANIC FARMER PROFILE
                </h1>
                <div className="avoid-break mx-auto mb-2 h-1 w-24 bg-green-500 print:bg-black"></div>
                <p className="avoid-break text-xs font-medium tracking-wide text-gray-600 uppercase">
                  Republic of the Philippines | Department of Agriculture
                </p>
              </div>
              <div className="avoid-break ml-4 text-center">
                <div className="mb-1 rounded border border-gray-300 p-1">
                  <QRCodeCanvas value={qrCodeData} size={40} />
                </div>
                <p className="text-xs text-gray-500">Profile QR</p>
              </div>
            </div>
          </div>

          {/* Basic Information Section - Made more compact */}
          <section className="compact-section avoid-break mb-4">
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
                        {farmer.civilStaus}
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

              {/* Education and Religion in single row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    Highest Education:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.highestFormOfEducation}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-0.5 font-medium text-gray-700">
                    4Ps Beneficiary:
                  </span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.FourPS_Benificiaty || "N/A"}
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
                      {farmer.personContactNumberIncaseOfEmergency || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents - Smaller images */}
              <div className="avoid-break">
                <h3 className="mb-1 border-l-2 border-orange-500 pl-2 text-sm font-semibold text-gray-800">
                  Documents
                </h3>
                <div className="flex flex-wrap justify-start gap-2">
                  {farmer.govermentId && (
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
                          sizes="70px"
                        />
                      </div>
                    </div>
                  )}
                  {farmer.farmerImage && (
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
                          sizes="70px"
                        />
                      </div>
                    </div>
                  )}
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

          {/* Certification Section - Compact */}
          <section className="compact-section avoid-break mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              IV. CERTIFICATION
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">
                  Organic Certification:
                </span>
                <span
                  className={`rounded px-1 py-0.5 text-xs font-medium ${
                    farmer.withOrganicAgricultureCertification
                      ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                      : "bg-red-100 text-red-800 print:border print:border-red-600 print:bg-transparent"
                  }`}
                >
                  {farmer.withOrganicAgricultureCertification ? "Yes" : "No"}
                </span>
              </div>
              {farmer.withOrganicAgricultureCertification && (
                <div className="ml-2 space-y-1">
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Certification Type:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.certification || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-medium text-gray-700">
                      Certification Stage:
                    </span>
                    <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                      {farmer.whatStagesInCertification || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Nature of Business Section - Compact */}
          <section className="compact-section avoid-break mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              V. NATURE OF BUSINESS
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Inputs:</span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.productionForInputs || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Food:</span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.productionForFood || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Processing:</span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.postHarvestAndProcessing || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Trading:</span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.tradingAndWholeSale || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Retailing:</span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.retailing || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">Warehouse:</span>
                  <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                    {farmer.WareHousing || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Target Market Section - Compact */}
          <section className="compact-section avoid-break mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              VI. TARGET MARKET
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Consumer:</span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.direcToConsumer
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.direcToConsumer ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Trader:</span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.trader
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.trader ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Retailer:</span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.retailer
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.retailer ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    Institutional:
                  </span>
                  <span
                    className={`rounded px-1 py-0.5 text-xs font-medium ${
                      farmer.institutionalBuyer
                        ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                        : "bg-gray-200 text-gray-600 print:border print:border-gray-400 print:bg-transparent"
                    }`}
                  >
                    {farmer.institutionalBuyer ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Agricultural Commodities Section - Made much more compact */}
          <section className="mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              VII. AGRICULTURAL COMMODITIES
            </h2>
            <div className="grid grid-cols-2 gap-1">
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
                "Industrial Crops",
              )}
              {renderCommoditySection(farmer.OtherCommodity, "Other Commodity")}
            </div>
            {farmer.othersCommodity && (
              <div className="avoid-break compact-spacing mt-2">
                <h3 className="mb-1 border-l-2 border-yellow-500 pl-2 text-sm font-semibold text-gray-800">
                  Additional Commodities
                </h3>
                <div className="ml-4 rounded bg-yellow-50 p-2 print:border print:border-yellow-300 print:bg-transparent">
                  <p className="text-xs text-gray-900">{farmer.othersCommodity}</p>
                </div>
              </div>
            )}
          </section>

          {/* Facilities Section - Made much more compact */}
          <section className="mb-4">
            <h2 className="section-header section-divider mb-3 rounded bg-gray-50 px-2 py-1 text-lg font-bold text-gray-900 print:bg-gray-100">
              VIII. OWNED/SHARED FACILITIES
            </h2>
            {farmer.ownSharedFacilities &&
            farmer.ownSharedFacilities.length > 0 ? (
              <div className="space-y-2">
                {farmer.ownSharedFacilities.map(
                  (facility: FacilityData, index: number) => (
                    <div
                      key={facility.id || index}
                      className="facility-card avoid-break rounded border border-gray-300 bg-white p-2"
                    >
                      <div className="mb-2">
                        <h3 className="border-b border-gray-200 pb-1 text-sm font-semibold text-gray-800">
                          Facility #{index + 1}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="space-y-1">
                          <div className="flex flex-col">
                            <span className="mb-0.5 font-medium text-gray-700">
                              Equipment:
                            </span>
                            <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.facilitiesMachineryEquipmentUsed}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="mb-0.5 font-medium text-gray-700">
                              Ownership:
                            </span>
                            <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.ownership}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-col">
                            <span className="mb-0.5 font-medium text-gray-700">
                              Quantity:
                            </span>
                            <span className="rounded bg-gray-50 px-1 py-0.5 text-gray-900 print:border-b print:border-gray-400 print:bg-transparent">
                              {facility.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-gray-700">
                              Organic:
                            </span>
                            <span
                              className={`rounded px-1 py-0.5 text-xs font-medium ${
                                facility.dedicatedToOrganic
                                  ? "bg-green-100 text-green-800 print:border print:border-green-600 print:bg-transparent"
                                  : "bg-red-100 text-red-800 print:border print:border-red-600 print:bg-transparent"
                              }`}
                            >
                              {facility.dedicatedToOrganic ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <div className="mb-1 text-xl">📦</div>
                <p className="text-xs">No facilities recorded</p>
              </div>
            )}
          </section>

          {/* Footer with generation date */}
          <div className="mt-4 border-t border-gray-300 pt-2 text-center">
            <p className="text-xs text-gray-600">
              Document Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerProfilePrintView;