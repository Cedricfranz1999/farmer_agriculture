'use client'
import React from 'react'
import { useAuthStore } from '~/app/store/authStore'
import { api } from '~/trpc/react'
import { User, Phone, Mail, MapPin, Calendar, Users, DollarSign, FileText, Briefcase } from 'lucide-react'

const FarmerProfile = () => {
  const farmerId = useAuthStore((state) => state?.user?.id)
  
  const {
    data: farmer,
    isLoading,
    error,
  } = api.farmers.getFarmerById.useQuery({ id: farmerId ?? 0 }, {
    enabled: !!farmerId,
  })

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

  // Get the first AGRI_YOUTH record if it exists
  const agriYouth = farmer.AGRI_YOUTH?.[0]

  const ProfileImagePlaceholder = () => (
    <div className="w-48 h-48 rounded-full border-4 border-[#00a06a] bg-gradient-to-br from-green-100 to-[#00a06a]/10 flex items-center justify-center">
      <User className="w-24 h-24 text-[#00a06a]/60" />
    </div>
  )

  const SignaturePlaceholder = ({ type }:any) => (
    <div className="h-24 border-2 border-dashed border-[#00a06a]/30 rounded-lg bg-[#fcfefc] flex items-center justify-center">
      <div className="text-center text-[#00a06a]/60">
        <FileText className="w-8 h-8 mx-auto mb-1" />
        <p className="text-sm">No {type}</p>
      </div>
    </div>
  )

  const InfoCard = ({ title , children, icon: Icon }:any) => (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 mb-6 border border-[#00a06a]/10 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-[#00a06a] mr-3" />}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  )

  const StatusBadge = ({ status, type = 'status' } :any) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcfefc] via-green-50 to-[#fcfefc]">
      <div className="  p-4 ">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Farmer Profile</h1>
          <div className="w-24 h-1 bg-[#00a06a] mx-auto rounded-full"></div>
        </div>
        
        {/* Profile Header */}
        <InfoCard>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {farmer.farmerImage ? (
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#00a06a] shadow-xl">
                <img 
                  src={farmer.farmerImage} 
                  alt="Farmer Profile" 
                  className="w-full h-full object-cover"
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
                <StatusBadge status={farmer.categoryType} type="category" />
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
              {farmer.nameOfSpouse && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Spouse:</span>
                  <span className="text-gray-600">{farmer.nameOfSpouse}</span>
                </div>
              )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            
            {farmer.houseHead && (
              <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20">
                <h3 className="font-semibold text-[#00a06a] mb-3">Household Head Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Household Head:</span> {farmer.houseHead.houseHoldHead}</p>
                  <p><span className="font-medium">Relationship:</span> {farmer.houseHead.relationship}</p>
                  <p><span className="font-medium">Total Members:</span> {farmer.houseHead.numberOfLivingHouseHoldMembersTotal}</p>
                  <p><span className="font-medium">Male:</span> {farmer.houseHead.numberOfMale}</p>
                  <p><span className="font-medium">Female:</span> {farmer.houseHead.NumberOfFemale}</p>
                </div>
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

        {/* Documents Section */}
        <InfoCard title="Documents & Signatures" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Farmer Signature</h3>
              {farmer.farmerSignatureAsImage ? (
                <div className="border-2 border-[#00a06a]/20 rounded-xl p-4 bg-[#fcfefc]">
                  <img 
                    src={farmer.farmerSignatureAsImage} 
                    alt="Farmer Signature" 
                    className="h-24 object-contain mx-auto"
                  />
                </div>
              ) : (
                <SignaturePlaceholder type="signature" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Fingerprint</h3>
              {farmer.farmerFingerPrintAsImage ? (
                <div className="border-2 border-[#00a06a]/20 rounded-xl p-4 bg-[#fcfefc]">
                  <img 
                    src={farmer.farmerFingerPrintAsImage} 
                    alt="Fingerprint" 
                    className="h-24 object-contain mx-auto"
                  />
                </div>
              ) : (
                <SignaturePlaceholder type="fingerprint" />
              )}
            </div>
          </div>
        </InfoCard>

        {/* Category Specific Information */}
        {farmer.categoryType === 'FARMER' && farmer.farmerDetails && (
          <InfoCard title="Farming Activities" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20">
                <h3 className="font-semibold text-[#00a06a] mb-3">Crops</h3>
                <div className="space-y-2">
                  {farmer.farmerDetails.rice && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Rice</span></div>}
                  {farmer.farmerDetails.corn && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Corn</span></div>}
                  {farmer.farmerDetails.othersCrops && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Other Crops: {farmer.farmerDetails.othersCrops}</span></div>}
                </div>
              </div>
              <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20">
                <h3 className="font-semibold text-[#00a06a] mb-3">Livestock & Poultry</h3>
                <div className="space-y-2">
                  {farmer.farmerDetails.livestock && (
                    <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Livestock: {farmer.farmerDetails.livestockDetails || 'Yes'}</span></div>
                  )}
                  {farmer.farmerDetails.poultry && (
                    <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Poultry: {farmer.farmerDetails.poultryDetails || 'Yes'}</span></div>
                  )}
                </div>
              </div>
            </div>
          </InfoCard>
        )}

        {farmer.categoryType === 'FARMWORKER' && farmer.farmworkerDetails && (
          <InfoCard title="Farm Work Activities" icon={Briefcase}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {farmer.farmworkerDetails.landPreparation && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Land Preparation</span></div>}
              {farmer.farmworkerDetails.plantingTransplanting && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Planting/Transplanting</span></div>}
              {farmer.farmworkerDetails.cultivation && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Cultivation</span></div>}
              {farmer.farmworkerDetails.harvesting && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Harvesting</span></div>}
              {farmer.farmworkerDetails.others && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Others: {farmer.farmworkerDetails.others}</span></div>}
            </div>
          </InfoCard>
        )}

        {farmer.categoryType === 'FISHERFOLK' && farmer.fisherfolkDetails && (
          <InfoCard title="Fishing Activities" icon={Briefcase}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {farmer.fisherfolkDetails.fishCapture && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Fish Capture</span></div>}
              {farmer.fisherfolkDetails.aquaculture && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Aquaculture</span></div>}
              {farmer.fisherfolkDetails.gleaning && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Gleaning</span></div>}
              {farmer.fisherfolkDetails.fishProcessing && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Fish Processing</span></div>}
              {farmer.fisherfolkDetails.fishVending && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Fish Vending</span></div>}
              {farmer.fisherfolkDetails.others && <div className="bg-[#fcfefc] p-3 rounded-lg border border-[#00a06a]/20 text-center"><span className="text-sm font-medium">Others: {farmer.fisherfolkDetails.others}</span></div>}
            </div>
          </InfoCard>
        )}

        {farmer.categoryType === 'AGRI_YOUTH' && agriYouth && (
          <InfoCard title="Agri-Youth Information" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {agriYouth.partOfFarmingHouseHold && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Part of Farming Household</span></div>}
                {agriYouth.attendedFormalAgriFishery && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Attended Formal Agri-Fishery Training</span></div>}
                {agriYouth.attendedNonFormalAgriFishery && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Attended Non-Formal Agri-Fishery Training</span></div>}
              </div>
              <div className="space-y-3">
                {agriYouth.participatedInAnyAgriculturalActivity && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Participated in Agricultural Activities</span></div>}
                {agriYouth.fishVending && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Fish Vending</span></div>}
                {agriYouth.others && <div className="flex items-center"><div className="w-2 h-2 bg-[#00a06a] rounded-full mr-2"></div><span>Others: {agriYouth.others}</span></div>}
              </div>
            </div>
          </InfoCard>
        )}

        {/* Farm Details */}
        {farmer.farmDetails && farmer.farmDetails.length > 0 && (
          <InfoCard title="Farm Details" icon={MapPin}>
            <div className="mb-4 p-4 bg-gradient-to-r from-[#00a06a]/10 to-[#00a06a]/5 rounded-xl border border-[#00a06a]/20">
              <p className="text-lg font-semibold text-[#00a06a]">Total Number of Farms: {farmer.numberOfFarms}</p>
            </div>
            
            <div className="space-y-6">
              {farmer.farmDetails.map((farm, index) => (
                <div key={farm.id} className="bg-[#fcfefc] p-6 rounded-xl border border-[#00a06a]/20">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#00a06a] text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Farm #{index + 1}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <p><span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-600">{farm.Location}</span></p>
                      <p><span className="font-semibold text-gray-700">Total Area:</span> <span className="text-gray-600">{farm.TotalFarmAreaInHa} hectares</span></p>
                      <p><span className="font-semibold text-gray-700">Agrarian Reform:</span> <span className={`font-medium ${farm.agrarianReform ? 'text-green-600' : 'text-red-600'}`}>{farm.agrarianReform ? 'Yes' : 'No'}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-semibold text-gray-700">Owner:</span> <span className="text-gray-600">{farm.ownerName}</span></p>
                      <p><span className="font-semibold text-gray-700">Owner Document:</span> <span className="text-gray-600">{farm.OwnerDocumentsNumber}</span></p>
                    </div>
                  </div>
                  
                  {farm.lotDetails && (
                    <div className="bg-white p-4 rounded-lg border border-[#00a06a]/10">
                      <h4 className="font-semibold text-[#00a06a] mb-3">Lot Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <p><span className="font-medium">Crops/Commodity:</span> {farm.lotDetails.cropsORCommodity}</p>
                        <p><span className="font-medium">Size:</span> {farm.lotDetails.sizeInHa} hectares</p>
                        <p><span className="font-medium">Livestock/Poultry Count:</span> {farm.lotDetails.numberOfHeadForLivestockAndPoultry}</p>
                        <p><span className="font-medium">Farm Type:</span> {farm.lotDetails.FarmType}</p>
                        <p><span className="font-medium">Organic Practitioner:</span> <span className={`font-medium ${farm.lotDetails.organicPractitioner ? 'text-green-600' : 'text-red-600'}`}>{farm.lotDetails.organicPractitioner ? 'Yes' : 'No'}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Account Status */}
        <InfoCard title="Account Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20 text-center">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <StatusBadge status={farmer.status} />
            </div>
            <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20 text-center">
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="font-semibold text-gray-800">@{farmer.username}</p>
            </div>
            <div className="bg-[#fcfefc] p-4 rounded-xl border border-[#00a06a]/20 text-center">
              <p className="text-sm text-gray-600 mb-1">Member Since</p>
              <p className="font-semibold text-gray-800">{new Date(farmer.createdAt).toLocaleDateString()}</p>
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
          <p className="text-gray-600">Farmer Management System</p>
        </div>
      </div>
    </div>
  )
}

export default FarmerProfile