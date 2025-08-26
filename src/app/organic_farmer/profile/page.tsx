'use client'
import React from 'react'
import { useAuthStore } from '~/app/store/authStore'
import { api } from '~/trpc/react'
import { User, Phone, Mail, MapPin, Calendar, Users, DollarSign, Award, ShoppingCart, Wheat, Factory } from 'lucide-react'
import Image from 'next/image'

const FarmerProfile = () => {
  const farmerId = useAuthStore((state) => state?.user?.id)
  
  const {
    data: farmer,
    isLoading,
    error,
  } = api.organicFarmersData.getOrganicFarmerById.useQuery({ id: farmerId ?? 0 }, { enabled: !!farmerId })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcfefc] to-green-50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00a06a] border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcfefc] to-green-50 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold">Error</h3>
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcfefc] to-green-50 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold">?</span>
              </div>
              <div>
                <h3 className="font-semibold">No Data Found</h3>
                <p>No farmer data found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if it's an organic farmer
  const isOrganicFarmer = 'withOrganicAgricultureCertification' in farmer;

  const ProfileImagePlaceholder = () => (
    <div className="w-48 h-48 rounded-full border-4 border-[#00a06a] bg-gradient-to-br from-green-100 to-[#00a06a]/10 flex items-center justify-center">
      <User className="w-24 h-24 text-[#00a06a]/60" />
    </div>
  )

  const InfoCard = ({ title, children, icon: Icon, highlight = false }:any) => (
    <div className={`backdrop-blur-sm shadow-lg rounded-2xl p-6 mb-6 border hover:shadow-xl transition-all duration-300 ${
      highlight 
        ? 'bg-gradient-to-r from-[#00a06a]/10 to-[#00a06a]/5 border-[#00a06a]/20' 
        : 'bg-white/80 border-[#00a06a]/10'
    }`}>
      <div className="flex items-center mb-4">
        {Icon && <Icon className={`w-6 h-6 mr-3 ${highlight ? 'text-[#00a06a]' : 'text-[#00a06a]'}`} />}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  )

  const StatusBadge = ({ status, type = 'status' }:any) => {
    const getStatusStyles = () => {
      if (type === 'status') {
        switch (status) {
          case 'REGISTERED':
            return 'bg-[#00a06a] text-white shadow-lg'
          case 'APPLICANTS':
            return 'bg-yellow-500 text-white shadow-lg'
          default:
            return 'bg-red-500 text-white shadow-lg'
        }
      } else if (type === 'organic') {
        return 'bg-gradient-to-r from-[#00a06a] to-green-600 text-white shadow-lg'
      } else {
        return 'bg-blue-500 text-white shadow-lg'
      }
    }

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyles()}`}>
        {status}
      </span>
    )
  }

  const CommodityCard = ({ title, commodity }:any) => (
    <div className="bg-[#fcfefc] border border-[#00a06a]/20 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center mb-3">
        <Wheat className="w-5 h-5 text-[#00a06a] mr-2" />
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Size:</span> {commodity.sizeInHa} ha</p>
        <p><span className="font-medium">Annual Volume:</span> {commodity.annualVolumeInKG} kg</p>
        {commodity.Certification && <p><span className="font-medium">Certification:</span> {commodity.Certification}</p>}
      </div>
    </div>
  )

  const BooleanIndicator = ({ label, value }:any) => (
    <div className="flex items-center justify-between p-3 bg-[#fcfefc] rounded-lg border border-[#00a06a]/20">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        value ? 'bg-[#00a06a] text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcfefc] via-green-50 to-[#fcfefc]">
      <div className=" p-4 ">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {isOrganicFarmer ? 'Organic Farmer Profile' : 'Farmer Profile'}
          </h1>
          <div className="w-24 h-1 bg-[#00a06a] mx-auto rounded-full"></div>
        </div>
        
        {/* Profile Header */}
        <InfoCard highlight={isOrganicFarmer}>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {farmer.farmerImage ? (
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#00a06a] shadow-xl">
                <Image 
                  src={farmer.farmerImage} 
                  alt="Farmer Profile" 
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <ProfileImagePlaceholder />
            )}
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {farmer.firstname} {farmer.middleName} {farmer.surname} {farmer.extensionName}
              </h2>
              <p className="text-lg text-[#00a06a] font-semibold mb-4">@{farmer.username}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <StatusBadge status={farmer.status} />
                {isOrganicFarmer && (
                  <StatusBadge status="ORGANIC FARMER" type="organic" />
                )}
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Personal Information */}
        <InfoCard title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 text-[#00a06a] mr-2" />
                <span className="font-semibold text-gray-700 mr-2">Full Name:</span>
                <span className="text-gray-600">{farmer.firstname} {farmer.middleName} {farmer.surname} {farmer.extensionName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 mr-2">Gender:</span>
                <span className="text-gray-600">{farmer.sex}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-[#00a06a] mr-2" />
                <span className="font-semibold text-gray-700 mr-2">Date of Birth:</span>
                <span className="text-gray-600">{new Date(farmer.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-[#00a06a] mr-2" />
                <span className="font-semibold text-gray-700 mr-2">Place of Birth:</span>
                <span className="text-gray-600">{farmer.placeOfBirth}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 mr-2">Civil Status:</span>
                <span className="text-gray-600">{farmer.civilStaus}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-[#00a06a] mr-2" />
                <span className="font-semibold text-gray-700 mr-2">Contact:</span>
                <span className="text-gray-600">{farmer.contactNumber}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-[#00a06a] mr-2" />
                <span className="font-semibold text-gray-700 mr-2">Email:</span>
                <span className="text-gray-600">{farmer.email_address || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 mr-2">Education:</span>
                <span className="text-gray-600">{farmer.highestFormOfEducation}</span>
              </div>
              {farmer.religion && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Religion:</span>
                  <span className="text-gray-600">{farmer.religion}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 mr-2">Government ID:</span>
                <span className="text-gray-600">{farmer.govermentId}</span>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Address Information */}
        <InfoCard title="Address Information" icon={MapPin}>
          <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20">
            <p className="text-gray-700">
              <span className="font-semibold">Complete Address:</span>{' '}
              {farmer.houseOrLotOrBuildingNo} {farmer.streetOrSitioOrSubDivision}, {farmer.barangay}, {farmer.municipalityOrCity}, {farmer.province}, {farmer.region}
            </p>
          </div>
        </InfoCard>

        {/* Family Information */}
        <InfoCard title="Family Information" icon={Users}>
          <div className="space-y-3">
            {farmer.mothersName && (
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 mr-2">Mothers Name:</span>
                <span className="text-gray-600">{farmer.mothersName}</span>
              </div>
            )}
            {farmer.fathersName && (
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 mr-2">Fathers Name:</span>
                <span className="text-gray-600">{farmer.fathersName}</span>
              </div>
            )}
            {farmer.personToContactIncaseOfEmerceny && (
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 mr-2">Emergency Contact:</span>
                <span className="text-gray-600">{farmer.personToContactIncaseOfEmerceny} ({farmer.personContactNumberIncaseOfEmergency})</span>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Income Information */}
        <InfoCard title="Income Information" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-[#00a06a]/10 to-[#00a06a]/5 p-4 rounded-xl border border-[#00a06a]/20">
              <h3 className="font-semibold text-[#00a06a] mb-2">Farming Income</h3>
              <p className="text-2xl font-bold text-gray-800">₱{farmer.grossAnualIncomeLastYearFarming.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Annual gross income</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-600 mb-2">Non-Farming Income</h3>
              <p className="text-2xl font-bold text-gray-800">₱{farmer.grossAnualIncomeLastYeaNonFarming.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Annual gross income</p>
            </div>
          </div>
          {farmer.FourPS_Benificiaty && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <p><span className="font-semibold text-yellow-700">4PS Beneficiary:</span> <span className="text-yellow-600">{farmer.FourPS_Benificiaty}</span></p>
            </div>
          )}
        </InfoCard>

        {/* Organic Certification Information */}
        {isOrganicFarmer && (
          <InfoCard title="Organic Certification" icon={Award} highlight={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-[#00a06a]/20">
                  <h3 className="font-semibold text-[#00a06a] mb-3">Certification Status</h3>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Organic Certification:</span> {farmer.withOrganicAgricultureCertification ? 'Certified' : 'Not Certified'}</p>
                    {farmer.certification && <p><span className="font-semibold">Certification Type:</span> {farmer.certification}</p>}
                    {farmer.whatStagesInCertification && <p><span className="font-semibold">Certification Stage:</span> {farmer.whatStagesInCertification}</p>}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-[#00a06a] mb-3">Business Nature</h3>
                <div className="grid gap-2">
                  {farmer.productionForInputs && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Production for Inputs: {farmer.productionForInputs}</span></div>}
                  {farmer.productionForFood && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Production for Food: {farmer.productionForFood}</span></div>}
                  {farmer.postHarvestAndProcessing && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Post Harvest & Processing: {farmer.postHarvestAndProcessing}</span></div>}
                  {farmer.tradingAndWholeSale && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Trading & Wholesale: {farmer.tradingAndWholeSale}</span></div>}
                  {farmer.retailing && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Retailing: {farmer.retailing}</span></div>}
                  {farmer.transPortAndLogistics && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Transport & Logistics: {farmer.transPortAndLogistics}</span></div>}
                  {farmer.WareHousing && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Warehousing: {farmer.WareHousing}</span></div>}
                  {farmer.Others && <div className="flex items-center bg-white p-2 rounded border border-[#00a06a]/10"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span className="text-sm">Others: {farmer.Others}</span></div>}
                </div>
              </div>
            </div>
          </InfoCard>
        )}

        {/* Market Channels (Organic Farmers Only) */}
        {isOrganicFarmer && (
          <InfoCard title="Market Channels" icon={ShoppingCart}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BooleanIndicator label="Direct to Consumer" value={farmer.direcToConsumer} />
              <BooleanIndicator label="Trader" value={farmer.trader} />
              <BooleanIndicator label="Retailer" value={farmer.retailer} />
              <BooleanIndicator label="Institutional Buyer" value={farmer.institutionalBuyer} />
              <BooleanIndicator label="International Buyers" value={farmer.internationalBasedBuyers} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmer.specificType1 && (
                <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20">
                  <span className="font-semibold text-gray-700">Specific Type 1:</span> {farmer.specificType1}
                </div>
              )}
              {farmer.SpecificType2 && (
                <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20">
                  <span className="font-semibold text-gray-700">Specific Type 2:</span> {farmer.SpecificType2}
                </div>
              )}
              {farmer.SpecificType3 && (
                <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20">
                  <span className="font-semibold text-gray-700">Specific Type 3:</span> {farmer.SpecificType3}
                </div>
              )}
              {farmer.others && (
                <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20">
                  <span className="font-semibold text-gray-700">Other Channels:</span> {farmer.others}
                </div>
              )}
            </div>
          </InfoCard>
        )}

        {/* Agricultural Commodities (Organic Farmers Only) */}
        {isOrganicFarmer && (
          <InfoCard title="Agricultural Commodities" icon={Wheat}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmer.Grains && <CommodityCard title="Grains" commodity={farmer.Grains} />}
              {farmer.LowlandVegetables && <CommodityCard title="Lowland Vegetables" commodity={farmer.LowlandVegetables} />}
              {farmer.UplandVegetables && <CommodityCard title="Upland Vegetables" commodity={farmer.UplandVegetables} />}
              {farmer.Rootcrops && <CommodityCard title="Root Crops" commodity={farmer.Rootcrops} />}
              {farmer.FruitsAndNots && <CommodityCard title="Fruits & Nuts" commodity={farmer.FruitsAndNots} />}
              {farmer.Mushroom && <CommodityCard title="Mushroom" commodity={farmer.Mushroom} />}
              {farmer.OrganicSoil && <CommodityCard title="Organic Soil" commodity={farmer.OrganicSoil} />}
              {farmer.PultryProducts && <CommodityCard title="Poultry Products" commodity={farmer.PultryProducts} />}
              {farmer.LiveStockProducts && <CommodityCard title="Livestock Products" commodity={farmer.LiveStockProducts} />}
              {farmer.FisheriesAndAquaCulture && <CommodityCard title="Fisheries & Aquaculture" commodity={farmer.FisheriesAndAquaCulture} />}
              {farmer.IndustrialCropsAndProducts && <CommodityCard title="Industrial Crops" commodity={farmer.IndustrialCropsAndProducts} />}
              {farmer.OtherCommodity && <CommodityCard title="Other Commodity" commodity={farmer.OtherCommodity} />}
              {farmer.othersCommodity && (
                <div className="bg-[#fcfefc] border border-[#00a06a]/20 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Wheat className="w-5 h-5 text-[#00a06a] mr-2" />
                    <h3 className="font-semibold text-gray-800">Other Commodities</h3>
                  </div>
                  <p className="text-gray-600">{farmer.othersCommodity}</p>
                </div>
              )}
            </div>
          </InfoCard>
        )}

        {/* Facilities and Equipment (Organic Farmers Only) */}
        {isOrganicFarmer && farmer.ownSharedFacilities && farmer.ownSharedFacilities.length > 0 && (
          <InfoCard title="Facilities and Equipment" icon={Factory}>
            <div className="overflow-x-auto bg-[#fcfefc] rounded-xl border border-[#00a06a]/20">
              <table className="min-w-full divide-y divide-[#00a06a]/20">
                <thead className="bg-gradient-to-r from-[#00a06a]/10 to-[#00a06a]/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00a06a] uppercase tracking-wider">Facility/Equipment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00a06a] uppercase tracking-wider">Ownership</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00a06a] uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00a06a] uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00a06a] uppercase tracking-wider">Dedicated to Organic</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#00a06a]/10">
                  {farmer.ownSharedFacilities.map((facility, index) => (
                    <tr key={facility.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#fcfefc]'}>
                      <td className="px-6 py-4 text-sm text-gray-800">{facility.facilitiesMachineryEquipmentUsed}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{facility.ownership}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{facility.model}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{facility.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          facility.dedicatedToOrganic ? 'bg-[#00a06a] text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {facility.dedicatedToOrganic ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoCard>
        )}

        {/* Account Status */}
        <InfoCard title="Account Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20 text-center">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <StatusBadge status={farmer.status} />
            </div>
            <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20 text-center">
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="font-semibold text-gray-800">@{farmer.username}</p>
            </div>
            {farmer.updatedAt && (
              <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20 text-center">
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-semibold text-gray-800">{new Date(farmer.updatedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="w-24 h-1 bg-[#00a06a] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600">Organic Farmer Management System</p>
        </div>
      </div>
    </div>
  )
}

export default FarmerProfile