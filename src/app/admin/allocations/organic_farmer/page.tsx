"use client";
import { useState, useRef, useEffect } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { Camera, QrCode, VideoOff, Leaf } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/react";
import AllocationsTable from "../allocationTable";

const OrganicFarmerQRScanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const [showAllocationModal, setShowAllocationModal] =
    useState<boolean>(false);
    
  const [organicFarmerId, setOrganicFarmerId] = useState<number | undefined>(
    undefined,
  );
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"scanner" | "allocations">(
    "scanner",
  );
  const scanCountRef = useRef<number>(0);

  const devices = useDevices();
  const { data: organicFarmerData, isFetching } =
    api.allocation.findOrganicFarmerById.useQuery(
      { id: scannedId ?? "" },
      { enabled: !!scannedId },
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
              onClose={() => setShowAllocationModal(false)}
              onSuccess={(id) => setAllocationId(id)}
            />
          )}
          {allocationId && (
            <AllocationSuccessDisplay allocationId={allocationId} />
          )}
        </div>
      ) : (
        <div>
          <AllocationsTable />
        </div>
      )}
    </div>
  );
};

const AllocationModal = ({
  organicFarmerId,
  firstname,
  lastname,
  onClose,
  onSuccess,
}: {
  organicFarmerId?: number;
  firstname: string;
  lastname: string;
  onClose: () => void;
  onSuccess: (allocationId: string) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<string>("");
  
  const { mutate: createAllocation } =
    api.allocation.createAllocation.useMutation();

  const handleSubmit = () => {
    if (!organicFarmerId) {
      alert("Organic Farmer ID is required for allocation.");
      return;
    }
    createAllocation(
      {
        organicFarmerId: organicFarmerId,
        amount,
        type
      },
      {
        onSuccess: (allocation) => {
          onSuccess(allocation.id.toString());
          onClose();
        },
      },
    );
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? 0 : parseInt(value) || 0);
  };

     const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setType(value);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Allocation Details</h2>
        <div className="mb-4 flex flex-col items-center">
          <p className="text-lg font-semibold">
            {firstname} {lastname}
          </p>
        </div>
         <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Allocation Type
          </label>
          <input
            onChange={handleTextChange}
            className="w-full rounded-md border p-2"
            placeholder="Enter Allocation Type"
          />
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
            placeholder="Enter amount in kg"
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
      </div>
    </div>
  );
};

const AllocationSuccessDisplay = ({
  allocationId,
}: {
  allocationId: string;
}) => {
  const { data: allocationDetails } =
    api.allocation.getAllocationDetails.useQuery(
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
        <strong>Allocation Type:</strong> {allocationDetails.AllocationType} 

        <p>
          <strong>Amount:</strong> {allocationDetails.amount} kg
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default OrganicFarmerQRScanner;
