// Este archivo NO importa mongodb directamente
// Solo proporciona una función para obtener una conexión cuando sea necesario

let mongoClient = null
let mongoDb = null

export async function getMongoClient() {
  // Solo importamos mongodb cuando se llama a esta función
  // y solo en el servidor
  if (typeof window !== "undefined") {
    throw new Error("Esta función solo debe llamarse desde el servidor")
  }

  // Si ya tenemos un cliente, lo reutilizamos
  if (mongoClient) {
    return { client: mongoClient, db: mongoDb }
  }

  try {
    // Importación dinámica de mongodb
    const { MongoClient } = await import("mongodb")

    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI no está configurada")
    }

    // Crear un nuevo cliente
    mongoClient = new MongoClient(uri)

    // Conectar al cliente
    await mongoClient.connect()

    // Obtener la base de datos
    mongoDb = mongoClient.db()

    // Configurar el cierre limpio en desarrollo
    if (process.env.NODE_ENV === "development") {
      // Limpiar la conexión al reiniciar el servidor
      process.on("SIGTERM", async () => {
        await mongoClient.close()
        mongoClient = null
        mongoDb = null
      })
    }

    return { client: mongoClient, db: mongoDb }
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error)
    throw error
  }
}
