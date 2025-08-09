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
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";

// Mock user session - replace with your actual auth
const mockUser = {
  id: 1,
  type: "ADMIN" as "ADMIN" | "FARMER" | "ORGANIC_FARMER",
  name: "Admin User",
};

const Page = () => {
  const [selectedConcern, setSelectedConcern] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConcernForm, setShowNewConcernForm] = useState(false);
  const [newConcernData, setNewConcernData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch concerns based on user type
  const {
    data: concerns,
    isLoading: concernsLoading,
    refetch: refetchConcerns,
  } = api.messages.getConcerns.useQuery({
    userType: mockUser.type,
    userId: mockUser.id,
    search: searchTerm,
  });

  // Fetch messages for selected concern
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = api.messages.getMessages.useQuery(
    { concernId: selectedConcern! },
    { enabled: !!selectedConcern },
  );

  // Send message mutation
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

  // Create concern mutation (for farmers/organic farmers)
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

  // Update concern status (admin only)
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

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConcern) return;

    sendMessageMutation.mutate({
      concernId: selectedConcern,
      content: newMessage,
      userType: mockUser.type,
      userId: mockUser.id,
    });
  };

  // Handle create concern
  const handleCreateConcern = () => {
    if (!newConcernData.title.trim() || !newConcernData.description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    createConcernMutation.mutate({
      title: newConcernData.title,
      description: newConcernData.description,
      image: newConcernData.image,
      userType: mockUser.type,
      userId: mockUser.id,
    });
  };

  // Handle image upload
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

  // Get user icon based on type
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

  // Get status color
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

  // Filter concerns based on search
  const filteredConcerns =
    concerns?.filter(
      (concern) =>
        concern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concern.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-4xl font-bold text-transparent">
            Messages & Concerns
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {mockUser.type === "ADMIN"
              ? "Manage farmer concerns and provide support"
              : "Communicate with administrators about your concerns"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Concerns List */}
          <div className="lg:col-span-1">
            <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-emerald-700">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {mockUser.type === "ADMIN" ? "All Concerns" : "My Concerns"}
                  </CardTitle>
                  {mockUser.type !== "ADMIN" && (
                    <Button
                      size="sm"
                      onClick={() => setShowNewConcernForm(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search concerns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {concernsLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton
                        key={`concern-skeleton-${i}`}
                        className="h-20 w-full"
                      />
                    ))}
                  </div>
                ) : filteredConcerns.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No concerns found</p>
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
                          <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">
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
                            {getUserIcon(
                              concern.farmer ? "FARMER" : "ORGANIC_FARMER",
                            )}
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

          {/* Messages Area */}
          <div className="lg:col-span-2">
            {showNewConcernForm ? (
              /* New Concern Form */
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
                            src={newConcernData.image || "/placeholder.svg"}
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
              /* Messages View */
              <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-emerald-700">
                        {concerns?.find((c) => c.id === selectedConcern)?.title}
                      </CardTitle>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge
                          className={`text-xs ${getStatusColor(concerns?.find((c) => c.id === selectedConcern)?.status || "")}`}
                        >
                          {
                            concerns?.find((c) => c.id === selectedConcern)
                              ?.status
                          }
                        </Badge>
                        {mockUser.type === "ADMIN" && (
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
                  {/* Messages */}
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
                      </div>
                    ) : (
                      messages?.map((message) => (
                        <div
                          key={`message-${message.id}`}
                          className={`flex ${message.senderType === mockUser.type ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                              message.senderType === mockUser.type
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

                  {/* Message Input */}
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
              /* No Selection */
              <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardContent className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      Select a concern to view messages
                    </h3>
                    <p className="text-gray-500">
                      Choose a concern from the list to start or continue the
                      conversation
                    </p>
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
