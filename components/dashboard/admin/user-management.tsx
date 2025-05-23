"use client"

import { useState } from "react"
import { User, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateUserRole, deleteUser } from "@/services/user-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface UserManagementProps {
  users: UserData[]
  currentUserId: string
}

export function UserManagement({ users, currentUserId }: UserManagementProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return

    setIsLoading((prev) => ({ ...prev, [selectedUser.id]: true }))

    try {
      await updateUserRole(selectedUser.id, selectedRole)
      toast({
        title: "Rol actualizado",
        description: `El usuario ahora tiene el rol de ${selectedRole}.`,
      })
      setIsEditDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [selectedUser.id]: false }))
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setIsLoading((prev) => ({ ...prev, [selectedUser.id]: true }))

    try {
      await deleteUser(selectedUser.id)
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [selectedUser.id]: false }))
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "user":
        return <Badge variant="outline">Usuario</Badge>
      case "seller":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Vendedor
          </Badge>
        )
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Admin
          </Badge>
        )
      case "superadmin":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            SuperAdmin
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Usuarios Registrados</CardTitle>
          <Input
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user)
                          setSelectedRole(user.role)
                          setIsEditDialogOpen(true)
                        }}
                        disabled={isLoading[user.id] || user.id === currentUserId}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                        disabled={isLoading[user.id] || user.id === currentUserId}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
            <DialogDescription>Selecciona el nuevo rol para {selectedUser?.name}.</DialogDescription>
          </DialogHeader>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuario</SelectItem>
              <SelectItem value="seller">Vendedor</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="superadmin">Super Administrador</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole} disabled={isLoading[selectedUser?.id || ""] || !selectedRole}>
              {isLoading[selectedUser?.id || ""] ? "Actualizando..." : "Actualizar Rol"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente al usuario {selectedUser?.name} y todos sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading[selectedUser?.id || ""]}>
              {isLoading[selectedUser?.id || ""] ? "Eliminando..." : "Eliminar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
