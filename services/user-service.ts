import {
  getUsers,
  getUserById as dbGetUserById,
  updateUser as dbUpdateUser,
  deleteUser as dbDeleteUser,
} from "@/lib/db"

// Obtener todos los usuarios
export async function getAllUsers() {
  return getUsers()
}

// Obtener un usuario por ID
export async function getUserById(id: string) {
  return dbGetUserById(id)
}

// Obtener perfil de usuario
export async function getUserProfile(id: string) {
  return dbGetUserById(id)
}

// Actualizar perfil de usuario
export async function updateUserProfile(id: string, data: any) {
  return dbUpdateUser(id, data)
}

// Actualizar rol de usuario
export async function updateUserRole(id: string, role: string) {
  return dbUpdateUser(id, { role })
}

// Eliminar un usuario
export async function deleteUser(id: string) {
  return dbDeleteUser(id)
}
