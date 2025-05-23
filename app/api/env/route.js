import { NextResponse } from "next/server"

// Esta ruta es solo para mostrar las variables de entorno que se deben configurar
export async function GET() {
  return NextResponse.json({
    message: "Estas son las variables de entorno que debes configurar en tu archivo .env.local",
    variables: [
      {
        name: "MONGODB_URI",
        description: "URI de conexión a MongoDB",
        example: "mongodb://localhost:27017/amazonclone",
      },
      {
        name: "DB_IMPLEMENTATION",
        description: "Implementación de base de datos a usar (mongodb o dummy)",
        example: "mongodb",
        default: "mongodb",
      },
    ],
  })
}
