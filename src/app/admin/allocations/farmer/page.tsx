"use client";
import { useState, useRef, useEffect } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { Camera, QrCode, VideoOff, History, Users, UserCheck, UserX, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AllocationsTable from "../allocationTable";
import { useRouter } from "next/navigation";

const FarmerQRScanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [showAllocationModal, setShowAllocationModal] = useState<boolean>(false);
  const [farmerId, setFarmerId] = useState<number | undefined>(undefined);
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const [selectedFarmerForHistory, setSelectedFarmerForHistory] = useState<number | null>(null);
  const scanCountRef = useRef<number>(0);
  const devices = useDevices();
  
  const { data: farmerData, isFetching , refetch:refetchAllocation} = api.allocation.findFarmerById.useQuery(
    { id: scannedId ?? "" },
    { enabled: !!scannedId },
  );

  const { data: allocationHistory, refetch: refetchAllocationHistory } = api.allocation.getFarmerAllocationHistory.useQuery(
    { farmerId: farmerId?.toString() ?? "" },
    { enabled: !!farmerId }
  );

  const { data: selectedFarmerAllocationHistory, refetch: refetchSelectedFarmerHistory } = api.allocation.getFarmerAllocationHistory.useQuery(
    { farmerId: selectedFarmerForHistory?.toString() ?? "" },
    { enabled: !!selectedFarmerForHistory }
  );

  useEffect(() => {
    if (scannedId) {
      setShowAllocationModal(false);
      setAllocationId(null);
    }
  }, [scannedId]);

  useEffect(() => {
    if (farmerData) {
      setFarmerId(farmerData.id);
      setShowAllocationModal(true);
    }
  }, [farmerData]);

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue;
      console.log(`Scanned ID: ${data}`);
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
        <QrCode className="h-8 w-8 text-teal-700" />
        <h1 className="text-3xl font-bold text-teal-700">Farmer ID Scanner</h1>
      </div>

      <Tabs defaultValue="scanner" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="farmers-list">Farmers List</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          {!isScanning ? (
            <Card className="w-full bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-6 w-6" />
                  Scan Farmer ID
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">
                  Click the button below to open the camera and scan a farmer's
                  QR code.
                </p>
                <Button
                  onClick={startScanner}
                  className="bg-teal-700 hover:bg-teal-700"
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
                      Point your camera at a farmer's QR code to scan
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
          {scannedId && !farmerData && !isFetching && (
            <Alert className="mt-4 bg-yellow-100">
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                No farmer found with ID: <strong>{scannedId}</strong>
              </AlertDescription>
            </Alert>
          )}
          {scannedId && farmerData && !allocationId && (
            <Alert className="mt-4 bg-green-100">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Scanned ID: <strong>{scannedId}</strong>
              </AlertDescription>
            </Alert>
          )}
          {showAllocationModal && farmerData && (
            <AllocationModal
              farmerId={farmerId}
              firstname={farmerData.firstname}
              lastname={farmerData.surname}
              image={farmerData.farmerImage}
              allocationHistory={allocationHistory || []}
              onClose={() => setShowAllocationModal(false)}
              onSuccess={(id) => {
                setAllocationId(id);
                refetchAllocationHistory();
                refetchAllocation()
              }}
            />
          )}
          {allocationId && (
            <AllocationSuccessDisplay allocationId={allocationId} />
          )}
        </TabsContent>

        <TabsContent value="allocations">
          <AllocationsTable />
        </TabsContent>

        <TabsContent value="farmers-list">
          <FarmersList 
            onViewHistory={handleViewHistory}
          />
        </TabsContent>
      </Tabs>

      {/* Farmer Allocation History Modal */}
      {selectedFarmerForHistory && (
        <FarmerAllocationHistoryModal
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
  farmerId,
  firstname,
  lastname,
  image,
  allocationHistory,
  onClose,
  onSuccess,
}: {
  farmerId?: number;
  firstname: string;
  lastname: string;
  image: string;
  allocationHistory: any[];
  onClose: () => void;
  onSuccess: (allocationId: string) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("");

  const { mutate: createAllocation } = api.allocation.createAllocation.useMutation();
  
  const handleSubmit = () => {
    if (!farmerId) {
      alert("Farmer ID is required for allocation.");
      return;
    }
    if (!type) {
      alert("Please select an allocation type.");
      return;
    }
    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    
    createAllocation(
      {
        farmerId: farmerId,
        amount,
        type,
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? 0 : parseInt(value) || 0);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const router = useRouter();

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
                  width={120}
                  height={120}
                  className="mb-2 rounded-full object-cover"
                />
              )}
              <p className="text-lg font-semibold">
                {firstname} {lastname}
              </p>

              <button
                onClick={() => { router.push(`/admin/farmer/profile/${farmerId}`) }}
                className="mt-2 rounded bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
              >
                View More Details
              </button>
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
                Allocation Amount
              </label>
              <input
                type="number"
                value={amount === 0 ? "" : amount}
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
                className="rounded bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
              >
                Approve
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
                      <span className="font-semibold text-teal-700">
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
                        {allocation.approved ? "" : ""}
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
  
  const farmer = allocationDetails.farmers[0]?.farmer;
  const firstname = farmer?.firstname ?? "";
  const surname = farmer?.surname ?? "";
  
  return (
    <Alert className="mt-4 bg-green-100">
      <AlertTitle>Allocation Approved</AlertTitle>
      <AlertDescription>
        <p>
          <strong>Name:</strong> {firstname} {surname}
        </p>
        <p>
          <strong>Allocation Type:</strong> {allocationDetails.AllocationType}
        </p>
        <p>
          <strong>Amount:</strong> {allocationDetails.amount}
        </p>
      </AlertDescription>
    </Alert>
  );
};

const FarmersList = ({ onViewHistory }: { onViewHistory: (farmerId: number) => void }) => {
  const { data: farmersData, isLoading } = api.allocation.getAllFarmersSeparated.useQuery();
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (isLoading) {
    return <div className="text-center">Loading farmers...</div>;
  }

  const totalFarmers = (farmersData?.farmersWithAllocations.length || 0) + (farmersData?.farmersWithoutAllocations.length || 0);
  const farmersWithAllocations = farmersData?.farmersWithAllocations.length || 0;
  const farmersWithoutAllocations = farmersData?.farmersWithoutAllocations.length || 0;

  // Filter farmers based on search term and allocation type
  const filteredFarmersWithAllocations = farmersData?.farmersWithAllocations.filter(farmer => {
    const matchesSearch = 
      farmer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toString().includes(searchTerm);
    
    if (filterType === "all") return matchesSearch;
    
    // Check if farmer has allocation of the filtered type
    const hasMatchingAllocation = farmer.allocations.some(allocation => 
      allocation.allocation.AllocationType?.toLowerCase() === filterType.toLowerCase()
    );
    
    return matchesSearch && hasMatchingAllocation;
  }) || [];

  const filteredFarmersWithoutAllocations = farmersData?.farmersWithoutAllocations.filter(farmer => {
    const matchesSearch = 
      farmer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toString().includes(searchTerm);
    
    return matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
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
                Search Farmers
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

      {/* Farmers with Allocations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700">
            Farmers with Allocations ({filteredFarmersWithAllocations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFarmersWithAllocations.length === 0 ? (
            <p className="text-muted-foreground">No farmers with allocations found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFarmersWithAllocations.map((farmer) => (
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
                        Allocations: {farmer.allocations.length}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => onViewHistory(farmer.id)}
                          className="rounded bg-teal-600 px-3 py-1 text-xs font-medium text-white hover:bg-teal-700"
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

      {/* Farmers without Allocations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-700">
            Farmers without Allocations ({filteredFarmersWithoutAllocations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFarmersWithoutAllocations.length === 0 ? (
            <p className="text-muted-foreground">No farmers without allocations found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFarmersWithoutAllocations.map((farmer) => (
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

const FarmerAllocationHistoryModal = ({
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
  const { data: farmerData } = api.allocation.findFarmerById.useQuery(
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
                    <span className="font-semibold text-teal-700">
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
                      {allocation.approved ? "" : ""}
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
            className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerQRScanner;