// Este archivo actúa como punto de entrada para la capa de base de datos
// Exporta funciones que pueden ser usadas tanto en el cliente como en el servidor

// Importamos las implementaciones disponibles
import * as dummyDb from "./dummy"

// Por defecto, usamos la implementación dummy para desarrollo
// En producción, se usará la implementación configurada en el entorno
export default dummyDb

// Exportamos un indicador para saber si estamos en el servidor
export const isServer = typeof window === "undefined"

// Exportamos una función para obtener el repositorio adecuado
// Esta función debe ser llamada solo en el servidor
export async function getRepository() {
  // Solo importamos el factory en el servidor para evitar errores en el cliente
  if (isServer) {
    const { getRepositoryInstance } = await import("./repository-factory")
    return getRepositoryInstance()
  }

  throw new Error("getRepository solo puede ser llamado en el servidor")
}
