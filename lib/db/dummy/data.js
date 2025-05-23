// Categorías principales
const categories = ["electronics", "home", "fashion", "books", "sports", "toys", "beauty", "grocery", "automotive"]

// Subcategorías por categoría
const subcategories = {
  electronics: ["smartphones", "laptops", "tablets", "cameras", "audio", "accessories", "tvs", "gaming"],
  home: ["furniture", "kitchen", "decor", "bedding", "bath", "appliances", "lighting", "storage"],
  fashion: ["men", "women", "kids", "shoes", "accessories", "jewelry", "watches", "bags"],
  books: ["fiction", "non-fiction", "children", "textbooks", "comics", "magazines", "ebooks", "audiobooks"],
  sports: ["fitness", "outdoor", "team-sports", "water-sports", "winter-sports", "cycling", "camping", "clothing"],
  toys: ["action-figures", "dolls", "educational", "games", "puzzles", "outdoor", "building", "electronic"],
  beauty: ["skincare", "makeup", "haircare", "fragrance", "tools", "bath-body", "mens-grooming", "sets"],
  grocery: ["snacks", "beverages", "breakfast", "canned", "baking", "dairy", "produce", "organic"],
  automotive: ["parts", "accessories", "tools", "electronics", "exterior", "interior", "tires", "oils"],
}

// Datos base para productos
export const dummyProducts = {
  electronics: [
    {
      id: "e1",
      title: "Smartphone XYZ Pro",
      description: "El último smartphone con cámara de alta resolución y batería de larga duración.",
      price: 699.99,
      oldPrice: 799.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      subcategory: "smartphones",
      rating: 4.5,
      reviews: 128,
      stock: 50,
      freeShipping: true,
      featured: true,
    },
    {
      id: "e2",
      title: 'Laptop UltraBook 15"',
      description: "Potente laptop con procesador de última generación y pantalla de alta resolución.",
      price: 1299.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      subcategory: "laptops",
      rating: 4.8,
      reviews: 95,
      stock: 20,
      freeShipping: true,
      featured: false,
    },
    {
      id: "e3",
      title: "Auriculares Inalámbricos",
      description: "Auriculares con cancelación de ruido y batería de larga duración.",
      price: 149.99,
      oldPrice: 199.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      subcategory: "audio",
      rating: 4.3,
      reviews: 210,
      stock: 100,
      freeShipping: true,
      featured: true,
    },
  ],
  home: [
    {
      id: "h1",
      title: "Sofá Modular 3 Plazas",
      description: "Sofá cómodo y elegante para tu sala de estar.",
      price: 599.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "home",
      subcategory: "furniture",
      rating: 4.4,
      reviews: 56,
      stock: 10,
      freeShipping: false,
      featured: true,
    },
    {
      id: "h2",
      title: "Juego de Sábanas Premium",
      description: "Sábanas de algodón egipcio de alta calidad.",
      price: 89.99,
      oldPrice: 119.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "home",
      subcategory: "bedding",
      rating: 4.7,
      reviews: 112,
      stock: 80,
      freeShipping: true,
      featured: false,
    },
  ],
  fashion: [
    {
      id: "f1",
      title: "Chaqueta de Cuero Premium",
      description: "Chaqueta de cuero genuino con forro interior.",
      price: 199.99,
      oldPrice: 249.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "fashion",
      subcategory: "men",
      rating: 4.7,
      reviews: 68,
      stock: 25,
      freeShipping: true,
      featured: true,
    },
    {
      id: "f2",
      title: "Zapatillas Deportivas",
      description: "Zapatillas cómodas para correr o entrenar.",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "fashion",
      subcategory: "shoes",
      rating: 4.5,
      reviews: 124,
      stock: 50,
      freeShipping: true,
      featured: false,
    },
  ],
}

// Función para generar un número aleatorio entre min y max
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Función para generar un precio aleatorio
function randomPrice(min, max) {
  return Number.parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

// Función para generar un booleano aleatorio con probabilidad
function randomBoolean(probability = 0.5) {
  return Math.random() < probability
}

// Función para generar un producto aleatorio
function generateRandomProduct(category, index) {
  const subcategory = subcategories[category][randomNumber(0, subcategories[category].length - 1)]
  const price = randomPrice(10, 1500)
  const hasDiscount = randomBoolean(0.3) // 30% de probabilidad de tener descuento
  const oldPrice = hasDiscount ? price * (1 + randomNumber(10, 30) / 100) : null

  return {
    id: `${category.charAt(0)}${index}`,
    title: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Premium ${index}`,
    description: `Producto de alta calidad en la categoría ${category}, subcategoría ${subcategory}.`,
    price,
    oldPrice,
    // Usamos una URL de placeholder genérica que siempre funciona
    image: `https://placehold.co/300x300/CCCCCC/333333?text=${category}-${subcategory}`,
    category,
    subcategory,
    rating: Number.parseFloat((3 + Math.random() * 2).toFixed(1)), // Rating entre 3 y 5
    reviews: randomNumber(5, 300),
    stock: randomNumber(0, 100),
    freeShipping: randomBoolean(0.7), // 70% de probabilidad de envío gratis
    featured: randomBoolean(0.2), // 20% de probabilidad de ser destacado
  }
}

// Función para generar más productos (al menos 100 en total)
export function generateMoreProducts() {
  const products = { ...dummyProducts }

  // Asegurarnos de que cada categoría tenga al menos 10 productos
  categories.forEach((category) => {
    if (!products[category]) {
      products[category] = []
    }

    const currentCount = products[category].length
    const neededCount = Math.max(0, 10 - currentCount)

    for (let i = 0; i < neededCount; i++) {
      const index = currentCount + i + 1
      products[category].push(generateRandomProduct(category, index))
    }
  })

  // Generar productos adicionales para llegar a al menos 100 en total
  const totalProducts = Object.values(products).flat().length
  const neededAdditional = Math.max(0, 100 - totalProducts)

  if (neededAdditional > 0) {
    // Distribuir los productos adicionales entre las categorías
    const productsPerCategory = Math.ceil(neededAdditional / categories.length)

    categories.forEach((category) => {
      const currentCount = products[category].length

      for (let i = 0; i < productsPerCategory; i++) {
        const index = currentCount + i + 1
        products[category].push(generateRandomProduct(category, index))
      }
    })
  }

  return products
}
