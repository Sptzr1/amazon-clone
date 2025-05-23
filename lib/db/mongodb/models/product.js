// Definición del esquema de producto para MongoDB
export const productSchema = {
  id: String,
  title: String,
  description: String,
  price: Number,
  oldPrice: Number,
  image: String,
  category: String,
  subcategory: String,
  rating: Number,
  reviews: Number,
  stock: Number,
  freeShipping: Boolean,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date,
}

// Función para validar un producto
export function validateProduct(product) {
  // Aquí podrías implementar validaciones más complejas
  return product && product.title && product.price && product.category
}
