"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Car, Bell, Settings, LogOut, Calendar, CreditCard, History, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface User {
  email: string
  name: string
  id: string
}

interface Booking {
  id: string
  spotName: string
  address: string
  date: string
  startTime: string
  endTime: string
  status: "active" | "completed" | "cancelled"
  cost: number
}

const mockBookings: Booking[] = [
  {
    id: "PK1703123456",
    spotName: "Downtown Plaza Parking",
    address: "123 Main St, Downtown",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "17:00",
    status: "active",
    cost: 120,
  },
  {
    id: "PK1703123455",
    spotName: "City Center Garage",
    address: "456 Broadway Ave",
    date: "2024-01-10",
    startTime: "14:00",
    endTime: "18:00",
    status: "completed",
    cost: 48,
  },
  {
    id: "PK1703123454",
    spotName: "Metro Station Parking",
    address: "789 Transit Blvd",
    date: "2024-01-08",
    startTime: "08:00",
    endTime: "12:00",
    status: "completed",
    cost: 32,
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }

    // Add current booking if it exists
    const currentBooking = localStorage.getItem("currentBooking")
    if (currentBooking) {
      const booking = JSON.parse(currentBooking)
      const newBooking: Booking = {
        id: booking.bookingId,
        spotName: booking.spotName,
        address: booking.address,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: "active",
        cost: booking.totalCost,
      }

      // Check if booking already exists
      const exists = bookings.some((b) => b.id === newBooking.id)
      if (!exists) {
        setBookings((prev) => [newBooking, ...prev])
      }
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("currentBooking")
    router.push("/home")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeBookings = bookings.filter((b) => b.status === "active")
  const pastBookings = bookings.filter((b) => b.status !== "active")

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
             
                <img src="/parking_logo.png" alt="Logo" width={50} height={50} />
            
              <h1 className="text-xl font-bold text-gray-900">ParkSmart</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]}!</h2>
              <p className="text-gray-600">Manage your parking bookings and account</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Bookings</p>
                    <p className="text-2xl font-bold">{activeBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold">${bookings.reduce((sum, b) => sum + b.cost, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold">4.8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Active Bookings */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Bookings</h3>
              <Link href="/home">
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Book New Spot
                </Button>
              </Link>
            </div>

            {activeBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active bookings</h3>
                  <p className="text-gray-600 mb-4">You don't have any active parking bookings.</p>
                  <Link href="/">
                    <Button>Find Parking</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold">{booking.spotName}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-3">{booking.address}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-semibold">${booking.cost}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Ticket
                        </Button>
                        <Button variant="outline" size="sm">
                          Get Directions
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Booking History */}
          <TabsContent value="history" className="space-y-4">
            <h3 className="text-lg font-semibold">Booking History</h3>

            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking history</h3>
                  <p className="text-gray-600">Your completed bookings will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold">{booking.spotName}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-3">{booking.address}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-semibold">${booking.cost}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                        <Button variant="outline" size="sm">
                          Rate Experience
                        </Button>
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Settings</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-gray-900">+1 (555) 123-4567</p>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Vehicle</label>
                    <p className="text-gray-900">ABC-1234</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notifications</label>
                    <p className="text-gray-900">Email & Push</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Method</label>
                    <p className="text-gray-900">•••• •••• •••• 1234</p>
                  </div>
                  <Button variant="outline">Update Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
