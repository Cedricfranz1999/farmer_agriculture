"use client";
import { useState, useRef, useEffect } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { Camera, QrCode, VideoOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AllocationsTable from "../allocationTable";

const FarmerQRScanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [showAllocationModal, setShowAllocationModal] =
    useState<boolean>(false);
  const [farmerId, setFarmerId] = useState<number | undefined>(undefined);
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const userType = "farmer";
  const scanCountRef = useRef<number>(0);
  const devices = useDevices();
  const { data: farmerData, isFetching } =
    api.allocation.findFarmerById.useQuery(
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
              onClose={() => setShowAllocationModal(false)}
              onSuccess={(id) => setAllocationId(id)}
            />
          )}
          {allocationId && (
            <AllocationSuccessDisplay allocationId={allocationId} />
          )}
        </TabsContent>

        <TabsContent value="allocations">
          <AllocationsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AllocationModal = ({
  farmerId,
  firstname,
  lastname,
  image,
  onClose,
  onSuccess,
}: {
  farmerId?: number;
  firstname: string;
  lastname: string;
  image: string;
  onClose: () => void;
  onSuccess: (allocationId: string) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);
  const { mutate: createAllocation } =
    api.allocation.createAllocation.useMutation();
  const handleSubmit = () => {
    if (!farmerId) {
      alert("Farmer ID is required for allocation.");
      return;
    }
    createAllocation(
      {
        farmerId: farmerId,
        amount,
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Allocation Details</h2>
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
          <strong>Amount:</strong> {allocationDetails.amount}
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default FarmerQRScanner;
