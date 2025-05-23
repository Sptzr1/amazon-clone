import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Electrónica",
    image: "/placeholder.svg?height=200&width=200",
    slug: "electronics",
  },
  {
    id: 2,
    name: "Hogar",
    image: "/placeholder.svg?height=200&width=200",
    slug: "home",
  },
  {
    id: 3,
    name: "Moda",
    image: "/placeholder.svg?height=200&width=200",
    slug: "fashion",
  },
  {
    id: 4,
    name: "Libros",
    image: "/placeholder.svg?height=200&width=200",
    slug: "books",
  },
  {
    id: 5,
    name: "Deportes",
    image: "/placeholder.svg?height=200&width=200",
    slug: "sports",
  },
  {
    id: 6,
    name: "Juguetes",
    image: "/placeholder.svg?height=200&width=200",
    slug: "toys",
  },
  {
    id: 7,
    name: "Belleza",
    image: "/placeholder.svg?height=200&width=200",
    slug: "beauty",
  },
  {
    id: 8,
    name: "Alimentación",
    image: "/placeholder.svg?height=200&width=200",
    slug: "grocery",
  },
  {
    id: 9,
    name: "Automotriz",
    image: "/placeholder.svg?height=200&width=200",
    slug: "automotive",
  },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products/${category.slug}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-4 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-3">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <h3 className="text-center font-medium">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
