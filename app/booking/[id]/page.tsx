"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Star, Clock, CreditCard, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface ParkingSpot {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  price: number
  rating: number
  distance: number
  available: boolean
  features: string[]
}

// Updated parking spots for Casablanca
const mockParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Morocco Mall Parking",
    address: "Boulevard de l'Océan Atlantique, Ain Diab",
    lat: 33.5731,
    lng: -7.6298,
    price: 25,
    rating: 4.6,
    distance: 0.3,
    available: true,
    features: ["Covered", "Security", "Shopping Center"],
  },
  {
    id: "2",
    name: "Hassan II Mosque Parking",
    address: "Boulevard Sidi Mohammed Ben Abdallah",
    lat: 33.6084,
    lng: -7.6325,
    price: 15,
    rating: 4.3,
    distance: 0.8,
    available: true,
    features: ["Tourist Area", "Security", "24/7 Access"],
  },
  {
    id: "3",
    name: "Maarif District Parking",
    address: "Boulevard Zerktouni, Maarif",
    lat: 33.5892,
    lng: -7.6164,
    price: 20,
    rating: 4.1,
    distance: 0.5,
    available: false,
    features: ["City Center", "Business District"],
  },
  {
    id: "4",
    name: "Twin Center Parking",
    address: "Boulevard Zerktouni, Maarif",
    lat: 33.5908,
    lng: -7.6147,
    price: 30,
    rating: 4.7,
    distance: 0.6,
    available: true,
    features: ["Premium", "Valet", "Business Center"],
  },
  {
    id: "5",
    name: "Corniche Parking",
    address: "Boulevard de la Corniche, Ain Diab",
    lat: 33.5698,
    lng: -7.6389,
    price: 18,
    rating: 4.2,
    distance: 1.1,
    available: true,
    features: ["Beach Access", "Restaurants", "Entertainment"],
  },
  {
    id: "6",
    name: "Casa Port Station Parking",
    address: "Boulevard Mohammed V, Centre Ville",
    lat: 33.5969,
    lng: -7.6192,
    price: 12,
    rating: 3.9,
    distance: 0.4,
    available: true,
    features: ["Train Station", "Public Transport", "Budget"],
  },
  {
    id: "7",
    name: "Anfa Place Parking",
    address: "Boulevard d'Anfa, Anfa",
    lat: 33.5847,
    lng: -7.6267,
    price: 22,
    rating: 4.4,
    distance: 0.7,
    available: false,
    features: ["Shopping", "Restaurants", "Covered"],
  },
  {
    id: "8",
    name: "Old Medina Parking",
    address: "Place des Nations Unies, Ancienne Médina",
    lat: 33.5928,
    lng: -7.6147,
    price: 10,
    rating: 3.6,
    distance: 0.9,
    available: true,
    features: ["Historic Area", "Walking Distance", "Budget"],
  },
]

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [spot, setSpot] = useState<ParkingSpot | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [duration, setDuration] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    const foundSpot = mockParkingSpots.find((s) => s.id === params.id)
    setSpot(foundSpot || null)
  }, [params.id])

  useEffect(() => {
    if (startTime && endTime && spot) {
      const start = new Date(`2024-01-01 ${startTime}`)
      const end = new Date(`2024-01-01 ${endTime}`)
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      if (diffHours > 0) {
        setDuration(diffHours)
        setTotalCost(diffHours * spot.price)
      } else {
        setDuration(0)
        setTotalCost(0)
      }
    }
  }, [startTime, endTime, spot])

  const handleBooking = () => {
    if (!selectedDate || !startTime || !endTime || !vehicleNumber || !spot) {
      alert("Please fill in all required fields")
      return
    }

    // Create booking data
    const bookingData = {
      spotId: spot.id,
      spotName: spot.name,
      address: spot.address,
      date: selectedDate,
      startTime,
      endTime,
      vehicleNumber,
      duration,
      totalCost,
      bookingId: `PK${Date.now()}`,
    }

    // Store booking data in localStorage for demo
    localStorage.setItem("currentBooking", JSON.stringify(bookingData))

    // Redirect to confirmation page
    router.push("/booking/confirmation")
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Parking spot not found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Book Parking - Casablanca</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parking Spot Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Parking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{spot.name}</h3>
                <p className="text-gray-600">{spot.address}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{spot.rating}</span>
                </div>
                <span className="text-gray-500">{spot.distance} km away</span>
                <span className="text-lg font-bold text-blue-600">{spot.price} MAD/hour</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {spot.features.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Important Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Arrive within 15 minutes of your booking time</li>
                  <li>• Keep your booking confirmation handy</li>
                  <li>• Contact support for any issues</li>
                  <li>• Payment in Moroccan Dirham (MAD)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Selection */}
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vehicle Number */}
              <div>
                <Label htmlFor="vehicleNumber">Vehicle Number (Morocco format)</Label>
                <Input
                  id="vehicleNumber"
                  placeholder="e.g., 123456 ب 12 or A 123456"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>

              {/* Cost Summary */}
              {duration > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>{spot.price} MAD/hour</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{totalCost.toFixed(2)} MAD</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <Label>Payment Method</Label>
                <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Payment will be processed after confirmation</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Accepts Moroccan cards and international payments</p>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={!selectedDate || !startTime || !endTime || !vehicleNumber || duration <= 0}
              >
                Confirm Booking - {totalCost.toFixed(2)} MAD
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
