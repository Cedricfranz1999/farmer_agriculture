"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import {
  MessageSquare,
  Send,
  User,
  Shield,
  Leaf,
  Clock,
  Search,
  Plus,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";
import { useAuthStore } from "~/app/store/authStore";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const Page = () => {
  const authDAta = useAuthStore((state) => state?.user);
  const [selectedConcern, setSelectedConcern] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConcernForm, setShowNewConcernForm] = useState(false);
  const [newConcernData, setNewConcernData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: concerns,
    isLoading: concernsLoading,
    refetch: refetchConcerns,
  } = api.messages.getConcerns.useQuery(
    {
      userType: authDAta?.type as "FARMER" | "ADMIN" | "ORGANIC_FARMER",
      userId: Number(authDAta?.id),
      search: searchTerm,
    },
    {
      enabled: !!authDAta?.type,
    },
  );

  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = api.messages.getMessages.useQuery(
    {
      concernId: selectedConcern!,
      userType: authDAta?.type as "FARMER" | "ADMIN" | "ORGANIC_FARMER",
      userId: authDAta?.id as number,
    },
    { enabled: !!selectedConcern && !!authDAta?.type },
  );

  const sendMessageMutation = api.messages.sendMessage.useMutation({
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      refetchConcerns();
    },
    onError: (error) => {
      alert("Error sending message: " + error.message);
    },
  });

  const createConcernMutation = api.messages.createConcern.useMutation({
    onSuccess: (newConcern) => {
      setShowNewConcernForm(false);
      setNewConcernData({ title: "", description: "", image: "" });
      setSelectedConcern(newConcern.id);
      refetchConcerns();
      alert("Concern created successfully!");
    },
    onError: (error) => {
      alert("Error creating concern: " + error.message);
    },
  });

  const updateConcernStatusMutation =
    api.messages.updateConcernStatus.useMutation({
      onSuccess: () => {
        refetchConcerns();
        alert("Concern status updated!");
      },
      onError: (error) => {
        alert("Error updating status: " + error.message);
      },
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConcern) return;
    sendMessageMutation.mutate({
      concernId: selectedConcern,
      content: newMessage,
      userType: authDAta?.type as "FARMER" | "ADMIN" | "ORGANIC_FARMER",
      userId: authDAta?.id as number,
    });
  };

  const handleCreateConcern = () => {
    if (!newConcernData.title.trim() || !newConcernData.description.trim()) {
      alert("Please fill in title and description");
      return;
    }
    createConcernMutation.mutate({
      title: newConcernData.title,
      description: newConcernData.description,
      image: newConcernData.image,
      userType: authDAta?.type as "FARMER" | "ADMIN" | "ORGANIC_FARMER",
      userId: authDAta?.id as number,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewConcernData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserIcon = (userType: string) => {
    switch (userType) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "ORGANIC_FARMER":
        return <Leaf className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConcerns = concerns?.filter((concern) => {
    const concernDate = new Date(concern.createdAt);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    const isInDateRange = concernDate >= fromDate && concernDate <= toDate;
    const matchesSearch =
      concern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.description.toLowerCase().includes(searchTerm.toLowerCase());
    return isInDateRange && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-4xl font-bold text-transparent">
            Messages & Concerns
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {authDAta?.type === "ADMIN"
              ? "Manage farmer concerns and provide support"
              : "Communicate with administrators about your concerns"}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-emerald-700">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {authDAta?.type === "ADMIN" ? "All Concerns" : "My Concerns"}
                  </CardTitle>
                  {authDAta?.type !== "ADMIN" && (
                    <Button
                      size="sm"
                      onClick={() => setShowNewConcernForm(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Search concerns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[280px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange as any}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {concernsLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={`concern-skeleton-${i}`} className="h-20 w-full" />
                    ))}
                  </div>
                ) : filteredConcerns.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No concerns found</p>
                    {authDAta?.type !== "ADMIN" && (
                      <Button
                        onClick={() => setShowNewConcernForm(true)}
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Concern
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {filteredConcerns.map((concern) => (
                      <div
                        key={concern.id + "-" + crypto.randomUUID()}
                        onClick={() => setSelectedConcern(concern.id)}
                        className={`cursor-pointer border-b p-4 transition-colors hover:bg-emerald-50 ${
                          selectedConcern === concern.id
                            ? "border-emerald-300 bg-emerald-100"
                            : ""
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="line-clamp-1 text-sm font-semibold text-gray-900 b">
                            {concern.title}
                          </h4>
                          <Badge
                            className={`text-xs ${getStatusColor(concern.status)}`}
                          >
                            {concern.status}
                          </Badge>
                        </div>
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                          {concern.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <img
                              width={50}
                              height={50}
                              src={concern.farmer?.farmerImage}
                            />
                            <span className="ml-1">
                              {concern.farmer
                                ? `${concern.farmer.firstname} ${concern.farmer.surname}`
                                : `${concern.organicFarmer?.firstname} ${concern.organicFarmer?.surname}`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(concern.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {concern._count?.messages > 0 && (
                          <div className="mt-2 flex items-center text-xs text-emerald-600">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            {concern._count.messages} message
                            {concern._count.messages !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            {showNewConcernForm ? (
              <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-emerald-700">
                      <Plus className="mr-2 h-5 w-5" />
                      Create New Concern
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewConcernForm(false);
                        setNewConcernData({
                          title: "",
                          description: "",
                          image: "",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <Input
                      value={newConcernData.title}
                      onChange={(e) =>
                        setNewConcernData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter concern title"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <Textarea
                      value={newConcernData.description}
                      onChange={(e) =>
                        setNewConcernData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your concern in detail"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Image (Optional)
                    </label>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {newConcernData.image && (
                        <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                          <Image
                            src={newConcernData.image}
                            alt="Concern image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateConcern}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={createConcernMutation.isPending}
                  >
                    {createConcernMutation.isPending
                      ? "Creating..."
                      : "Create Concern"}
                  </Button>
                </CardContent>
              </Card>
            ) : selectedConcern ? (
              <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-emerald-700">
                        {concerns?.find((c) => c.id === selectedConcern)?.title}
                      </CardTitle>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge
                          className={`text-xs ${getStatusColor(
                            concerns?.find((c) => c.id === selectedConcern)?.status || "",
                          )}`}
                        >
                          {
                            concerns?.find((c) => c.id === selectedConcern)
                              ?.status
                          }
                        </Badge>
                        {authDAta?.type === "ADMIN" && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateConcernStatusMutation.mutate({
                                  concernId: selectedConcern,
                                  status: "IN_PROGRESS",
                                })
                              }
                            >
                              In Progress
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateConcernStatusMutation.mutate({
                                  concernId: selectedConcern,
                                  status: "RESOLVED",
                                })
                              }
                            >
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 h-96 space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton
                            key={`message-skeleton-${i}`}
                            className="h-16 w-full"
                          />
                        ))}
                      </div>
                    ) : messages?.length === 0 ? (
                      <div className="py-8 text-center">
                        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">
                          No messages yet. Start the conversation!
                        </p>
                        {authDAta?.type !== "ADMIN" && (
                          <div className="mt-4 flex flex-col items-center space-y-2">
                            <Button
                              onClick={() => {
                                setNewMessage(
                                  "Hello, I have a concern about...",
                                );
                                setTimeout(() => {
                                  const input = document.querySelector(
                                    'input[placeholder="Type your message..."]',
                                  ) as HTMLInputElement;
                                  input?.focus();
                                }, 100);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              Send First Message
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      messages?.map((message) => (
                        <div
                          key={`message-${message.id}`}
                          className={`flex ${
                            message.senderType === authDAta?.type
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                              message.senderType === authDAta?.type
                                ? "bg-emerald-500 text-white"
                                : "border border-gray-200 bg-white"
                            }`}
                          >
                            <div className="mb-1 flex items-center space-x-2">
                              {getUserIcon(message.senderType)}
                              <span className="text-xs font-medium">
                                {message.senderType === "ADMIN"
                                  ? message.admin?.username
                                  : message.senderType === "FARMER"
                                    ? `${message.farmer?.firstname} ${message.farmer?.surname}`
                                    : `${message.organicFarmer?.firstname} ${message.organicFarmer?.surname}`}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        !newMessage.trim() || sendMessageMutation.isPending
                      }
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardContent className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      {filteredConcerns.length === 0
                        ? "No concerns found"
                        : "Select a concern to view messages"}
                    </h3>
                    <p className="text-gray-500">
                      {filteredConcerns.length === 0
                        ? authDAta?.type !== "ADMIN"
                          ? "You haven't created any concerns yet"
                          : "No concerns have been submitted yet"
                        : "Choose a concern from the list to start or continue the conversation"}
                    </p>
                    {authDAta?.type !== "ADMIN" &&
                      filteredConcerns.length === 0 && (
                        <Button
                          onClick={() => setShowNewConcernForm(true)}
                          className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Concern
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
