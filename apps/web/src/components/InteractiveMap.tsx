import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface InteractiveMapProps {
  center?: [number, number]
  zoom?: number
  height?: string
}

export function InteractiveMap({ 
  center = [20.5937, 78.9629], 
  zoom = 6,
  height = '100%'
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Sample project locations
    const projects = [
      { name: 'Sundarbans Restoration', coords: [22.2587, 88.9414], status: 'active' },
      { name: 'Kerala Backwaters', coords: [9.9312, 76.2673], status: 'active' },
      { name: 'Gujarat Coastal', coords: [22.2587, 70.7729], status: 'completed' },
      { name: 'Maharashtra Coast', coords: [19.0760, 72.8777], status: 'active' },
    ]

    // Add markers for projects
    projects.forEach(project => {
      L.marker(project.coords as [number, number])
        .addTo(map)
        .bindPopup(`
          <div style="font-family: Inter, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${project.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              Status: <span style="color: ${project.status === 'active' ? '#10B981' : '#3B82F6'}; font-weight: 500;">
                ${project.status}
              </span>
            </p>
          </div>
        `)
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom])

  return (
    <Box
      ref={mapRef}
      h={height}
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
    />
  )
}
