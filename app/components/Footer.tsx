"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Shield,
  Award,
  Zap,
  Clock,
  Globe,
  Heart,
  ArrowRight,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div>
                  <img src="/parking_logo.png" alt="Logo" width={50} height={50} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ParkSmart
                </h3>
                <p className="text-sm text-gray-300">Casablanca, Morocco</p>
              </div>
            </div>

            <p className="text-gray-400 dark:text-gray-200 leading-relaxed">
              AI-powered smart parking solution for Casablanca. Find, book, and pay for parking spots with ease. Making
              urban mobility smarter, one parking spot at a time.
            </p>

            {/* Key Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400 dark:text-gray-200">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>AI-Powered Predictions</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400 dark:text-gray-200">
                <Clock className="h-4 w-4 text-green-400" />
                <span>Real-time Availability</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400 dark:text-gray-200">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400 dark:text-gray-200">
                <Globe className="h-4 w-4 text-purple-400" />
                <span>Multilingual Support</span>
              </div>
            </div>

            {/* App Download */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-200">Download Our App</p>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <Download className="h-4 w-4 mr-2" />
                  iOS App
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <Download className="h-4 w-4 mr-2" />
                  Android
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Find Parking</span>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>My Dashboard</span>
                </div>
              </Link>
              <Link
                href="/auth/login"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Sign In</span>
                </div>
              </Link>
              <Link
                href="/auth/signup"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Create Account</span>
                </div>
              </Link>
            </div>

            <div className="space-y-3">
              <h5 className="text-md font-medium text-gray-200">Popular Areas</h5>
              <div className="space-y-2 text-sm">
                <Link
                  href="/?area=maarif"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Maarif District
                </Link>
                <Link
                  href="/?area=ain-diab"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Ain Diab
                </Link>
                <Link
                  href="/?area=hassan-mosque"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Hassan II Mosque
                </Link>
                <Link
                  href="/?area=corniche"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Corniche Beach
                </Link>
              </div>
            </div>
          </div>

          {/* Support & Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Support & Legal</h4>
            <div className="space-y-3">
              <Link
                href="/help"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Help Center</span>
                </div>
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Contact Us</span>
                </div>
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Privacy Policy</span>
                </div>
              </Link>
              <Link
                href="/terms"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Terms of Service</span>
                </div>
              </Link>
              <Link
                href="/accessibility"
                className="block text-gray-400 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>Accessibility</span>
                </div>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <h5 className="text-md font-medium text-gray-200">Trusted & Secure</h5>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-xs">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-400">Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Stay Connected</h4>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                <a
                  href="mailto:support@parksmart.ma"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  support@parksmart.ma
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+212522123456" className="text-gray-400 hover:text-white transition-colors duration-200">
                  +212 522 123 456
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400">Casablanca, Morocco</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h5 className="text-md font-medium text-gray-200">Newsletter</h5>
              <p className="text-sm text-gray-400">Get updates on new parking spots and features</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h5 className="text-md font-medium text-gray-200">Follow Us</h5>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Facebook className="h-4 w-4 text-blue-400" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Twitter className="h-4 w-4 text-sky-400" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Instagram className="h-4 w-4 text-pink-400" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Linkedin className="h-4 w-4 text-blue-500" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Youtube className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-gray-300">
            <span>© {currentYear} ParkSmart. All rights reserved.</span>
            <span>•</span>
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>in Morocco</span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-200">
              Sitemap
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
              Cookie Policy
            </Link>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <select className="bg-transparent text-gray-400 text-sm border-none focus:outline-none">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
