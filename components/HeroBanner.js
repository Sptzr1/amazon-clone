"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const banners = [
  {
    id: 1,
    image: "/placeholder.svg?height=500&width=1200",
    title: "Ofertas exclusivas",
    description: "Descubre nuestras mejores ofertas del día",
    link: "/offers",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=500&width=1200",
    title: "Nueva colección",
    description: "Descubre las últimas tendencias en moda",
    link: "/products/fashion",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=500&width=1200",
    title: "Tecnología de vanguardia",
    description: "Los mejores dispositivos electrónicos",
    link: "/products/electronics",
  },
]

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentBanner ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner.image || "/placeholder.svg"}
            alt={banner.title}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{banner.title}</h2>
            <p className="text-lg text-white mb-4">{banner.description}</p>
            <Link
              href={banner.link}
              className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium inline-block hover:bg-yellow-500 transition-colors w-fit"
            >
              Ver más
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentBanner ? "bg-yellow-400" : "bg-white/50"}`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </div>
  )
}
