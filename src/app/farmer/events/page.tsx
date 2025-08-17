"use client";

import type React from "react";

import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Leaf,
  X,
  Plus,
  Edit,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";

const EventsCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    Eventdate: "",
    What: "",
    Where: "",
    Image: "",
    Note: "",
    forFarmersOnly: true,
    forOgranicsFarmersOnly: true,
  });

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Fetch events for the current month
  const {
    data: events,
    isLoading,
    refetch,
  } = api.events.getEventsByMonth.useQuery({
    month: currentMonth + 1,
    year: currentYear,
  });

  // Create event mutation
  const createEventMutation = api.events.createEvent.useMutation({
    onSuccess: () => {
      alert("Event created successfully!");
      refetch();
      resetForm();
      setShowCreateForm(false);
    },
    onError: (error) => {
      alert("Error creating event: " + error.message);
    },
  });

  // Update event mutation
  const updateEventMutation = api.events.updateEvent.useMutation({
    onSuccess: () => {
      alert("Event updated successfully!");
      refetch();
      setEditingEvent(null);
      resetForm();
    },
    onError: (error) => {
      alert("Error updating event: " + error.message);
    },
  });

  // Delete event mutation
  const deleteEventMutation = api.events.deleteEvent.useMutation({
    onSuccess: () => {
      alert("Event deleted successfully!");
      refetch();
    },
    onError: (error) => {
      alert("Error deleting event: " + error.message);
    },
  });

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate || !events) return [];

    const selectedDateStr = selectedDate.toDateString();
    return events.filter((event) => {
      const eventDate = new Date(event.Eventdate);
      return eventDate.toDateString() === selectedDateStr;
    });
  }, [selectedDate, events]);

  // Create events map for quick lookup
  const eventsMap = useMemo(() => {
    if (!events) return new Map();

    const map = new Map<string, typeof events>();
    events.forEach((event) => {
      const dateKey = new Date(event.Eventdate).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });

    return map;
  }, [events]);

  // Reset form
  const resetForm = () => {
    setFormData({
      Eventdate: "",
      What: "",
      Where: "",
      Image: "",
      Note: "",
      forFarmersOnly: true,
      forOgranicsFarmersOnly: true,
    });
    setImagePreview(null);
    setUploadedImageUrl(null);
    setEditingEvent(null);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // In a real app, you would upload to a service like Cloudinary, AWS S3, etc.
        // For demo purposes, we'll use the data URL
        setUploadedImageUrl(result);
        setFormData((prev) => ({ ...prev, Image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Eventdate || !formData.What || !formData.Where) {
      alert("Please fill in all required fields");
      return;
    }

    const eventData = {
      ...formData,
      Eventdate: new Date(formData.Eventdate),
      Image: uploadedImageUrl || formData.Image,
    };

    if (editingEvent) {
      updateEventMutation.mutate({
        id: editingEvent,
        ...eventData,
      });
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  // Start editing event
  const startEditingEvent = (event: any) => {
    setEditingEvent(event.id);
    setFormData({
      Eventdate: new Date(event.Eventdate).toISOString().slice(0, 16),
      What: event.What,
      Where: event.Where,
      Image: event.Image || "",
      Note: event.Note,
      forFarmersOnly: event.forFarmersOnly,
      forOgranicsFarmersOnly: event.forOgranicsFarmersOnly,
    });
    setImagePreview(event.Image);
    setUploadedImageUrl(event.Image);
    setShowCreateForm(true);
  };

  // Delete event
  const handleDeleteEvent = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate({ id: eventId });
    }
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setShowEventDetails(false);
    setShowCreateForm(false);
    resetForm();
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setShowEventDetails(false);
    setShowCreateForm(false);
    resetForm();
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setShowEventDetails(false);
    setShowCreateForm(false);
    resetForm();
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    setShowEventDetails(true);
    setShowCreateForm(false);
    resetForm();
  };

  // Handle create new event
  const handleCreateNewEvent = () => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0, 16);
      setFormData((prev) => ({ ...prev, Eventdate: dateStr }));
    }
    setShowCreateForm(true);
    setShowEventDetails(false);
    resetForm();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const hasEvents = (day: number) => {
    const dateKey = new Date(currentYear, currentMonth, day).toDateString();
    return eventsMap.has(dateKey);
  };

  const getEventCount = (day: number) => {
    const dateKey = new Date(currentYear, currentMonth, day).toDateString();
    return eventsMap.get(dateKey)?.length || 0;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-4xl font-bold text-transparent">
            Events Calendar
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            View, create, and manage agricultural events
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar Card */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-emerald-700">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousMonth}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToToday}
                      disabled={isLoading}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextMonth}
                      disabled={isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-2">
                      {dayNames.map((dayName) => (
                        <div
                          key={dayName}
                          className="rounded-lg bg-gray-50 p-2 text-center text-sm font-medium text-gray-600"
                        >
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, index) => (
                        <div
                          key={index}
                          className={`relative h-16 cursor-pointer rounded-lg border-2 p-1 transition-all duration-200 ${
                            day === null
                              ? "cursor-default border-transparent"
                              : hasEvents(day)
                                ? "border-emerald-300 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          } ${day !== null && isToday(day) ? "ring-2 ring-blue-500 ring-offset-1" : ""} ${
                            day !== null && isSelected(day)
                              ? "bg-emerald-100 ring-2 ring-emerald-500 ring-offset-1"
                              : ""
                          } `}
                          onClick={() => day !== null && handleDayClick(day)}
                        >
                          {day !== null && (
                            <>
                              <div
                                className={`text-sm font-medium ${isToday(day) ? "text-blue-600" : "text-gray-900"} ${isSelected(day) ? "text-emerald-700" : ""} `}
                              >
                                {day}
                              </div>
                              {hasEvents(day) && (
                                <div className="absolute right-1 bottom-1">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                                    {getEventCount(day)}
                                  </div>
                                </div>
                              )}
                              {hasEvents(day) && (
                                <div className="absolute bottom-1 left-1">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Create/Edit Event Form */}
            {showCreateForm && (
              <Card className="mb-6 border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-emerald-700">
                    <div className="flex items-center">
                      {editingEvent ? (
                        <Edit className="mr-2 h-5 w-5" />
                      ) : (
                        <Plus className="mr-2 h-5 w-5" />
                      )}
                      {editingEvent ? "Edit Event" : "Create New Event"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCreateForm(false);
                        resetForm();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Event Date & Time */}
                    <div>
                      <Label htmlFor="eventdate">Date & Time *</Label>
                      <Input
                        id="eventdate"
                        type="datetime-local"
                        value={formData.Eventdate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Eventdate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    {/* Event Title */}
                    <div>
                      <Label htmlFor="what">Event Title *</Label>
                      <Input
                        id="what"
                        value={formData.What}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            What: e.target.value,
                          }))
                        }
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="where">Location *</Label>
                      <Input
                        id="where"
                        value={formData.Where}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Where: e.target.value,
                          }))
                        }
                        placeholder="Enter event location"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label htmlFor="image">Event Image</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                        {imagePreview && (
                          <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Event preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview(null);
                                setUploadedImageUrl(null);
                                setFormData((prev) => ({ ...prev, Image: "" }));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="note">Notes</Label>
                      <Textarea
                        id="note"
                        value={formData.Note}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Note: e.target.value,
                          }))
                        }
                        placeholder="Additional event details..."
                        rows={3}
                      />
                    </div>

                    {/* Audience */}
                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="farmers"
                          checked={formData.forFarmersOnly}
                          onCheckedChange={(checked: any) =>
                            setFormData((prev) => ({
                              ...prev,
                              forFarmersOnly: checked as boolean,
                            }))
                          }
                        />
                        <Label htmlFor="farmers" className="text-sm">
                          For Farmers
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="organic"
                          checked={formData.forOgranicsFarmersOnly}
                          onCheckedChange={(checked: any) =>
                            setFormData((prev) => ({
                              ...prev,
                              forOgranicsFarmersOnly: checked as boolean,
                            }))
                          }
                        />
                        <Label htmlFor="organic" className="text-sm">
                          For Organic Farmers
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={
                        createEventMutation.isPending ||
                        updateEventMutation.isPending
                      }
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingEvent ? "Update Event" : "Create Event"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Event Details */}
            <Card className="border-emerald-200 bg-white/90 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-emerald-700">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Event Details
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    {selectedDate && !showCreateForm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateNewEvent}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {showEventDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowEventDetails(false);
                          setSelectedDate(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div> */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showEventDetails || !selectedDate ? (
                  <div className="py-8 text-center">
                    <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">
                      Click on a calendar day to view events
                    </p>
                  </div>
                ) : selectedDateEvents.length === 0 ? (
                  <div className="py-8 text-center">
                    <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No Events
                    </h3>
                    <p className="mb-4 text-gray-500">
                      No events scheduled for{" "}
                      {selectedDate.toLocaleDateString()}
                    </p>
                    <Button
                      onClick={handleCreateNewEvent}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <Badge variant="outline" className="mt-2">
                        {selectedDateEvents.length} Event
                        {selectedDateEvents.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>

                    <div className="max-h-96 space-y-4 overflow-y-auto">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 transition-colors hover:bg-emerald-50"
                        >
                          {/* Event Actions */}
                          <div className="mb-3 flex justify-end space-x-2">
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditingEvent(event)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button> */}
                            {/* <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button> */}
                          </div>

                          {/* Event Image */}
                          {event.Image && (
                            <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                              <Image
                                src={event.Image || "/placeholder.svg"}
                                alt={event.What}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "/placeholder.svg?height=128&width=256";
                                }}
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Event Details */}
                          <h4 className="mb-2 font-semibold text-gray-900">
                            {event.What}
                          </h4>

                          <div className="mb-2 flex items-center text-sm text-gray-600">
                            <MapPin className="mr-1 h-4 w-4" />
                            {event.Where}
                          </div>

                          <div className="mb-3 flex items-center text-sm text-gray-600">
                            <Clock className="mr-1 h-4 w-4" />
                            {new Date(event.Eventdate).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>

                          <div className="mb-3 flex flex-wrap gap-2">
                            {event.forFarmersOnly && (
                              <Badge variant="secondary" className="text-xs">
                                <Users className="mr-1 h-3 w-3" />
                                Farmers
                              </Badge>
                            )}
                            {event.forOgranicsFarmersOnly && (
                              <Badge variant="secondary" className="text-xs">
                                <Leaf className="mr-1 h-3 w-3" />
                                Organic Farmers
                              </Badge>
                            )}
                          </div>

                          {event.Note && (
                            <div className="rounded border bg-white p-3 text-sm text-gray-700">
                              <p className="mb-1 font-medium">Notes:</p>
                              <p>{event.Note}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-6 border-emerald-200 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border-2 border-emerald-300 bg-emerald-50"></div>
                <span className="text-gray-600">Has Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border-2 border-blue-500 bg-white"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border-2 border-emerald-500 bg-emerald-100"></div>
                <span className="text-gray-600">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Event Count</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventsCalendarPage;
