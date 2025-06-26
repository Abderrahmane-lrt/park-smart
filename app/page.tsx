"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative flex flex-col min-h-screen">
      {/* Background overlay gradient */}
      <div />

      {/* Background image */}
      <div className="absolute inset-0 z-0 backdrop-blur-sm sm:backdrop-blur-none">
        <Image
          src="/back-hero.png"
          alt="Casablanca"
          fill
          className="object-cover sm:opacity-100 opacity-50"
        />
      </div>

      {/* Top navigation */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/parking_logo.png"
            alt="Smart Parking Logo"
            width={100}
            height={100}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-md"
          />
          <span className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent">
            Parksmart
          </span>
        </div>

        {/* Login Button */}
        <nav>
          <Link href="/auth/login">
            <Button
              variant="outline"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-6 md:px-10 mt-24 sm:mt-32">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold mb-6 sm:mb-10 leading-tight max-w-xl">
          A smart solution for finding parking spaces in{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent">
            Casablanca
          </span>
        </h1>

        <p className="text-gray-600 py-2">Start booking your spot in 3 easy steps</p>

        <Link href="/home" className="mt-4">
          <button className="w-full sm:w-auto bg-gradient-to-br from-gray-500 via-blue-500 to-purple-600 text-white py-3 px-6 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:scale-105 transition transform duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
