import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {

  User,

} from "lucide-react"

export default function LandingPage() {
  return (
    <main className="relative flex flex-col min-h-screen">
      {/* Background overlay gradient */}
      <div />

      {/* Optional background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/back-hero.png" 
          alt="Casablanca"
          fill
          className="object-cover "
        />
      </div>

      {/* Top nav/logo */}
      <header className="relative z-10 w-full px-6 py-1 flex  items-center justify-between">
        <div className='flex'>

        <Image
          src="/parking_logo.png"
          alt="Smart Parking Logo"
          width={80}
          height={80}
          className="rounded-md "
        /><span className='font-bold text-3xl  bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent pt-7'>Parksmart</span>
        </div>

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

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col  px-6 mt-32">
        <h1 className="text-4xl md:text-4xl text-black font-bold mb-10 leading-tight max-w-xl ">
          A smart solution for finding parking spaces in  <span className='font-bold mb-20  leading-tight max-w-xl bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent'>Casablanca</span>
        </h1>

        <p className='text-gray-600 py-2 ps-2'>Start booking your spot in 3 easy steps</p>
        <Link href="/home">
          <button className=" bg-gradient-to-br from-gray-500 via-blue-500 to-purple-600 text-white py-3 px-10 rounded-full text-lg font-semibold shadow-lg hover:scale-105 hover:bg-blue-50 transition transform duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
