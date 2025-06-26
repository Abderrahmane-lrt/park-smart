"use client"

import { useEffect, useRef } from "react"

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

interface ParkingMapProps {
  parkingSpots: ParkingSpot[]
  userLocation: { lat: number; lng: number } | null
  selectedSpot?: string | null
  onSpotSelect?: (spotId: string) => void
}

export default function ParkingMap({ parkingSpots, userLocation, selectedSpot, onSpotSelect }: ParkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      // Load CSS first
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        link.crossOrigin = ""
        document.head.appendChild(link)

        await new Promise((resolve) => {
          link.onload = resolve
          setTimeout(resolve, 1000)
        })
      }

      // Load JavaScript
      if (!(window as any).L) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          script.crossOrigin = ""
          script.onload = () => {
            setTimeout(resolve, 100)
          }
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
    }

    const initializeMap = async () => {
      if (!mapRef.current) return

      try {
        await loadLeaflet()

        const L = (window as any).L
        if (!L) {
          console.error("Leaflet failed to load")
          return
        }

        // Clear any existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        // Fix for default markers
        if (L.Icon && L.Icon.Default) {
          delete L.Icon.Default.prototype._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          })
        }

        // Initialize map centered on Casablanca, Morocco
        const casablancaCenter = [33.5731, -7.5898]
        const map = L.map(mapRef.current, {
          center: casablancaCenter,
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
        })

        mapInstanceRef.current = map

        // Add enhanced tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        // Add user location marker with enhanced styling
        if (userLocation) {
          const userIcon = L.divIcon({
            html: `
              <div style="
                position: relative;
                width: 20px;
                height: 20px;
              ">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 12px;
                  height: 12px;
                  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                "></div>
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 24px;
                  height: 24px;
                  background: rgba(59, 130, 246, 0.2);
                  border-radius: 50%;
                  animation: pulse 2s infinite;
                "></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            className: "user-location-marker",
          })

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup("📍 Your Location")
        }

        // Add parking spot markers with enhanced styling
        const markers = []
        parkingSpots.forEach((spot) => {
          const isSelected = selectedSpot === spot.id
          const markerColor = spot.available ? "#10b981" : "#ef4444"
          const markerSize = isSelected ? 44 : 36
          const markerIcon = spot.available ? "P" : "X"

          // Enhanced availability indicator
          const availabilityColor =
            spot.predictedAvailability >= 70 ? "#10b981" : spot.predictedAvailability >= 40 ? "#f59e0b" : "#ef4444"

          const customIcon = L.divIcon({
            html: `
              <div style="
                position: relative;
                width: ${markerSize}px;
                height: ${markerSize}px;
              ">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: ${markerSize - 8}px;
                  height: ${markerSize - 8}px;
                  background: linear-gradient(45deg, ${markerColor}, ${markerColor}dd);
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: ${markerSize > 36 ? "16px" : "14px"};
                  font-weight: bold;
                  font-family: Arial, sans-serif;
                  ${isSelected ? "animation: bounce 1s infinite;" : ""}
                ">
                  ${markerIcon}
                </div>
                ${
                  spot.hasEVCharging
                    ? `
                  <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background: #fbbf24;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                  ">⚡</div>
                `
                    : ""
                }
                ${
                  spot.hasHandicapAccess
                    ? `
                  <div style="
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background: #3b82f6;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                  ">♿</div>
                `
                    : ""
                }
                <div style="
                  position: absolute;
                  top: -8px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 20px;
                  height: 4px;
                  background: ${availabilityColor};
                  border-radius: 2px;
                  border: 1px solid white;
                "></div>
              </div>
            `,
            iconSize: [markerSize + 8, markerSize + 8],
            iconAnchor: [(markerSize + 8) / 2, (markerSize + 8) / 2],
            className: "parking-marker",
          })

          const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map)
          markers.push(marker)

          // Enhanced popup content
          const popupContent = `
            <div style="min-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: -12px -16px 16px -16px;
                padding: 16px;
                border-radius: 8px 8px 0 0;
                color: white;
              ">
                <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 18px;">${spot.name}</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px;">📍 ${spot.address}</p>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px;">
                  <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${spot.price}</div>
                  <div style="font-size: 12px; color: #64748b;">MAD/hour</div>
                </div>
                <div style="text-align: center; padding: 12px; background: ${spot.available ? "#f0fdf4" : "#fef2f2"}; border-radius: 8px;">
                  <div style="font-size: 14px; font-weight: bold; color: ${spot.available ? "#16a34a" : "#dc2626"};">
                    ${spot.available ? "✓ Available" : "✗ Full"}
                  </div>
                  <div style="font-size: 12px; color: #64748b;">${spot.availableSpots}/${spot.totalSpots} spots</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #fbbf24;">★</span>
                  <span style="font-weight: 600;">${spot.rating}</span>
                  <span style="color: #64748b;">•</span>
                  <span style="color: #64748b;">${spot.distance} km</span>
                </div>
                <div style="
                  padding: 4px 8px;
                  background: ${spot.predictedAvailability >= 70 ? "#dcfce7" : spot.predictedAvailability >= 40 ? "#fef3c7" : "#fee2e2"};
                  color: ${spot.predictedAvailability >= 70 ? "#166534" : spot.predictedAvailability >= 40 ? "#92400e" : "#991b1b"};
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                ">
                  ${spot.predictedAvailability}% predicted
                </div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${spot.features
                    .map(
                      (feature) => `
                    <span style="
                      display: inline-block;
                      background: #e2e8f0;
                      color: #475569;
                      padding: 4px 8px;
                      border-radius: 6px;
                      font-size: 11px;
                      font-weight: 500;
                    ">${feature}</span>
                  `,
                    )
                    .join("")}
                  ${
                    spot.hasEVCharging
                      ? `
                    <span style="
                      display: inline-block;
                      background: #fef3c7;
                      color: #92400e;
                      padding: 4px 8px;
                      border-radius: 6px;
                      font-size: 11px;
                      font-weight: 500;
                    ">⚡ EV Charging</span>
                  `
                      : ""
                  }
                  ${
                    spot.hasHandicapAccess
                      ? `
                    <span style="
                      display: inline-block;
                      background: #dbeafe;
                      color: #1e40af;
                      padding: 4px 8px;
                      border-radius: 6px;
                      font-size: 11px;
                      font-weight: 500;
                    ">♿ Accessible</span>
                  `
                      : ""
                  }
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${
                  spot.available
                    ? `
                  <button 
                    onclick="window.location.href='/booking/${spot.id}'"
                    style="
                      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                      color: white;
                      border: none;
                      padding: 12px 16px;
                      border-radius: 8px;
                      font-weight: 600;
                      font-size: 14px;
                      cursor: pointer;
                      transition: all 0.2s;
                    "
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                  >
                    🚗 Book Now
                  </button>
                `
                    : `
                  <div style="
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 12px 16px;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ❌ Not Available
                  </div>
                `
                }
                <button 
                  onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}', '_blank')"
                  style="
                    background: white;
                    color: #3b82f6;
                    border: 2px solid #3b82f6;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                  "
                  onmouseover="this.style.background='#3b82f6'; this.style.color='white'"
                  onmouseout="this.style.background='white'; this.style.color='#3b82f6'"
                >
                  🧭 Directions
                </button>
              </div>
            </div>
          `

          marker.bindPopup(popupContent, {
            maxWidth: 320,
            className: "custom-popup",
          })

          // Add click handler for spot selection
          marker.on("click", () => {
            if (onSpotSelect) {
              onSpotSelect(spot.id)
            }
          })
        })

        // Fit map to show all markers if we have parking spots
        if (markers.length > 0) {
          const group = new L.FeatureGroup(markers)
          const bounds = group.getBounds()
          const paddedBounds = bounds.pad(0.1)
          map.fitBounds(paddedBounds)

          if (map.getZoom() > 15) {
            map.setZoom(15)
          }
        }

        // Add custom CSS for enhanced styling
        const style = document.createElement("style")
        style.textContent = `
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: none;
            padding: 0;
          }
          .custom-popup .leaflet-popup-tip {
            background: white;
          }
          .custom-popup .leaflet-popup-content {
            margin: 12px 16px;
          }
          
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            70% {
              transform: translate(-50%, -50%) scale(1.4);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.4);
              opacity: 0;
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translate(-50%, -50%) translateY(0);
            }
            40% {
              transform: translate(-50%, -50%) translateY(-10px);
            }
            60% {
              transform: translate(-50%, -50%) translateY(-5px);
            }
          }
        `
        document.head.appendChild(style)
      } catch (error) {
        console.error("Error initializing map:", error)
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              height: 100%; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 40px;
              border-radius: 12px;a
            ">
              <div style="font-size: 64px; margin-bottom: 24px;">🗺️</div>
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 12px;">Map Loading Error</div>
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 24px;">Unable to load the interactive map</div>
              <button onclick="window.location.reload()" style="
                background: rgba(255,255,255,0.2);
                border: 2px solid white;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
              ">
                Refresh Page
              </button>
            </div>
          `
        }
      }
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [parkingSpots, userLocation, selectedSpot])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl"
      style={{ minHeight: "400px" }}
    >
      <div className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-300">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
        </div>
        <div className="text-lg font-semibold mb-2">Loading Casablanca map...</div>
        <div className="text-sm opacity-75">Discovering the best parking spots for you</div>
      </div>
    </div>
  )
}
