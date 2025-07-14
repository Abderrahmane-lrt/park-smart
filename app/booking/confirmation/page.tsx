"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, MapPin, Clock, Car, QrCode, Download, Share } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface BookingData {
  spotId: string
  spotName: string
  address: string
  date: string
  startTime: string
  endTime: string
  vehicleNumber: string
  duration: number
  totalCost: number
  bookingId: string
}

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    // Get booking data from localStorage
    const bookingData = localStorage.getItem("currentBooking")
    if (bookingData) {
      const parsedBooking = JSON.parse(bookingData)
      setBooking(parsedBooking)

      // Generate QR code URL (using a QR code API)
      const qrData = `ParkSmart Booking: ${parsedBooking.bookingId}`
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`)
    }
  }, [])

  const downloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    alert("Ticket download functionality would be implemented here")
  }

  const shareTicket = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: "ParkSmart Booking Confirmation",
        text: `Parking booked at ${booking.spotName} for ${format(new Date(booking.date), "PPP")}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Booking link copied to clipboard!")
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No booking found</h2>
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
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Booking Confirmation</h1>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message */}
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your parking spot has been successfully reserved.</p>
        </div>

        {/* Booking Ticket */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Car className="h-5 w-5 mr-2" />
              Digital Parking Ticket
            </CardTitle>
            <Badge variant="default" className="mx-auto">
              Booking ID: {booking.bookingId}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-32 h-32 mx-auto" />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Show this QR code at the parking entrance</p>
            </div>

            <Separator />

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{booking.spotName}</p>
                  <p className="text-sm text-gray-600">{booking.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{format(new Date(booking.date), "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-sm text-gray-600">
                    {booking.startTime} - {booking.endTime} ({booking.duration} hours)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Car className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Vehicle: {booking.vehicleNumber}</p>
                  <p className="text-sm text-gray-600">Make sure this matches your vehicle</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Cost Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{booking.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>${(booking.totalCost / booking.duration).toFixed(2)}/hour</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total Paid:</span>
                  <span>${booking.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-900">Important Reminders</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Arrive within 15 minutes of your start time</li>
                <li>• Keep this confirmation handy for entry/exit</li>
                <li>• Contact support if you need to modify your booking</li>
                <li>• Late arrivals may result in booking cancellation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={downloadTicket} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          <Button onClick={shareTicket} variant="outline" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Share Booking
          </Button>
          <Link href="/home" className="flex-1">
            <Button className="w-full">Book Another Spot</Button>
          </Link>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-6 p-4 bg-white rounded-lg border">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@parksmart.com" className="text-blue-600 hover:underline">
              support@parksmart.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
