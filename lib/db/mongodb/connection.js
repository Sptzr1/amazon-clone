// Este archivo solo debe ejecutarse en el servidor
import { MongoClient } from "mongodb"

// URI de conexión a MongoDB (desde variables de entorno)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amazonclone"

// Cliente de MongoDB
let client
let clientPromise

if (!MONGODB_URI) {
  throw new Error("Por favor, define la variable de entorno MONGODB_URI")
}

// En Next.js, necesitamos verificar que este código solo se ejecute en el servidor
if (typeof window === "undefined") {
  // En desarrollo, usamos una variable global para preservar la conexión entre recargas de HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Este código no debería ejecutarse en el cliente
  console.warn("MongoDB connection attempted on client side")
  clientPromise = null
}

export default clientPromise
