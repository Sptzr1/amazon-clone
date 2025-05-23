"use server"

import { cookies } from "next/headers";
import { getRepository } from "@/lib/db/index";
import { mockUsers } from "./mocked-users";
/* import { getSession } from "@auth0/nextjs-auth0"; */
import {auth0} from "@/lib/auth/auth0.ts"
import { ManagementClient } from "auth0";

/* const auth0 = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace("https://", "") || "",
  clientId: process.env.AUTH0_CLIENT_ID || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
});
 */
export async function getCurrentUser() {
  if (process.env.AUTH0_MOCK === "true") {
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) return null;
    try {
      return JSON.parse(sessionCookie.value);
    } catch (error) {
      console.error("Error al parsear la cookie de sesión:", error);
      return null;
    }
  }
const session = await auth0.getSession()
return session?.user || null;
}

export async function requestPasswordReset(formData) {
  const email = formData.get("email") ;

  if (process.env.AUTH0_MOCK === "true") {
    const user = mockUsers.find((u) => u.email === email);
    if (!user) return { success: false, error: "No se encontró el usuario" };
    return { success: true, message: "Correo de restablecimiento enviado (mock)" };
  }

  try {
    await auth0.tickets.changePassword({
      email,
      connection_id: process.env.AUTH0_CONNECTION_ID || "", // Asegúrate de configurar esta variable en tu .env.local
    });
    return { success: true, message: "Correo de restablecimiento enviado" };
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    return { success: false, error: "Error al solicitar restablecimiento" };
  }
}
