"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  MapPin,
  Star,
  Filter,
  List,
  MapIcon,
  User,
  Bell,
  Search,
  Mic,
  Navigation,
  Zap,
  Accessibility,
  Moon,
  Sun,
  Heart,
  Clock,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "../components/theme-provider"
import ChatBot from "../components/ChatBot"
import Footer from "../components/Footer"

// Dynamic import for map to avoid SSR issues
const ParkingMap = dynamic(() => import("../components/ParkingMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-600 dark:text-gray-300 font-medium">Loading Casablanca map...</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Finding the best parking spots for you</div>
      </div>
    </div>
  ),
})

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
  totalSpots: number
  availableSpots: number
  predictedAvailability: number
  isFavorite?: boolean
  hasEVCharging?: boolean
  hasHandicapAccess?: boolean
}

// Enhanced parking spots for Casablanca with AI predictions
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
    totalSpots: 1200,
    availableSpots: 340,
    predictedAvailability: 85,
    features: ["Covered", "Security", "Shopping Center"],
    hasEVCharging: true,
    hasHandicapAccess: true,
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
    totalSpots: 800,
    availableSpots: 120,
    predictedAvailability: 65,
    features: ["Tourist Area", "Security", "24/7 Access"],
    hasEVCharging: false,
    hasHandicapAccess: true,
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
    totalSpots: 600,
    availableSpots: 0,
    predictedAvailability: 15,
    features: ["City Center", "Business District"],
    hasEVCharging: true,
    hasHandicapAccess: false,
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
    totalSpots: 400,
    availableSpots: 89,
    predictedAvailability: 75,
    features: ["Premium", "Valet", "Business Center"],
    hasEVCharging: true,
    hasHandicapAccess: true,
    isFavorite: true,
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
    totalSpots: 300,
    availableSpots: 45,
    predictedAvailability: 55,
    features: ["Beach Access", "Restaurants", "Entertainment"],
    hasEVCharging: false,
    hasHandicapAccess: true,
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
    totalSpots: 500,
    availableSpots: 180,
    predictedAvailability: 70,
    features: ["Train Station", "Public Transport", "Budget"],
    hasEVCharging: false,
    hasHandicapAccess: true,
  },
]

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(mockParkingSpots)
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>(mockParkingSpots)
  const [priceRange, setPriceRange] = useState([0, 50])
  const [maxDistance, setMaxDistance] = useState([5])
  const [minRating, setMinRating] = useState("0")
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)
  const [showEVChargingOnly, setShowEVChargingOnly] = useState(false)
  const [showHandicapAccessOnly, setShowHandicapAccessOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Get user location or default to Casablanca center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Location access denied, using Casablanca center")
          setUserLocation({ lat: 33.5731, lng: -7.5898 })
        },
      )
    } else {
      setUserLocation({ lat: 33.5731, lng: -7.5898 })
    }
  }, [])

  useEffect(() => {
    // Apply filters
    const filtered = parkingSpots.filter((spot) => {
      const priceMatch = spot.price >= priceRange[0] && spot.price <= priceRange[1]
      const distanceMatch = spot.distance <= maxDistance[0]
      const ratingMatch = spot.rating >= Number.parseFloat(minRating)
      const availabilityMatch = showAvailableOnly ? spot.available : true
      const evChargingMatch = showEVChargingOnly ? spot.hasEVCharging : true
      const handicapAccessMatch = showHandicapAccessOnly ? spot.hasHandicapAccess : true
      const searchMatch = searchQuery
        ? spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      return (
        priceMatch &&
        distanceMatch &&
        ratingMatch &&
        availabilityMatch &&
        evChargingMatch &&
        handicapAccessMatch &&
        searchMatch
      )
    })

    setFilteredSpots(filtered)
  }, [
    parkingSpots,
    priceRange,
    maxDistance,
    minRating,
    showAvailableOnly,
    showEVChargingOnly,
    showHandicapAccessOnly,
    searchQuery,
  ])

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert("Speech recognition not supported in this browser")
    }
  }

  const toggleFavorite = (spotId: string) => {
    setParkingSpots((spots) =>
      spots.map((spot) => (spot.id === spotId ? { ...spot, isFavorite: !spot.isFavorite } : spot)),
    )
  }

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 70) return "text-green-600 dark:text-green-400"
    if (availability >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getAvailabilityBadge = (availability: number) => {
    if (availability >= 70) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (availability >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div>
                  <img src="/parking_logo.png" alt="Logo" width={50} height={50} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ParkSmart
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Casablanca, Morocco</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>

              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Search Bar */}
        <div className="mb-6">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search parking spots, areas, or landmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceSearch}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full ${isListening ? "text-red-500 animate-pulse" : "text-gray-400"
                      }`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-gray-200 dark:border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                  <Filter className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Smart Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* View Toggle */}
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="flex-1 transition-all duration-300"
                  >
                    <MapIcon className="h-4 w-4 mr-1" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="flex-1 transition-all duration-300"
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>

                {/* AI Recommendations */}
                <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-200">AI Recommendations</span>
                  </div>
                  <p className="text-xs text-purple-800 dark:text-purple-300">
                    Based on current time and traffic, Morocco Mall has the highest availability prediction (85%)
                  </p>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-900 dark:text-white">
                    Price Range: {priceRange[0]} - {priceRange[1]} MAD/hour
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">
                    Max Distance: {maxDistance[0]} km
                  </label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={10}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                    Minimum Rating
                  </label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="bg-white dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Filters */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <label htmlFor="available" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available only
                      </label>
                    </div>
                    <Switch id="available" checked={showAvailableOnly} onCheckedChange={setShowAvailableOnly} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <label htmlFor="ev-charging" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        EV Charging
                      </label>
                    </div>
                    <Switch id="ev-charging" checked={showEVChargingOnly} onCheckedChange={setShowEVChargingOnly} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Accessibility className="w-4 h-4 text-blue-500" />
                      <label htmlFor="handicap-access" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Handicap Access
                      </label>
                    </div>
                    <Switch
                      id="handicap-access"
                      checked={showHandicapAccessOnly}
                      onCheckedChange={setShowHandicapAccessOnly}
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setPriceRange([0, 50])
                    setMaxDistance([5])
                    setMinRating("0")
                    setShowAvailableOnly(false)
                    setShowEVChargingOnly(false)
                    setShowHandicapAccessOnly(false)
                    setSearchQuery("")
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {viewMode === "map" ? (
              <div className="h-96 lg:h-[600px] rounded-xl overflow-hidden shadow-2xl">
                <ParkingMap
                  parkingSpots={filteredSpots}
                  userLocation={userLocation}
                  selectedSpot={selectedSpot}
                  onSpotSelect={setSelectedSpot}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSpots.map((spot, index) => (
                  <Card
                    key={spot.id}
                    className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-gray-200 dark:border-gray-700 ${selectedSpot === spot.id ? "ring-2 ring-blue-500 shadow-xl" : ""
                      }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{spot.name}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(spot.id)}
                                className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Heart
                                  className={`h-4 w-4 ${spot.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                                    } transition-colors duration-200`}
                                />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={spot.available ? "default" : "secondary"}
                                className={`${spot.available ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"} transition-colors duration-200`}
                              >
                                {spot.available ? "Available" : "Full"}
                              </Badge>
                              <Badge className={`${getAvailabilityBadge(spot.predictedAvailability)} text-xs`}>
                                {spot.predictedAvailability}% predicted
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {spot.address}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {spot.rating}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Navigation className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{spot.distance} km</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-purple-500" />
                              <span className={`text-sm font-bold ${getAvailabilityColor(spot.predictedAvailability)}`}>
                                {spot.availableSpots}/{spot.totalSpots}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {spot.price} MAD/h
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {spot.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700">
                                {feature}
                              </Badge>
                            ))}
                            {spot.hasEVCharging && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300"
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                EV Charging
                              </Badge>
                            )}
                            {spot.hasHandicapAccess && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300"
                              >
                                <Accessibility className="h-3 w-3 mr-1" />
                                Accessible
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Link href={`/booking/${spot.id}`} className="flex-1">
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                            disabled={!spot.available}
                          >
                            {spot.available ? "🚗 Book Now" : "❌ Not Available"}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          onClick={() => {
                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
                            window.open(mapsUrl, "_blank")
                          }}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredSpots.length === 0 && (
                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-4">🚗</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No parking spots found</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Try adjusting your filters or search in a different area.
                      </p>
                      <Button
                        variant="outline"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none hover:from-blue-700 hover:to-purple-700"
                        onClick={() => {
                          setPriceRange([0, 50])
                          setMaxDistance([5])
                          setMinRating("0")
                          setShowAvailableOnly(false)
                          setShowEVChargingOnly(false)
                          setShowHandicapAccessOnly(false)
                          setSearchQuery("")
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {/* AI Chatbot */}
      <ChatBot
        parkingSpots={filteredSpots}
        onBookingRequest={(spotId) => {
          window.location.href = `/booking/${spotId}`
        }}
        onDirectionsRequest={(spotId) => {
          const spot = filteredSpots.find((s) => s.id === spotId)
          if (spot) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`, "_blank")
          }
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}
