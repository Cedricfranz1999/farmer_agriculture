"use client";
import { useState, useRef, useEffect } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { Camera, QrCode, VideoOff, Leaf, Users, UserCheck, UserX, History, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/react";
import AllocationsTable from "../allocationTable";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OrganicFarmerQRScanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [showAllocationModal, setShowAllocationModal] = useState<boolean>(false);
  const [organicFarmerId, setOrganicFarmerId] = useState<number | undefined>(undefined);
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"scanner" | "allocations" | "farmers-list">("scanner");
  const [selectedFarmerForHistory, setSelectedFarmerForHistory] = useState<number | null>(null);
  const scanCountRef = useRef<number>(0);

  const devices = useDevices();
  const { data: organicFarmerData, isFetching } = api.allocation.findOrganicFarmerById.useQuery(
    { id: scannedId ?? "" },
    { enabled: !!scannedId },
  );

  const { data: allocationHistory, refetch: refetchAllocationHistory } = api.allocation.getOrganicFarmerAllocationHistory.useQuery(
    { organicFarmerId: organicFarmerId?.toString() ?? "" },
    { enabled: !!organicFarmerId }
  );

  const { data: selectedFarmerAllocationHistory, refetch: refetchSelectedFarmerHistory } = api.allocation.getOrganicFarmerAllocationHistory.useQuery(
    { organicFarmerId: selectedFarmerForHistory?.toString() ?? "" },
    { enabled: !!selectedFarmerForHistory }
  );

  useEffect(() => {
    if (scannedId) {
      setShowAllocationModal(false);
      setAllocationId(null);
    }
  }, [scannedId]);

  useEffect(() => {
    if (organicFarmerData) {
      setOrganicFarmerId(organicFarmerData.id);
      setShowAllocationModal(true);
    }
  }, [organicFarmerData]);

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue;
      console.log(`Scanned Organic Farmer ID: ${data}`);
      setScannedId(data);
      setIsScanning(false);
      scanCountRef.current = 0;
    }
  };

  const startScanner = () => {
    setError(null);
    setScannedId(null);
    setIsScanning(true);
  };

  const stopScanner = () => {
    setIsScanning(false);
  };

  const handleViewHistory = (farmerId: number) => {
    setSelectedFarmerForHistory(farmerId);
  };

  const handleCloseHistory = () => {
    setSelectedFarmerForHistory(null);
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <Leaf className="h-8 w-8 text-green-700" />
        <h1 className="text-3xl font-bold text-green-700">
          Organic Farmer Scanner
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4 flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "scanner"
              ? "border-b-2 border-green-700 text-green-700"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("scanner")}
        >
          Scanner
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "allocations"
              ? "border-b-2 border-green-700 text-green-700"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("allocations")}
        >
          Allocations
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "farmers-list"
              ? "border-b-2 border-green-700 text-green-700"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("farmers-list")}
        >
          Farmers List
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "scanner" ? (
        <div>
          {!isScanning ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-6 w-6" />
                  Scan Organic Farmer ID
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">
                  Click the button below to open the camera and scan an organic
                  farmer's QR code.
                </p>
                <Button
                  onClick={startScanner}
                  className="bg-green-700 hover:bg-green-700"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-6 w-6" />
                  Scanner Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <select
                    className="rounded-md border p-2"
                    onChange={(e) => setDeviceId(e.target.value)}
                  >
                    <option value={undefined}>Select a device</option>
                    {devices.map((device, index) => (
                      <option key={index} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                </div>
                {error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-center">
                      Point your camera at an organic farmer's QR code to scan
                    </p>
                    <div className="mx-auto flex w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      <Scanner
                        formats={["qr_code"]}
                        constraints={{ deviceId }}
                        onScan={handleScan}
                        onError={(err) => setError(`Scanner error: ${err}`)}
                        styles={{
                          container: { height: "300px", width: "100%" },
                        }}
                        components={{ finder: true }}
                        allowMultiple={false}
                        scanDelay={500}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-center gap-2">
                  <Button onClick={stopScanner} variant="outline">
                    <VideoOff className="mr-2 h-4 w-4" />
                    Stop Scanning
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {scannedId && !organicFarmerData && !isFetching && (
            <Alert className="mt-4 bg-yellow-100">
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                No organic farmer found with ID: <strong>{scannedId}</strong>
              </AlertDescription>
            </Alert>
          )}
          {scannedId && organicFarmerData && !allocationId && (
            <Alert className="mt-4 bg-green-100">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Scanned ID: <strong>{scannedId}</strong>
              </AlertDescription>
            </Alert>
          )}
          {showAllocationModal && organicFarmerData && (
            <AllocationModal
              organicFarmerId={organicFarmerId}
              firstname={organicFarmerData.firstname}
              lastname={organicFarmerData.surname}
              image={organicFarmerData.farmerImage}
              allocationHistory={allocationHistory || []}
              onClose={() => setShowAllocationModal(false)}
              onSuccess={(id) => {
                setAllocationId(id);
                refetchAllocationHistory();
              }}
            />
          )}
          {allocationId && (
            <AllocationSuccessDisplay allocationId={allocationId} />
          )}
        </div>
      ) : activeTab === "allocations" ? (
        <div>
          <AllocationsTable />
        </div>
      ) : (
        <OrganicFarmersList onViewHistory={handleViewHistory} />
      )}

      {/* Organic Farmer Allocation History Modal */}
      {selectedFarmerForHistory && (
        <OrganicFarmerAllocationHistoryModal
          farmerId={selectedFarmerForHistory}
          allocationHistory={selectedFarmerAllocationHistory || []}
          onClose={handleCloseHistory}
          onRefetch={refetchSelectedFarmerHistory}
        />
      )}
    </div>
  );
};

const AllocationModal = ({
  organicFarmerId,
  firstname,
  lastname,
  image,
  allocationHistory,
  onClose,
  onSuccess,
}: {
  organicFarmerId?: number;
  firstname: string;
  lastname: string;
  image: string;
  allocationHistory: any[];
  onClose: () => void;
  onSuccess: (allocationId: string) => void;
}) => {
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<string>("");
  
  const { mutate: createAllocation } = api.allocation.createAllocation.useMutation();

  const handleSubmit = () => {
    if (!organicFarmerId) {
      alert("Organic Farmer ID is required for allocation.");
      return;
    }
    if (!type) {
      alert("Please select an allocation type.");
      return;
    }
    if (!amount || amount.trim() === "") {
      alert("Please enter a valid amount.");
      return;
    }
    
    createAllocation(
      {
        organicFarmerId: organicFarmerId,
        amount: amount,
        type
      },
      {
        onSuccess: (allocation) => {
          onSuccess(allocation.id.toString());
          onClose();
        },
        onError: (error) => {
          alert(`Failed to create allocation: ${error.message}`);
        },
      },
    );
  };

  const router = useRouter();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Allocation Details</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column - Farmer Info and Allocation Form */}
          <div>
            <div className="mb-4 flex flex-col items-center">
              {image && (
                <Image
                  src={image}
                  alt={`${firstname} ${lastname}`}
                  width={80}
                  height={80}
                  className="mb-2 rounded-full object-cover"
                />
              )}
              <p className="text-lg font-semibold">
                {firstname} {lastname}
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Allocation Type
              </label>
              <select
                value={type}
                onChange={handleTypeChange}
                className="w-full rounded-md border p-2"
              >
                <option value="">Select Allocation Type</option>
                <option value="Cash">Cash</option>
                <option value="Seedling">Seedling</option>
                <option value="Machine">Machine</option>
                <option value="Fertilizer">Fertilizer</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Allocation 
              </label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="w-full rounded-md border p-2"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
              >
                Confirm Allocation
              </button>
            </div>

            {/* View More Details Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => router.push(`/admin/organic-farmer/profile/${organicFarmerId}`)}
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View More Details
              </button>
            </div>
          </div>

          {/* Right Column - Allocation History */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <History className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Allocation History</h3>
            </div>
            {allocationHistory.length === 0 ? (
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-gray-500">No allocation history found</p>
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {allocationHistory.map((allocation) => (
                  <div
                    key={allocation.id}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        {allocation.AllocationType}
                      </span>
                      <span className="font-semibold text-green-700">
                        {allocation.amount}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm text-gray-500">
                      <span>
                        {new Date(allocation.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`font-medium ${
                          allocation.approved
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {allocation.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllocationSuccessDisplay = ({
  allocationId,
}: {
  allocationId: string;
}) => {
  const { data: allocationDetails } = api.allocation.getAllocationDetails.useQuery(
    { allocationId },
    { enabled: !!allocationId },
  );

  if (!allocationDetails) {
    return null;
  }

  const farmer = allocationDetails.farmers[0]?.organicFarmer;
  const firstname = farmer?.firstname ?? "";
  const surname = farmer?.surname ?? "";

  return (
    <Alert className="mt-4 bg-green-100">
      <AlertTitle>Allocation Confirmed</AlertTitle>
      <AlertDescription>
        <p>
          <strong>Organic Farmer:</strong> {firstname} {surname}
        </p>
        <p>
          <strong>Allocation Type:</strong> {allocationDetails.AllocationType}
        </p>
        <p>
          <strong>Allocation:</strong> {allocationDetails.amount}
        </p>
      </AlertDescription>
    </Alert>
  );
};

const OrganicFarmersList = ({ onViewHistory }: { onViewHistory: (farmerId: number) => void }) => {
  const { data: farmersData, isLoading } = api.allocation.getOrganicFarmersSeparated.useQuery();
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-lg">Loading organic farmers...</div>
      </div>
    );
  }

  const totalFarmers = (farmersData?.organicFarmersWithAllocations?.length || 0) + (farmersData?.organicFarmersWithoutAllocations?.length || 0);
  const farmersWithAllocations = farmersData?.organicFarmersWithAllocations?.length || 0;
  const farmersWithoutAllocations = farmersData?.organicFarmersWithoutAllocations?.length || 0;

  // Filter farmers based on search term and allocation type
  const filteredFarmersWithAllocations = farmersData?.organicFarmersWithAllocations?.filter(farmer => {
    const matchesSearch = 
      farmer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toString().includes(searchTerm);
    
    if (filterType === "all") return matchesSearch;
    
    // Check if farmer has allocation of the filtered type
    const hasMatchingAllocation = farmer.allocations?.some(allocation => 
      allocation.allocation.AllocationType?.toLowerCase() === filterType.toLowerCase()
    );
    
    return matchesSearch && hasMatchingAllocation;
  }) || [];

  const filteredFarmersWithoutAllocations = farmersData?.organicFarmersWithoutAllocations?.filter(farmer => {
    const matchesSearch = 
      farmer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toString().includes(searchTerm);
    
    return matchesSearch;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organic Farmers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalFarmers}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Allocations</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {farmersWithAllocations}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Without Allocations</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {farmersWithoutAllocations}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search Organic Farmers
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border p-2"
                placeholder="Search by name or ID..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Filter by Allocation Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-md border p-2"
              >
                <option value="all">All Types</option>
                <option value="cash">Cash</option>
                <option value="seedling">Seedling</option>
                <option value="machine">Machine</option>
                <option value="fertilizer">Fertilizer</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organic Farmers with Allocations */}
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <UserCheck className="h-6 w-6" />
            Organic Farmers with Allocations ({filteredFarmersWithAllocations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredFarmersWithAllocations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No organic farmers with allocations found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFarmersWithAllocations?.map((farmer) => (
                <div key={farmer.id} className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    {farmer.farmerImage && (
                      <Image
                        src={farmer.farmerImage}
                        alt={`${farmer.firstname} ${farmer.surname}`}
                        width={60}
                        height={60}
                        className="rounded-full object-cover border-2 border-green-300"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">
                        {farmer.firstname} {farmer.surname}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {farmer.id}</p>
                      <p className="text-sm text-green-600 font-medium">
                        Allocations: {farmer.allocations?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Registered: {new Date(farmer.createdAt!).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => onViewHistory(farmer.id)}
                          className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organic Farmers without Allocations */}
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <UserX className="h-6 w-6" />
            Organic Farmers without Allocations ({filteredFarmersWithoutAllocations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredFarmersWithoutAllocations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No organic farmers without allocations found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFarmersWithoutAllocations?.map((farmer) => (
                <div key={farmer.id} className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-center gap-3">
                    {farmer.farmerImage && (
                      <Image
                        src={farmer.farmerImage}
                        alt={`${farmer.firstname} ${farmer.surname}`}
                        width={60}
                        height={60}
                        className="rounded-full object-cover border-2 border-orange-300"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-800">
                        {farmer.firstname} {farmer.surname}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {farmer.id}</p>
                      <p className="text-sm text-orange-600 font-medium">
                        No allocations yet
                      </p>
                      <p className="text-xs text-gray-500">
                        Registered: {new Date(farmer.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const OrganicFarmerAllocationHistoryModal = ({
  farmerId,
  allocationHistory,
  onClose,
  onRefetch,
}: {
  farmerId: number;
  allocationHistory: any[];
  onClose: () => void;
  onRefetch: () => void;
}) => {
  const { data: farmerData } = api.allocation.findOrganicFarmerById.useQuery(
    { id: farmerId.toString() },
    { enabled: !!farmerId }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Allocation History</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {farmerData && (
          <div className="mb-4 flex items-center gap-3">
            {farmerData.farmerImage && (
              <Image
                src={farmerData.farmerImage}
                alt={`${farmerData.firstname} ${farmerData.surname}`}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold">
                {farmerData.firstname} {farmerData.surname}
              </h3>
              <p className="text-sm text-gray-600">ID: {farmerData.id}</p>
            </div>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {allocationHistory.length === 0 ? (
            <div className="rounded-lg border border-gray-200 p-8 text-center">
              <History className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No allocation history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allocationHistory.map((allocation) => (
                <div
                  key={allocation.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-700">
                        {allocation.AllocationType}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        #{allocation.id}
                      </span>
                    </div>
                    <span className="font-semibold text-green-700">
                      {allocation.amount}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>
                      {new Date(allocation.createdAt).toLocaleDateString()} at{" "}
                      {new Date(allocation.createdAt).toLocaleTimeString()}
                    </span>
                    <span
                      className={`font-medium ${
                        allocation.approved
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {allocation.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganicFarmerQRScanner;